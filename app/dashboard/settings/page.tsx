import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { FarmerProfileForm } from './farmer-profile-form';
import { FarmsList } from './farms-list';
import { createServerSupabaseClient } from '@/lib/supabase-utils';
import { DashboardNav } from "@/components/dashboard-nav";

async function getFarmerProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return profile;
}

async function getFarms(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: farms, error } = await supabase
    .from('farms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching farms for user:', userId, error);
    return [];
  }
  
  console.log('Fetched farms for user:', userId, farms);
  return farms || [];
}

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    redirect('/sign-in');
  }

  const [profile, farms] = await Promise.all([
    getFarmerProfile(userId),
    getFarms(userId),
  ]);

  if (!profile) {
    redirect('/onboarding');
  }

  // Log for debugging
  console.log('Current user ID:', userId);
  console.log('All farms fetched:', farms);
  
  // Ensure we only show farms for the current user (double-check)
  const userFarms = farms.filter(farm => farm.user_id === userId);
  console.log('Filtered farms for user:', userFarms);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your farmer profile and farms.
          </p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Farmer Profile</h2>
            <FarmerProfileForm initialProfile={profile} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Farms</h2>
            <FarmsList initialFarms={userFarms} />
          </div>
        </div>
      </div>
    </div>
  );
}