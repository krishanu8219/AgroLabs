'use client';

import { useEffect, useRef } from 'react';

interface WeatherMapProps {
  farmLocation: {
    lat: number;
    lng: number;
  };
  weatherData?: {
    temperature?: number;
    airQuality?: number;
    pm25?: number;
  };
}

export function WeatherMap({ farmLocation, weatherData }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !farmLocation.lat || !farmLocation.lng) return;

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: farmLocation.lat, lng: farmLocation.lng },
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add farm marker with radius
    const farmMarker = new google.maps.Marker({
      position: { lat: farmLocation.lat, lng: farmLocation.lng },
      map: map,
      title: 'Your Farm',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });

    // Add subtle radius circle around the marker
    const radiusCircle = new google.maps.Circle({
      strokeColor: '#10b981',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#10b981',
      fillOpacity: 0.1,
      map: map,
      center: { lat: farmLocation.lat, lng: farmLocation.lng },
      radius: 100 // 100 meters radius
    });

    // Add info window with weather data
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2 text-gray-900">Farm Location</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Coordinates:</span>
              <span class="font-mono">${farmLocation.lat.toFixed(4)}, ${farmLocation.lng.toFixed(4)}</span>
            </div>
            ${weatherData?.temperature ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Temperature:</span>
                <span class="font-medium">${weatherData.temperature.toFixed(1)}°C</span>
              </div>
            ` : ''}
            ${weatherData?.airQuality ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Air Quality:</span>
                <span class="font-medium">${getAirQualityText(weatherData.airQuality)}</span>
              </div>
            ` : ''}
            ${weatherData?.pm25 ? `
              <div class="flex justify-between">
                <span class="text-gray-600">PM2.5:</span>
                <span class="font-medium">${weatherData.pm25.toFixed(1)} μg/m³</span>
              </div>
            ` : ''}
          </div>
        </div>
      `
    });

    farmMarker.addListener('click', () => {
      infoWindow.open(map, farmMarker);
    });

    // Add weather overlay layers
    addWeatherLayers(map);

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [farmLocation.lat, farmLocation.lng, weatherData]);

  const addWeatherLayers = (map: google.maps.Map) => {
    // Map is now clean with just the farm marker
    // No additional overlays needed
  };

  const getAirQualityText = (index: number) => {
    if (index <= 1) return 'Good';
    if (index <= 2) return 'Moderate';
    if (index <= 3) return 'Unhealthy for Sensitive';
    if (index <= 4) return 'Unhealthy';
    if (index <= 5) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div ref={mapRef} className="w-full h-64 sm:h-80 rounded-lg overflow-hidden" />
  );
}
