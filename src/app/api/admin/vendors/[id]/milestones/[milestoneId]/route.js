import { NextResponse } from 'next/server';
import { deleteMilestone } from '@/lib/supabase/vendors';

// DELETE - Delete a milestone
export async function DELETE(request, { params }) {
    try {
        const { milestoneId } = params;
        await deleteMilestone(milestoneId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting milestone:', error);
        return NextResponse.json(
            { error: 'Failed to delete milestone' },
            { status: 500 }
        );
    }
}
