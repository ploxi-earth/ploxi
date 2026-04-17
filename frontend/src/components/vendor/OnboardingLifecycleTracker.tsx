import { ReactNode } from 'react';
import {
  AlertIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FileIcon,
} from '@/components/vendor/VendorIcons';

interface OnboardingHistoryEntry {
  stage: string;
  updatedAt: string;
  note?: string;
}

interface OnboardingLifecycleTrackerProps {
  stages: string[];
  stageLabels: Record<string, string>;
  stageDescriptions: Record<string, string>;
  stageIndex: number;
  history?: OnboardingHistoryEntry[];
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementViewedAt?: string;
  agreementSignedAt?: string;
  agreementSentToEmail?: string;
  agreementEnvelopeId?: string;
  agreementDeliveryStatus?: string;
  agreementRecipientStatus?: string;
  agreementRecipientDeliveredAt?: string;
  agreementRecipientSentAt?: string;
  agreementRecipientName?: string;
  agreementRecipientEmail?: string;
  showAgreementDetails?: boolean;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingStatus?: string | null;
  meetingInfoNote?: string;
  introMeetingAction?: ReactNode;
  locale?: string;
  wrapperClassName?: string;
}

function formatMeetingStatus(status?: string | null) {
  if (!status) return 'Scheduled';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OnboardingLifecycleTracker({
  stages,
  stageLabels,
  stageDescriptions,
  stageIndex,
  history,
  agreementStatus,
  agreementSentAt,
  agreementViewedAt,
  agreementSignedAt,
  agreementSentToEmail,
  agreementEnvelopeId,
  agreementDeliveryStatus,
  agreementRecipientStatus,
  agreementRecipientDeliveredAt,
  agreementRecipientSentAt,
  agreementRecipientName,
  agreementRecipientEmail,
  showAgreementDetails = true,
  meetingDate,
  meetingTime,
  meetingLink,
  meetingStatus,
  meetingInfoNote,
  introMeetingAction,
  locale = 'en-IN',
  wrapperClassName = 'max-w-2xl',
}: OnboardingLifecycleTrackerProps) {
  const progressPct =
    stageIndex >= stages.length ? 100 : Math.round(((stageIndex + 1) / stages.length) * 100);

  return (
    <div className={wrapperClassName}>
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-700">Overall Progress</p>
          <p className="text-sm font-bold text-primary-600">{progressPct}%</p>
        </div>
        <div className="h-2 rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              stageIndex >= stages.length ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, i) => {
          const completed = i < stageIndex;
          const current = i === stageIndex;
          const pending = i > stageIndex;
          const histEntry = history?.find((h) => h.stage === stage);

          return (
            <div
              key={stage}
              className={`flex gap-4 rounded-xl border bg-white p-5 transition-all ${
                current
                  ? 'border-primary-300 shadow-sm ring-1 ring-primary-200'
                  : completed
                  ? 'border-gray-100'
                  : 'border-gray-100 opacity-60'
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  completed
                    ? 'bg-primary-500 text-white'
                    : current
                    ? 'border-2 border-primary-500 bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {completed ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : current ? (
                  <ClockIcon className="h-5 w-5" />
                ) : (
                  <AlertIcon className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`text-sm font-semibold ${
                      completed
                        ? 'text-gray-700'
                        : current
                        ? 'text-primary-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {stageLabels[stage]}
                  </p>
                  {current && (
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                      Current
                    </span>
                  )}
                  {completed && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Done
                    </span>
                  )}
                  {pending && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{stageDescriptions[stage]}</p>
                {histEntry && (
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDate(histEntry.updatedAt, locale)}
                    {histEntry.note && ` - ${histEntry.note}`}
                  </p>
                )}

                {stage === 'intro_meeting_scheduled' && meetingDate && (current || completed) && (
                  <div className="mt-3 space-y-1 rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-medium text-blue-800">
                      <CalendarIcon className="h-4 w-4" /> {meetingDate}
                      {meetingTime ? ` at ${meetingTime}` : ''}
                    </p>
                    <p className="text-xs text-blue-700">Status: {formatMeetingStatus(meetingStatus)}</p>
                    {meetingInfoNote && (
                      <p className="text-xs text-blue-700">{meetingInfoNote}</p>
                    )}
                    {meetingLink && (
                      <a
                        href={meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}

                {stage === 'intro_meeting_scheduled' && current && introMeetingAction}

                {(stage === 'agreement_sent' || stage === 'agreement_signed') &&
                  agreementStatus &&
                  agreementStatus !== 'not_sent' &&
                  (current || completed) && (
                    <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3">
                      <p className="flex items-center gap-2 text-xs font-medium text-amber-800">
                        {agreementStatus === 'signed' ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4" /> Agreement Signed
                          </>
                        ) : agreementStatus === 'viewed' ? (
                          <>
                            <FileIcon className="h-4 w-4" /> Agreement Viewed - Pending Signature
                          </>
                        ) : (
                          <>
                            <FileIcon className="h-4 w-4" /> Agreement Sent - Pending Signature
                          </>
                        )}
                      </p>
                      {agreementSentAt && (
                        <p className="mt-1 text-xs text-amber-600">Sent: {formatDate(agreementSentAt, locale)}</p>
                      )}
                      {agreementSentToEmail && (
                        <p className="mt-1 text-xs text-amber-700">Sent to: {agreementSentToEmail}</p>
                      )}
                      {showAgreementDetails && agreementEnvelopeId && (
                        <p className="mt-1 break-all text-xs text-amber-700">Envelope ID: {agreementEnvelopeId}</p>
                      )}
                      {showAgreementDetails && agreementDeliveryStatus && (
                        <p className="mt-1 text-xs text-amber-700">
                          DocuSign status: {agreementDeliveryStatus.replace(/_/g, ' ')}
                        </p>
                      )}
                      {showAgreementDetails && agreementRecipientStatus && (
                        <p className="mt-1 text-xs text-amber-700">
                          Recipient status: {agreementRecipientStatus.replace(/_/g, ' ')}
                        </p>
                      )}
                      {showAgreementDetails && agreementRecipientName && (
                        <p className="mt-1 text-xs text-amber-700">Recipient name: {agreementRecipientName}</p>
                      )}
                      {showAgreementDetails && agreementRecipientEmail && (
                        <p className="mt-1 text-xs text-amber-700">Recipient email: {agreementRecipientEmail}</p>
                      )}
                      {showAgreementDetails && agreementRecipientSentAt && (
                        <p className="mt-1 text-xs text-amber-700">
                          Recipient notified: {formatDate(agreementRecipientSentAt, locale)}
                        </p>
                      )}
                      {showAgreementDetails && agreementRecipientDeliveredAt && (
                        <p className="mt-1 text-xs text-amber-700">
                          Recipient delivered: {formatDate(agreementRecipientDeliveredAt, locale)}
                        </p>
                      )}
                      {showAgreementDetails && agreementViewedAt && (
                        <p className="mt-1 text-xs text-sky-700">Viewed: {formatDate(agreementViewedAt, locale)}</p>
                      )}
                      {showAgreementDetails && agreementSignedAt && (
                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                          Signed: {formatDate(agreementSignedAt, locale)}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}