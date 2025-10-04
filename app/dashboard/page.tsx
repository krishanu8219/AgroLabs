import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-utils';
import { DashboardNav } from '@/components/dashboard-nav';
import { FarmDetails } from './farm-details';

async function getFarms(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: farms, error } = await supabase
    .from('farms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching farms:', error);
    return [];
  }
  
  return farms || [];
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    redirect('/sign-in');
  }

  const farms = await getFarms(userId);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FarmDetails farms={farms} />
      </main>
    </div>
  );
}