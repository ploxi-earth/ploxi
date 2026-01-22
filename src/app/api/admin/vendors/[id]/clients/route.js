import { NextResponse } from 'next/server';
import { getVendorClients, createVendorClient, deleteVendorClient } from '@/lib/supabase/vendors';

// GET - Fetch all clients for a vendor
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const clients = await getVendorClients(id);
        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}

// POST - Create a new client
export async function POST(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const clientData = {
            vendor_id: id,
            client_name: body.client_name,
            client_logo_url: body.client_logo_url,
            description: body.description,
            display_order: body.display_order || 0,
        };

        const client = await createVendorClient(clientData);
        return NextResponse.json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}
