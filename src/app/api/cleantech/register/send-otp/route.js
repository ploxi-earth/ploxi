import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, formData } = await request.json();
    console.log(formData)
    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('vendor_registrations')
      .select('email_verified')
      .eq('email', email)
      .single();

    if (existing?.email_verified) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) throw error;

    // Prepare vendor data (adjust field names based on your form)
    const vendorData = {
      email,
      company_name: formData.company_name,
      contact_person_name: formData.contact_person_name,
      phone: formData.phone,
      website: formData.website,
      // Add all other fields from your vendor form
      solution_types: formData.solution_types,
      industries_served: formData.industries_served,
      operational_regions: formData.operational_regions,
      company_description: formData.company_description,
      // Add requirements to dataToSave or vendorData
      requirements: formData.requirements,

      // ... map all your form fields
    };

    if (existing) {
      console.log("hello")
      await supabase.from('vendor_registrations').update(vendorData).eq('email', email);
    } else {
      console.log("hi")
      console.log(vendorData)
      const { data, error } = await supabase.from('vendor_registrations').insert(vendorData);

if (error) {
  console.error("Supabase insert error:", error);
  throw error;
}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
