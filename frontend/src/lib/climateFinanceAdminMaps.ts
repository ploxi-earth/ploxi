/** Normalize split climate tables for admin list UI (matches legacy shape). */

export type ClimateRegRow = {
  _id: string;
  fullName: string;
  email: string;
  organization: string;
  engagementType: 'raise_funding' | 'investor' | 'participate';
  status: string;
  createdAt: string;
};

export function mapRaiseFundingRow(r: Record<string, unknown>): ClimateRegRow {
  return {
    _id: String(r.id),
    fullName: String(r.full_name || r.company_name || '—'),
    email: String(r.email),
    organization: String(r.organization || r.company_name || '—'),
    engagementType: 'raise_funding',
    status: String(r.status || 'pending'),
    createdAt: String(r.created_at),
  };
}

export function mapInvestorRow(r: Record<string, unknown>): ClimateRegRow {
  const fn = [r.first_name, r.last_name].filter(Boolean).join(' ').trim();
  return {
    _id: String(r.id),
    fullName: fn || '—',
    email: String(r.email),
    organization: String(r.organization_name || '—'),
    engagementType: 'investor',
    status: String(r.status || 'pending'),
    createdAt: String(r.created_at),
  };
}

export function mapParticipantRow(r: Record<string, unknown>): ClimateRegRow {
  const fn = [r.first_name, r.last_name].filter(Boolean).join(' ').trim();
  return {
    _id: String(r.id),
    fullName: fn || '—',
    email: String(r.email),
    organization: String(r.organization || '—'),
    engagementType: 'participate',
    status: String(r.status || 'pending'),
    createdAt: String(r.created_at),
  };
}

export function mapLegacyClimateRow(r: Record<string, unknown>): ClimateRegRow {
  return {
    _id: String(r.id),
    fullName: String(r.full_name || '—'),
    email: String(r.email),
    organization: String(r.organization || '—'),
    engagementType: (r.engagement_type as ClimateRegRow['engagementType']) || 'raise_funding',
    status: String(r.status || 'pending'),
    createdAt: String(r.created_at),
  };
}
