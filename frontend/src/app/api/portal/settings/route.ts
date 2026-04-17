import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

const DEFAULT_NOTIFICATION_PREFERENCES = {
  emailEnquiries: true,
  emailMeetings: true,
  emailSystem: false,
  pushAll: true,
};

function normalizeNotificationPreferences(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  const record = value as Record<string, unknown>;

  return {
    emailEnquiries:
      typeof record.emailEnquiries === 'boolean'
        ? record.emailEnquiries
        : DEFAULT_NOTIFICATION_PREFERENCES.emailEnquiries,
    emailMeetings:
      typeof record.emailMeetings === 'boolean'
        ? record.emailMeetings
        : DEFAULT_NOTIFICATION_PREFERENCES.emailMeetings,
    emailSystem:
      typeof record.emailSystem === 'boolean'
        ? record.emailSystem
        : DEFAULT_NOTIFICATION_PREFERENCES.emailSystem,
    pushAll:
      typeof record.pushAll === 'boolean'
        ? record.pushAll
        : DEFAULT_NOTIFICATION_PREFERENCES.pushAll,
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const [{ data: vendor }, { data: profile }] = await Promise.all([
      supabase
        .from('vendors')
        .select('contact_person, email, phone')
        .eq('id', vendorId)
        .single(),
      supabase
        .from('vendor_profiles')
        .select('notification_preferences')
        .eq('vendor_id', vendorId)
        .maybeSingle(),
    ]);

    if (!vendor) return jsonError('Vendor not found.', 404);

    return jsonOk({
      success: true,
      data: {
        contactPerson: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        notificationPreferences: normalizeNotificationPreferences(
          profile?.notification_preferences
        ),
      },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (body.contactPerson !== undefined)
      updates.contact_person = String(body.contactPerson).trim();
    if (body.phone !== undefined) updates.phone = String(body.phone).trim();
    if (body.email !== undefined) updates.email = String(body.email).toLowerCase().trim();

    if (Object.keys(updates).length > 0) {
      await supabase.from('vendors').update(updates).eq('id', vendorId);
    }

    if (body.contactPerson !== undefined) {
      await supabase
        .from('users')
        .update({ name: String(body.contactPerson).trim() })
        .eq('id', vendorId);
    }

    const notificationPreferences =
      body.notificationPreferences !== undefined
        ? normalizeNotificationPreferences(body.notificationPreferences)
        : undefined;

    if (notificationPreferences) {
      await supabase.from('vendor_profiles').upsert(
        {
          vendor_id: vendorId,
          notification_preferences: notificationPreferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'vendor_id' }
      );
    }

    const [{ data: vendor }, { data: profile }] = await Promise.all([
      supabase
        .from('vendors')
        .select('contact_person, email, phone')
        .eq('id', vendorId)
        .single(),
      supabase
        .from('vendor_profiles')
        .select('notification_preferences')
        .eq('vendor_id', vendorId)
        .maybeSingle(),
    ]);

    return jsonOk({
      success: true,
      data: {
        contactPerson: vendor?.contact_person || '',
        email: vendor?.email || '',
        phone: vendor?.phone || '',
        notificationPreferences: normalizeNotificationPreferences(
          profile?.notification_preferences
        ),
      },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
