import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
        async remove(name: string, options: any) {
          try {
            (await cookieStore).set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
      },
    }
  );
}

export async function checkFarmerProfile(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from('farmer_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  return profile;
}
