import { DashboardNav } from "@/components/dashboard-nav";
import { CropsAdvisor } from "./crops-client";

export default function CropsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CropsAdvisor />
      </main>
    </div>
  );
}


