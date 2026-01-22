import { NextResponse } from 'next/server';
import { deleteVendorClient } from '@/lib/supabase/vendors';

// DELETE - Delete a client
export async function DELETE(request, { params }) {
    try {
        const { clientId } = params;
        await deleteVendorClient(clientId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json(
            { error: 'Failed to delete client' },
            { status: 500 }
        );
    }
}
