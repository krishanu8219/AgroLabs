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
    <div className="px-2 sm:px-3 py-1.5">
      <Select value={selectedFarmId} onValueChange={handleFarmChange}>
        <SelectTrigger className="w-32 sm:w-48 h-8 text-xs sm:text-sm">
          <SelectValue placeholder="Select farm">
            {selectedFarm ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="truncate text-xs sm:text-sm">{selectedFarm.name}</span>
              </div>
            ) : (
              'Select farm'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {farms.map((farm) => (
            <SelectItem key={farm.id} value={farm.id}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>{farm.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
