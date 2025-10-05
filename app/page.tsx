import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="flex items-center">
                <img src="/logo.png" className="h-10 dark:hidden" alt="AgroLabs" />
                <img src="/logow.png" className="h-10 hidden dark:block" alt="AgroLabs" />
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
            
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4">
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <span className="bg-green-600 w-2 h-2 rounded-full mr-2"></span>
            AI-Powered Farming Intelligence
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
            Make Smarter Farm Decisions with{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AI & Satellite Data
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence and real-time satellite data to optimize your crops, 
            predict issues, and maximize yields. Your AI farming assistant is here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Button size="lg" variant="outline" className="text-lg px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>

        
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Farm Smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with real-time satellite data to give you actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* AI Chat Feature */}
          <div className="group relative bg-card border rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Chat Assistant</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Get instant answers to any farming question. Our AI analyzes satellite data in real-time to help you tackle 
                pest control, irrigation, crop health, and more with expert precision.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time satellite data analysis
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 expert farming advice
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Problem diagnosis and solutions
                </li>
              </ul>
            </div>
          </div>

          {/* Dashboard Feature */}
          <div className="group relative bg-card border rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Decision Dashboard</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Make data-driven decisions with comprehensive insights. Track crop health, weather patterns, soil conditions, 
                and get predictive analytics all in one beautiful dashboard.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time crop health monitoring
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Predictive weather insights
          </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Historical data & trends analysis
          </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AI to grow better crops and increase their yields
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-12">
                  Start Your Free Trial
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-12">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Button size="lg" variant="outline" className="text-lg px-8 h-12 border-white/10 text-white bg-white/10 hover:bg-white/20 hover:text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgroLabs
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                Smart farming powered by AI and satellite data
              </p>
            </div>
            <div>
              
             
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 AgroLabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
