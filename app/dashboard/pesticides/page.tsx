import { DashboardNav } from "@/components/dashboard-nav";
import { PesticidesAdvisor } from "./pesticides-client";

export default function PesticidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PesticidesAdvisor />
      </main>
    </div>
  );
}


