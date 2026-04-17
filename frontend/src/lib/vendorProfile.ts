export const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/;
export const VENDOR_PROFILE_COMPLETION_FIELD_COUNT = 14;

export type VendorProfileFormShape = {
  companyName?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  website?: string | null;
  companyDescription?: string | null;
  servicesOffered?: string | null;
  sector?: string | null;
  location?: string | null;
  locationsServed?: string[] | null;
  industryFocus?: string[] | null;
  corporateProfile?: string | null;
  legalEntityName?: string | null;
  gstNumber?: string | null;
  registeredAddress?: string | null;
};

type VendorRow = {
  company_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
};

type VendorProfileRow = {
  website?: string | null;
  description?: string | null;
  services?: string | null;
  sector?: string | null;
  location?: string | null;
  locations_served?: string[] | null;
  industry_focus?: string[] | null;
  corporate_profile?: string | null;
  legal_entity_name?: string | null;
  gst_number?: string | null;
  registered_address?: string | null;
};

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
}

export function normalizeGstNumber(value: unknown): string {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function isValidGstNumber(value: unknown): boolean {
  const gst = normalizeGstNumber(value);
  return GST_REGEX.test(gst);
}

export function calculateVendorProfileCompletion(fields: VendorProfileFormShape): number {
  const completionFields = [
    fields.companyName,
    fields.contactPerson,
    fields.phone,
    fields.website,
    fields.companyDescription,
    fields.servicesOffered,
    fields.sector,
    fields.location,
    fields.locationsServed,
    fields.industryFocus,
    fields.corporateProfile,
    fields.legalEntityName,
    fields.gstNumber,
    fields.registeredAddress,
  ];

  const completedCount = completionFields.filter(isFilled).length;
  return Math.round((completedCount / completionFields.length) * 100);
}

export function countCompletedVendorProfileFields(fields: VendorProfileFormShape): number {
  return [
    fields.companyName,
    fields.contactPerson,
    fields.phone,
    fields.website,
    fields.companyDescription,
    fields.servicesOffered,
    fields.sector,
    fields.location,
    fields.locationsServed,
    fields.industryFocus,
    fields.corporateProfile,
    fields.legalEntityName,
    fields.gstNumber,
    fields.registeredAddress,
  ].filter(isFilled).length;
}

export function calculateVendorProfileCompletionFromRows(
  vendor: VendorRow | null | undefined,
  profile: VendorProfileRow | null | undefined
): number {
  return calculateVendorProfileCompletion({
    companyName: vendor?.company_name,
    contactPerson: vendor?.contact_person,
    phone: vendor?.phone,
    website: profile?.website,
    companyDescription: profile?.description,
    servicesOffered: profile?.services,
    sector: profile?.sector,
    location: profile?.location,
    locationsServed: profile?.locations_served || [],
    industryFocus: profile?.industry_focus || [],
    corporateProfile: profile?.corporate_profile,
    legalEntityName: profile?.legal_entity_name,
    gstNumber: profile?.gst_number,
    registeredAddress: profile?.registered_address,
  });
}

export function isVendorProfileOnboardingReady(fields: VendorProfileFormShape): boolean {
  const requiredFields = [
    fields.companyName,
    fields.contactPerson,
    fields.phone,
    fields.website,
    fields.servicesOffered,
    fields.sector,
    fields.location,
    fields.locationsServed,
    fields.gstNumber,
  ];

  return requiredFields.every(isFilled);
}

export function isVendorProfileOnboardingReadyFromRows(
  vendor: VendorRow | null | undefined,
  profile: VendorProfileRow | null | undefined
): boolean {
  return isVendorProfileOnboardingReady({
    companyName: vendor?.company_name,
    contactPerson: vendor?.contact_person,
    phone: vendor?.phone,
    website: profile?.website,
    servicesOffered: profile?.services,
    sector: profile?.sector,
    location: profile?.location,
    locationsServed: profile?.locations_served || [],
    gstNumber: profile?.gst_number,
  });
}
