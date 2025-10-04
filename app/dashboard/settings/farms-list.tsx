'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPicker } from '@/app/onboarding/map-picker';
import type { Farm } from '@/lib/types';

const IRRIGATION_TYPES = [
  { value: 'drip', label: 'Drip Irrigation' },
  { value: 'sprinkler', label: 'Sprinkler System' },
  { value: 'flood', label: 'Flood Irrigation' },
  { value: 'manual', label: 'Manual Watering' },
  { value: 'other', label: 'Other' },
];

const CROP_TYPES = [
  'Wheat',
  'Rice',
  'Corn',
  'Soybeans',
  'Cotton',
  'Vegetables',
  'Fruits',
  'Other',
];

interface FarmsListProps {
  initialFarms: Farm[];
}

export function FarmsList({ initialFarms }: FarmsListProps) {
  const { user } = useUser();
  const router = useRouter();
  const [farms, setFarms] = useState(initialFarms);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter farms to only show those belonging to the current user
  const userFarms = farms.filter(farm => farm.user_id === user?.id);
  
  // Debug logging
  console.log('FarmsList - Current user ID:', user?.id);
  console.log('FarmsList - All farms:', farms);
  console.log('FarmsList - User farms:', userFarms);

  const handleSubmit = async (e: React.FormEvent, farm: Farm) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/settings/farms', {
        method: farm.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...farm,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save farm');
      }

      const savedFarm = await response.json();

      // Update local state immediately
      if (farm.id) {
        // Update existing farm
        setFarms(prev => prev.map(f => f.id === farm.id ? { ...farm, ...savedFarm } : f));
      } else {
        // Add new farm
        setFarms(prev => [...prev, { ...farm, ...savedFarm }]);
      }

      setEditingFarm(null);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to save farm. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (farmId: string) => {
    if (!confirm('Are you sure you want to delete this farm?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/settings/farms?id=${farmId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete farm');
      }

      // Update local state immediately
      setFarms(prev => prev.filter(f => f.id !== farmId));
    } catch (err) {
      setError('Failed to delete farm. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const FarmForm = ({ farm }: { farm: Farm }) => {
    const [formData, setFormData] = useState(farm);

    const handleFormChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(e, formData);
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Farm Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Farm Location</Label>
          <MapPicker
            location={formData.location}
            onLocationChange={(location) => handleFormChange('location', location)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size_acres">Size (acres)</Label>
          <Input
            id="size_acres"
            type="number"
            step="0.01"
            value={formData.size_acres || ''}
            onChange={(e) => handleFormChange('size_acres', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="crop_type">Crop Type</Label>
          <Select
            value={formData.crop_type}
            onValueChange={(value) => handleFormChange('crop_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a crop type" />
            </SelectTrigger>
            <SelectContent>
              {CROP_TYPES.map((crop) => (
                <SelectItem key={crop} value={crop.toLowerCase()}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="irrigation_type">Irrigation Method</Label>
          <Select
            value={formData.irrigation_type}
            onValueChange={(value) => handleFormChange('irrigation_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select irrigation method" />
            </SelectTrigger>
            <SelectContent>
              {IRRIGATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="irrigation_details">Irrigation Details</Label>
          <Input
            id="irrigation_details"
            value={formData.irrigation_details || ''}
            onChange={(e) => handleFormChange('irrigation_details', e.target.value)}
            placeholder="Optional details about your irrigation system"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Farm'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingFarm(null);
              setShowAddForm(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {/* List of farms */}
      {userFarms.length > 0 && !editingFarm && !showAddForm && (
        <div className="grid gap-4">
          {userFarms.map((farm) => (
            <div
              key={farm.id}
              className="p-4 border rounded-lg bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{farm.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {farm.crop_type} • {farm.size_acres} acres • {
                      IRRIGATION_TYPES.find(t => t.value === farm.irrigation_type)?.label
                    }
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFarm(farm)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => farm.id && handleDelete(farm.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {(editingFarm || showAddForm) && (
        <FarmForm
          farm={editingFarm || {
            user_id: user?.id || '',
            name: '',
            location: { lat: 0, lng: 0 },
            crop_type: '',
            irrigation_type: '',
            irrigation_details: '',
            size_acres: 0,
          }}
        />
      )}

      {/* Add button */}
      {!editingFarm && !showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="w-full"
        >
          + Add a Farm
        </Button>
      )}

      {/* Show message if no farms */}
      {userFarms.length === 0 && !editingFarm && !showAddForm && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No farms added yet.</p>
          <p className="text-sm">Add your first farm to get started.</p>
        </div>
      )}
    </div>
  );
}
