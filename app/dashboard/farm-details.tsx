'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WeatherDisplay } from '@/components/weather-display';
import { WeatherMap } from '@/components/weather-map';
import type { Farm } from '@/lib/types';

interface FarmDetailsProps {
  farms: Farm[];
}

export function FarmDetails({ farms }: FarmDetailsProps) {
  const { user } = useUser();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  useEffect(() => {
    // Listen for farm selection changes
    const handleFarmChange = (event: CustomEvent) => {
      setSelectedFarm(event.detail.farm);
    };

    window.addEventListener('farmChanged', handleFarmChange as EventListener);

    // Set initial farm if available
    if (farms.length > 0 && !selectedFarm) {
      const savedFarmId = localStorage.getItem('selectedFarmId');
      const initialFarm = savedFarmId 
        ? farms.find(f => f.id === savedFarmId) || farms[0]
        : farms[0];
      setSelectedFarm(initialFarm);
    }

    return () => {
      window.removeEventListener('farmChanged', handleFarmChange as EventListener);
    };
  }, [farms, selectedFarm]);

  if (farms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">No Farms Added Yet</h2>
        <p className="text-muted-foreground mb-6">
          Add your first farm to start tracking your agricultural data.
        </p>
        <Link href="/dashboard/settings">
          <Button>Add Your First Farm</Button>
        </Link>
      </div>
    );
  }

  if (!selectedFarm) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading farm details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Farmer'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with <strong>{selectedFarm.name}</strong> today
        </p>
      </div>

      {/* Farm Overview and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Farm Overview */}
        <div className="bg-card border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{selectedFarm.name}</h2>
              <p className="text-sm text-muted-foreground">Farm Overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-sm font-medium">
                {selectedFarm.location.lat.toFixed(4)}, {selectedFarm.location.lng.toFixed(4)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Size</div>
              <div className="text-sm font-medium">
                {selectedFarm.size_acres ? `${selectedFarm.size_acres} acres` : 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Crop Type</div>
              <div className="text-sm font-medium capitalize">
                {selectedFarm.crop_type || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Irrigation</div>
              <div className="text-sm font-medium capitalize">
                {selectedFarm.irrigation_type || 'Not specified'}
              </div>
            </div>
          </div>

          {selectedFarm.irrigation_details && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground mb-2">Irrigation Details</div>
              <div className="text-sm">{selectedFarm.irrigation_details}</div>
            </div>
          )}
        </div>

        {/* Weather Map */}
        <WeatherMap farmLocation={selectedFarm.location} />
      </div>

      {/* Quick Actions */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/chat" className="group border rounded-xl p-5 bg-card hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">AI Chat</div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Go</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Ask anything about your farm, weather, or tasks.</p>
          </Link>
          <Link href="/dashboard/crops" className="group border rounded-xl p-5 bg-card hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Crops Advisor</div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Go</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">See what crops are suitable right now.</p>
          </Link>
          <Link href="/dashboard/pesticides" className="group border rounded-xl p-5 bg-card hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Pesticides Advisor</div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Go</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Get an IPM-aligned advisory based on weather.</p>
          </Link>
          <Link href="/dashboard/settings" className="group border rounded-xl p-5 bg-card hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Settings</div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Go</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Manage profile and farms.</p>
          </Link>
        </div>
      </section>

      {/* Weather Data */}
      <WeatherDisplay farmLocation={selectedFarm.location} />

      {/* AI Chat Quick Access */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Get instant farming insights for {selectedFarm.name}</p>
          </div>
          <Link href="/dashboard/chat">
            <Button className="bg-green-600 hover:bg-green-700">
              Open Chat
            </Button>
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-6 border border-green-100 dark:border-green-900">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">Suggested Questions:</p>
              <ul className="space-y-2">
                <li className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>What's the current health status of {selectedFarm.name}?</span>
                </li>
                <li className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Should I irrigate {selectedFarm.name} based on today's satellite imagery?</span>
                </li>
                <li className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Are there any pest or disease risks detected in {selectedFarm.name}?</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
