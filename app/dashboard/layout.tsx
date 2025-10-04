import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkFarmerProfile } from '@/lib/supabase-utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has completed onboarding
  const profile = await checkFarmerProfile(userId);
  
  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}