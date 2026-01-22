import { NextResponse } from 'next/server';
import { getVendorMilestones, createMilestone, deleteMilestone } from '@/lib/supabase/vendors';

// GET - Fetch all milestones for a vendor
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const milestones = await getVendorMilestones(id);
        return NextResponse.json(milestones);
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch milestones' },
            { status: 500 }
        );
    }
}

// POST - Create a new milestone
export async function POST(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const milestoneData = {
            vendor_id: id,
            title: body.title,
            description: body.description,
            milestone_date: body.milestone_date,
            display_order: body.display_order || 0,
        };

        const milestone = await createMilestone(milestoneData);
        return NextResponse.json(milestone);
    } catch (error) {
        console.error('Error creating milestone:', error);
        return NextResponse.json(
            { error: 'Failed to create milestone' },
            { status: 500 }
        );
    }
}
