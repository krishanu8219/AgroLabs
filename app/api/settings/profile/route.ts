import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-utils';

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await req.json();

    // Verify the user is updating their own profile
    if (profile.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('farmer_profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        preferred_language: profile.preferred_language,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in profile update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
