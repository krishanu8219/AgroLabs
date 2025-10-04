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