'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFarmerProfile, createFarm } from '@/lib/farmer-profile';
import { MapPicker } from './map-picker';
import type { Farm } from '@/lib/types';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'bn', label: 'বাংলা' },
];

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

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Farmer Profile State
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    preferred_language: 'en',
  });

  // Farm State
  const [farms, setFarms] = useState<Farm[]>([]);
  const [currentFarm, setCurrentFarm] = useState<Farm>({
    user_id: user?.id || '',
    name: '',
    location: { lat: 0, lng: 0 },
    crop_type: '',
    irrigation_type: '',
  });
  const [showAddFarm, setShowAddFarm] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      await createFarmerProfile({
        user_id: user.id,
        ...profile,
      });
      setStep(2);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      const farm = await createFarm({
        ...currentFarm,
        user_id: user.id,
      });
      setFarms([...farms, farm]);
      setCurrentFarm({
        user_id: user.id,
        name: '',
        location: { lat: 0, lng: 0 },
        crop_type: '',
        irrigation_type: '',
      });
      setShowAddFarm(false);
    } catch (err) {
      setError('Failed to add farm. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
              }`}>1</div>
              <div className="w-16 h-1 bg-green-100" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
              }`}>2</div>
            </div>
          </div>

          {/* Step 1: Farmer Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-2">Welcome to AgriAI!</h1>
                <p className="text-muted-foreground">Let's set up your farmer profile</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={profile.preferred_language}
                    onValueChange={(value) => setProfile({ ...profile, preferred_language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Continue'}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Farms */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-2">Add Your Farms</h1>
                <p className="text-muted-foreground">Tell us about your farming operations</p>
              </div>

              {/* List of added farms */}
              {farms.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Your Farms</h2>
                  <div className="grid gap-4">
                    {farms.map((farm, index) => (
                      <div
                        key={farm.id || index}
                        className="p-4 border rounded-lg bg-card"
                      >
                        <div className="font-medium">{farm.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {farm.crop_type} • {farm.irrigation_type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add farm form */}
              {showAddFarm ? (
                <form onSubmit={handleAddFarm} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farm_name">Farm Name</Label>
                    <Input
                      id="farm_name"
                      value={currentFarm.name}
                      onChange={(e) => setCurrentFarm({ ...currentFarm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Farm Location</Label>
                    <MapPicker
                      location={currentFarm.location}
                      onLocationChange={(location) => setCurrentFarm({
                        ...currentFarm,
                        location
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crop_type">Crop Type</Label>
                    <Select
                      value={currentFarm.crop_type}
                      onValueChange={(value) => setCurrentFarm({ ...currentFarm, crop_type: value })}
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
                      value={currentFarm.irrigation_type}
                      onValueChange={(value) => setCurrentFarm({ ...currentFarm, irrigation_type: value })}
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

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Adding...' : 'Add Farm'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddFarm(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  onClick={() => setShowAddFarm(true)}
                  variant="outline"
                  className="w-full"
                >
                  + Add a Farm
                </Button>
              )}

              <Button
                onClick={handleComplete}
                className="w-full"
                variant="default"
              >
                {farms.length > 0 ? 'Continue to Dashboard' : 'Skip for Now'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
