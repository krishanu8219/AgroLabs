'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Farm } from '@/lib/types';

export function FarmSelector() {
  const { user } = useUser();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load farms on mount
  useEffect(() => {
    const loadFarms = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch('/api/settings/farms');
        if (response.ok) {
          const data = await response.json();
          setFarms(data);
          
          // Set first farm as default if none selected
          if (data.length > 0 && !selectedFarmId) {
            setSelectedFarmId(data[0].id);
            localStorage.setItem('selectedFarmId', data[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading farms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFarms();
  }, [user?.id, selectedFarmId]);

  // Load selected farm from localStorage on mount
  useEffect(() => {
    const savedFarmId = localStorage.getItem('selectedFarmId');
    if (savedFarmId) {
      setSelectedFarmId(savedFarmId);
    }
  }, []);

  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    localStorage.setItem('selectedFarmId', farmId);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('farmChanged', { 
      detail: { farmId, farm: farms.find(f => f.id === farmId) } 
    }));
  };

  const selectedFarm = farms.find(farm => farm.id === selectedFarmId);

  if (isLoading) {
    return (
      <div className="px-3 py-1.5 text-sm text-muted-foreground">
        Loading farms...
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="px-3 py-1.5 text-sm text-muted-foreground">
        No farms
      </div>
    );
  }

  return (
    <div className="px-2">
      <Select value={selectedFarmId} onValueChange={handleFarmChange}>
        <SelectTrigger className="w-52 h-9 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 shadow-sm hover:shadow-md">
          <SelectValue placeholder="Select farm">
            {selectedFarm ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="truncate font-medium text-green-700 dark:text-green-300">{selectedFarm.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select farm</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="shadow-xl border border-border/50 bg-background/95 backdrop-blur-xl">
          {farms.map((farm) => (
            <SelectItem key={farm.id} value={farm.id} className="hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors">
              <div className="flex items-center gap-3 py-1">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="font-medium">{farm.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
