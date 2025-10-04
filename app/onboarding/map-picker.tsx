'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapPickerProps {
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  onLocationChange: (location: { lat: number; lng: number; address?: string }) => void;
}

export function MapPicker({ location, onLocationChange }: MapPickerProps) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setAutocompleteService(new google.maps.places.AutocompleteService());
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        setAutocompleteService(new google.maps.places.AutocompleteService());
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const googleMap = new google.maps.Map(mapElement, {
      center: location.lat && location.lng ? { lat: location.lat, lng: location.lng } : { lat: 39.8283, lng: -98.5795 }, // Center of US
      zoom: location.lat && location.lng ? 15 : 4,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(googleMap);

    // Add marker if location is provided
    if (location.lat && location.lng) {
      const mapMarker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: googleMap,
        draggable: true,
        title: 'Farm Location',
      });

      setMarker(mapMarker);

      // Update location when marker is dragged
      mapMarker.addListener('dragend', () => {
        const newPosition = mapMarker.getPosition();
        if (newPosition) {
          const newLocation = {
            lat: newPosition.lat(),
            lng: newPosition.lng(),
            address: location.address,
          };
          onLocationChange(newLocation);
        }
      });
    }

    // Add click listener to place marker
    googleMap.addListener('click', (event: any) => {
      if (event.latLng) {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          address: location.address,
        };
        onLocationChange(newLocation);

        // Update or create marker
        if (marker) {
          marker.setPosition(event.latLng);
        } else {
          const newMarker = new google.maps.Marker({
            position: event.latLng,
            map: googleMap,
            draggable: true,
            title: 'Farm Location',
          });
          setMarker(newMarker);

          newMarker.addListener('dragend', () => {
            const newPosition = newMarker.getPosition();
            if (newPosition) {
              const updatedLocation = {
                lat: newPosition.lat(),
                lng: newPosition.lng(),
                address: location.address,
              };
              onLocationChange(updatedLocation);
            }
          });
        }
      }
    });
  }, [isLoaded, location.lat, location.lng, onLocationChange]);

  const handleSearch = (query: string = searchQuery) => {
    if (!map || !query.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const result = results[0];
        const newLocation = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          address: result.formatted_address,
        };
        
        onLocationChange(newLocation);
        map.setCenter(result.geometry.location);
        map.setZoom(15);

        // Update marker
        if (marker) {
          marker.setPosition(result.geometry.location);
        } else {
          const newMarker = new google.maps.Marker({
            position: result.geometry.location,
            map: map,
            draggable: true,
            title: 'Farm Location',
          });
          setMarker(newMarker);

          newMarker.addListener('dragend', () => {
            const newPosition = newMarker.getPosition();
            if (newPosition) {
              const updatedLocation = {
                lat: newPosition.lat(),
                lng: newPosition.lng(),
                address: location.address,
              };
              onLocationChange(updatedLocation);
            }
          });
        }
      }
    });
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    if (!autocompleteService || !value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    autocompleteService.getPlacePredictions({
      input: value,
      types: ['establishment', 'geocode'],
    }, (predictions: any, status: any) => {
      if (status === 'OK' && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
    handleSearch(suggestion.description);
  };

  if (!isLoaded) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                    {suggestion.structured_formatting.secondary_text && (
                      <div className="text-xs text-muted-foreground">
                        {suggestion.structured_formatting.secondary_text}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => handleSearch()} variant="outline">
            Search
          </Button>
        </div>
      </div>
      
      <div className="h-64 border rounded-lg overflow-hidden">
        <div id="map" className="w-full h-full"></div>
      </div>
      
      {location.address && (
        <div className="text-sm text-muted-foreground">
          <strong>Address:</strong> {location.address}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>Lat: {location.lat?.toFixed(6) || 'Not set'}</div>
        <div>Lng: {location.lng?.toFixed(6) || 'Not set'}</div>
      </div>
    </div>
  );
}
