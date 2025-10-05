'use client';

import { UserButton } from '@clerk/nextjs';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FarmSelector } from './farm-selector';
import { ThemeToggle } from './theme-toggle';

export function DashboardNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-semibold text-base text-green-600 hidden sm:block">
              AgriAI
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            <FarmSelector />
            <Link 
              href="/dashboard/chat" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/chat' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Chat
            </Link>
            <Link 
              href="/dashboard/fields" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/fields' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Fields
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/analytics' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Analytics
            </Link>
            <Link 
              href="/dashboard/settings" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/settings' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === '/dashboard' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            
            <div className="px-3 py-2">
              <FarmSelector />
            </div>
            
            <Link 
              href="/dashboard/chat" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/chat' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Chat
            </Link>
            
            <Link 
              href="/dashboard/fields" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/fields' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Fields
            </Link>
            
            <Link 
              href="/dashboard/analytics" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/analytics' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Analytics
            </Link>
            
            <Link 
              href="/dashboard/settings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/settings' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}