import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkFarmerProfile } from '@/lib/supabase-utils';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has already completed onboarding
  const profile = await checkFarmerProfile(userId);
  
  if (profile) {
    // If user already has a profile, redirect to dashboard
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}