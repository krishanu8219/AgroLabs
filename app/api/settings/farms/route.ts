import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-utils';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: farms, error } = await supabase
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching farms:', error);
      return NextResponse.json({ error: 'Failed to fetch farms' }, { status: 500 });
    }

    return NextResponse.json(farms || []);
  } catch (error) {
    console.error('Error in farms fetch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const farmData = await req.json();

    // Verify the user is creating a farm for themselves
    if (farmData.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: farm, error } = await supabase
      .from('farms')
      .insert({
        user_id: farmData.user_id,
        name: farmData.name,
        location: farmData.location,
        size_acres: farmData.size_acres,
        crop_type: farmData.crop_type,
        irrigation_type: farmData.irrigation_type,
        irrigation_details: farmData.irrigation_details,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating farm:', error);
      return NextResponse.json({ error: 'Failed to create farm' }, { status: 500 });
    }

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error in farm creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const farmData = await req.json();

    // Verify the user is updating their own farm
    if (farmData.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!farmData.id) {
      return NextResponse.json({ error: 'Farm ID is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: farm, error } = await supabase
      .from('farms')
      .update({
        name: farmData.name,
        location: farmData.location,
        size_acres: farmData.size_acres,
        crop_type: farmData.crop_type,
        irrigation_type: farmData.irrigation_type,
        irrigation_details: farmData.irrigation_details,
        updated_at: new Date().toISOString(),
      })
      .eq('id', farmData.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating farm:', error);
      return NextResponse.json({ error: 'Failed to update farm' }, { status: 500 });
    }

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error in farm update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const farmId = url.searchParams.get('id');

    if (!farmId) {
      return NextResponse.json({ error: 'Farm ID is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', farmId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting farm:', error);
      return NextResponse.json({ error: 'Failed to delete farm' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in farm deletion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}