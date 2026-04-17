import jwt from 'jsonwebtoken';

type DocusignConfig = {
  baseUrl: string;
  oauthBaseUrl: string;
  integrationKey: string;
  userId: string;
  accountId: string;
  templateId: string;
  templateRoleName: string;
  privateKey: string;
};

type ResponseBody = Record<string, unknown> | string | null;

export class DocusignConfigError extends Error {
  statusCode = 503;

  constructor(message: string) {
    super(message);
    this.name = 'DocusignConfigError';
  }
}

export class DocusignRequestError extends Error {
  statusCode = 502;
  details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown>) {
    super(message);
    this.name = 'DocusignRequestError';
    this.details = details;
  }
}

function normalizeRestApiBaseUrl(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) {
    throw new DocusignConfigError('DOCUSIGN_BASE_URL is required.');
  }

  const parsed = new URL(raw);
  const pathname = parsed.pathname.replace(/\/$/, '');

  if (!pathname.endsWith('/restapi')) {
    parsed.pathname = `${pathname}/restapi`;
  }

  return parsed.toString().replace(/\/$/, '');
}

function normalizeOauthBaseUrl(value: string | undefined) {
  const raw = value?.trim();
  if (!raw) {
    throw new DocusignConfigError('DOCUSIGN_OAUTH_BASE_URL is required.');
  }

  return new URL(raw).origin;
}

function sanitizePrivateKey(value: string | undefined) {
  let raw = value?.trim() || '';

  // Handle accidental copy/paste like: DOCUSIGN_PRIVATE_KEY=DOCUSIGN_PRIVATE_KEY="..."
  if (raw.startsWith('DOCUSIGN_PRIVATE_KEY=')) {
    raw = raw.slice('DOCUSIGN_PRIVATE_KEY='.length).trim();
  }

  const hasWrappedDoubleQuotes = raw.startsWith('"') && raw.endsWith('"');
  const hasWrappedSingleQuotes = raw.startsWith("'") && raw.endsWith("'");
  if (hasWrappedDoubleQuotes || hasWrappedSingleQuotes) {
    raw = raw.slice(1, -1);
  }

  return raw.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();
}

function assertPrivateKeyLooksValid(privateKey: string) {
  const hasBegin = /-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(privateKey);
  const hasEnd = /-----END [A-Z ]+PRIVATE KEY-----/.test(privateKey);

  if (!hasBegin || !hasEnd) {
    throw new DocusignConfigError(
      'DOCUSIGN_PRIVATE_KEY is not a valid PEM private key. Ensure it contains BEGIN/END PRIVATE KEY markers and does not include a duplicated DOCUSIGN_PRIVATE_KEY= prefix.'
    );
  }
}

export function getDocusignConfig(): DocusignConfig {
  const missing = [
    ['DOCUSIGN_BASE_URL', process.env.DOCUSIGN_BASE_URL],
    ['DOCUSIGN_OAUTH_BASE_URL', process.env.DOCUSIGN_OAUTH_BASE_URL],
    ['DOCUSIGN_INTEGRATION_KEY', process.env.DOCUSIGN_INTEGRATION_KEY],
    ['DOCUSIGN_USER_ID', process.env.DOCUSIGN_USER_ID],
    ['DOCUSIGN_ACCOUNT_ID', process.env.DOCUSIGN_ACCOUNT_ID],
    ['DOCUSIGN_PRIVATE_KEY', process.env.DOCUSIGN_PRIVATE_KEY],
    ['DOCUSIGN_TEMPLATE_ID', process.env.DOCUSIGN_TEMPLATE_ID],
    ['DOCUSIGN_TEMPLATE_ROLE_NAME', process.env.DOCUSIGN_TEMPLATE_ROLE_NAME],
  ]
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new DocusignConfigError(
      `DocuSign configuration is incomplete. Missing: ${missing.join(', ')}.`
    );
  }

  const privateKey = sanitizePrivateKey(process.env.DOCUSIGN_PRIVATE_KEY);
  assertPrivateKeyLooksValid(privateKey);

  return {
    baseUrl: normalizeRestApiBaseUrl(process.env.DOCUSIGN_BASE_URL),
    oauthBaseUrl: normalizeOauthBaseUrl(process.env.DOCUSIGN_OAUTH_BASE_URL),
    integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY!.trim(),
    userId: process.env.DOCUSIGN_USER_ID!.trim(),
    accountId: process.env.DOCUSIGN_ACCOUNT_ID!.trim(),
    templateId: process.env.DOCUSIGN_TEMPLATE_ID!.trim(),
    templateRoleName: process.env.DOCUSIGN_TEMPLATE_ROLE_NAME!.trim(),
    privateKey,
  };
}

async function readResponseBody(response: Response): Promise<ResponseBody> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return text;
  }
}

function buildJwtAssertion(config: DocusignConfig) {
  const issuedAt = Math.floor(Date.now() / 1000);
  try {
    return jwt.sign(
      {
        iss: config.integrationKey,
        sub: config.userId,
        aud: new URL(config.oauthBaseUrl).host,
        iat: issuedAt,
        exp: issuedAt + 300,
        scope: 'signature impersonation',
      },
      config.privateKey as jwt.Secret,
      {
        algorithm: 'RS256',
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new DocusignConfigError(
      `DOCUSIGN_PRIVATE_KEY could not be parsed for RS256 signing (${message}).`
    );
  }
}

async function fetchAccessToken(config: DocusignConfig, vendorId: string, recipientEmail: string) {
  const assertion = buildJwtAssertion(config);
  const response = await fetch(`${config.oauthBaseUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });

  const body = await readResponseBody(response);
  if (!response.ok) {
    console.error('[docusign] JWT token request failed', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
    });
    throw new DocusignRequestError('DocuSign token request failed.', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
      step: 'token',
    });
  }

  const accessToken = typeof body === 'object' && body ? String(body.access_token || '') : '';
  if (!accessToken) {
    console.error('[docusign] JWT token response missing access_token', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
    });
    throw new DocusignRequestError('DocuSign token response did not include an access token.', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
      step: 'token',
    });
  }

  return accessToken;
}

async function createEnvelope(
  config: DocusignConfig,
  accessToken: string,
  vendorId: string,
  vendorName: string,
  recipientEmail: string
) {
  const response = await fetch(
    `${config.baseUrl}/v2.1/accounts/${config.accountId}/envelopes`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailSubject: `Agreement ready for signature - ${vendorName}`,
        emailBlurb: `Please review and sign the partnership agreement for ${vendorName}.`,
        templateId: config.templateId,
        templateRoles: [
          {
            name: vendorName,
            email: recipientEmail,
            roleName: config.templateRoleName,
          },
        ],
        status: 'sent',
      }),
    }
  );

  const body = await readResponseBody(response);
  if (!response.ok) {
    const envelopeId =
      typeof body === 'object' && body ? String(body.envelopeId || body.envelope_id || '') : '';

    console.error('[docusign] envelope creation failed', {
      vendorId,
      recipientEmail,
      envelopeId: envelopeId || null,
      httpStatus: response.status,
      responseBody: body,
    });

    throw new DocusignRequestError('DocuSign envelope creation failed.', {
      vendorId,
      recipientEmail,
      envelopeId: envelopeId || null,
      httpStatus: response.status,
      responseBody: body,
      step: 'create-envelope',
    });
  }

  const envelopeId =
    typeof body === 'object' && body ? String(body.envelopeId || body.envelope_id || '') : '';

  if (!envelopeId) {
    console.error('[docusign] envelope creation response missing envelopeId', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
    });
    throw new DocusignRequestError('DocuSign envelope response did not include an envelope id.', {
      vendorId,
      recipientEmail,
      envelopeId: null,
      httpStatus: response.status,
      responseBody: body,
      step: 'create-envelope',
    });
  }

  return {
    envelopeId,
    deliveryStatus: typeof body === 'object' && body ? String(body.status || 'sent') : 'sent',
    responseBody: body,
  };
}

async function verifyEnvelopeStatus(
  config: DocusignConfig,
  accessToken: string,
  vendorId: string,
  recipientEmail: string,
  envelopeId: string
) {
  const response = await fetch(
    `${config.baseUrl}/v2.1/accounts/${config.accountId}/envelopes/${envelopeId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const body = await readResponseBody(response);
  if (!response.ok) {
    console.warn('[docusign] envelope verification failed', {
      vendorId,
      recipientEmail,
      envelopeId,
      httpStatus: response.status,
      responseBody: body,
    });
    return null;
  }

  const status = typeof body === 'object' && body ? String(body.status || '') : '';
  return status || null;
}

export async function sendAgreementEnvelope({
  vendorId,
  vendorName,
  recipientEmail,
}: {
  vendorId: string;
  vendorName: string;
  recipientEmail: string;
}) {
  const config = getDocusignConfig();
  const accessToken = await fetchAccessToken(config, vendorId, recipientEmail);
  const envelope = await createEnvelope(config, accessToken, vendorId, vendorName, recipientEmail);
  const verifiedStatus =
    (await verifyEnvelopeStatus(config, accessToken, vendorId, recipientEmail, envelope.envelopeId)) ||
    envelope.deliveryStatus;

  return {
    provider: 'docusign',
    envelopeId: envelope.envelopeId,
    status: verifiedStatus,
    sentAt: new Date().toISOString(),
    recipientEmail,
    vendorName,
  };
}

type RecipientDiagnostics = {
  recipientStatus: string | null;
  recipientDeliveredAt: string | null;
  recipientSentAt: string | null;
  recipientName: string | null;
  recipientEmail: string | null;
};

function pickFirstRecipient(body: ResponseBody) {
  if (!body || typeof body !== 'object') return null;

  const recipients = body as Record<string, unknown>;
  const candidateGroups = [
    recipients.signers,
    recipients.recipients,
    recipients.ccRecipients,
    recipients.carbonCopies,
    recipients.agentRecipients,
  ];

  for (const group of candidateGroups) {
    if (!Array.isArray(group) || group.length === 0) continue;
    const first = group[0];
    if (first && typeof first === 'object') {
      return first as Record<string, unknown>;
    }
  }

  return null;
}

export async function fetchEnvelopeRecipientDiagnostics({
  vendorId,
  envelopeId,
  recipientEmail,
}: {
  vendorId: string;
  envelopeId: string;
  recipientEmail: string;
}): Promise<RecipientDiagnostics | null> {
  let config: DocusignConfig;

  try {
    config = getDocusignConfig();
  } catch (error) {
    if (error instanceof DocusignConfigError) {
      return null;
    }
    throw error;
  }

  const accessToken = await fetchAccessToken(config, vendorId, recipientEmail);

  // If only one recipient exists, DocuSign returns the signer in the recipients payload.
  // We use this to surface whether DocuSign considers the email sent/delivered.
  const response = await fetch(
    `${config.baseUrl}/v2.1/accounts/${config.accountId}/envelopes/${envelopeId}/recipients`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const body = await readResponseBody(response);
  if (!response.ok) {
    console.warn('[docusign] recipient diagnostics failed', {
      vendorId,
      envelopeId,
      recipientEmail,
      httpStatus: response.status,
      responseBody: body,
    });
    return null;
  }

  const recipient = pickFirstRecipient(body);
  if (!recipient) return null;

  return {
    recipientStatus: typeof recipient.status === 'string' ? recipient.status : null,
    recipientDeliveredAt:
      typeof recipient.deliveredDateTime === 'string'
        ? recipient.deliveredDateTime
        : typeof recipient.delivered_at === 'string'
          ? recipient.delivered_at
          : null,
    recipientSentAt:
      typeof recipient.sentDateTime === 'string'
        ? recipient.sentDateTime
        : typeof recipient.sent_at === 'string'
          ? recipient.sent_at
          : null,
    recipientName: typeof recipient.name === 'string' ? recipient.name : null,
    recipientEmail: typeof recipient.email === 'string' ? recipient.email : recipientEmail,
  };
}
