import { ChatInterface } from './chat-client';
import { DashboardNav } from "@/components/dashboard-nav";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav />

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full max-w-4xl">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}