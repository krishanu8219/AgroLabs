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
            <img src="/logo.png" className="h-12 dark:hidden" alt="AgroLabs" />
            <img src="/logow.png" className="h-12 hidden dark:block" alt="AgroLabs" />
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
              href="/dashboard/crops" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/crops' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Crops
            </Link>
            <Link 
              href="/dashboard/pesticides" 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                pathname === '/dashboard/pesticides' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Pesticides
            </Link>
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
                  href="/dashboard/crops" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === '/dashboard/crops' 
                      ? 'text-foreground bg-muted' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Crops
                </Link>

                <Link 
                  href="/dashboard/pesticides" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === '/dashboard/pesticides' 
                      ? 'text-foreground bg-muted' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Pesticides
                </Link>
            
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