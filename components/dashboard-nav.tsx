'use client';

import { UserButton } from '@clerk/nextjs';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { FarmSelector } from './farm-selector';

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AgriAI
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/dashboard' 
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Dashboard
              </span>
              {pathname === '/dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
            
            <FarmSelector />
            
            <Link 
              href="/dashboard/chat" 
              className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/dashboard/chat' 
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Chat
              </span>
              {pathname === '/dashboard/chat' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
            
            <Link 
              href="/dashboard/fields" 
              className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/dashboard/fields' 
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fields
              </span>
              {pathname === '/dashboard/fields' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
            
            <Link 
              href="/dashboard/analytics" 
              className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/dashboard/analytics' 
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </span>
              {pathname === '/dashboard/analytics' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
            
            <Link 
              href="/dashboard/settings" 
              className={`group relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === '/dashboard/settings' 
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </span>
              {pathname === '/dashboard/settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </button>
          
          {/* User Button */}
          <div className="relative">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-green-200 dark:ring-green-800 hover:ring-green-300 dark:hover:ring-green-700 transition-all duration-200",
                  userButtonPopoverCard: "shadow-xl border border-border/50",
                  userButtonPopoverActions: "bg-background",
                  userButtonPopoverActionButton: "hover:bg-muted/50 transition-colors"
                }
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
        </div>
      </div>
    </header>
  );
}