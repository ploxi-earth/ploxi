import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { email, additionalData } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if vendor exists and email is verified
    const { data: existing } = await supabase
      .from('vendor_registrations')
      .select('*')
      .eq('email', email)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (!existing.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 400 }
      );
    }

    // Update with any additional data
    // (This is optional - your CleanTech form is single-step)
    const { data: updated, error: updateError } = await supabase
      .from('vendor_registrations')
      .update({
        ...additionalData,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single();

    if (updateError) {
      console.error('Complete registration error:', updateError);
      return NextResponse.json(
        { error: 'Failed to complete registration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      data: updated,
    });

  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
