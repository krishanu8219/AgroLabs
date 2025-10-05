'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface WeatherData {
  timestamp: string;
  location: { lat: number; lon: number };
  data: {
    windSpeed?: number;
    pressure?: number;
    soilMoistureDeficit?: number;
    evapotranspiration?: number;
    airQuality?: number;
    pm25?: number;
    fireWarning?: number;
    temperature?: number;
    precipitation?: number;
    leafWetness?: number;
  };
}

interface WeatherDisplayProps {
  farmLocation: { lat: number; lng: number };
}

export function WeatherDisplay({ farmLocation }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!farmLocation.lat || !farmLocation.lng) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Farm location received:', farmLocation);
        
        // Validate coordinates
        if (!farmLocation.lat || !farmLocation.lng || 
            isNaN(farmLocation.lat) || isNaN(farmLocation.lng)) {
          throw new Error('Invalid farm location coordinates');
        }
        
        // Call Meteomatics API directly from client
        const username = 'gupta_achintya';
        const password = 's21pmVNR8FgU41C8sV0V';
        const authHeader = Buffer.from(`${username}:${password}`).toString('base64');

        // Round to current hour UTC
        const now = new Date();
        now.setUTCMinutes(0, 0, 0);
        const iso = now.toISOString();

        const parameters = [
          'wind_speed_10m:ms',
          'msl_pressure:hPa',
          'soil_moisture_deficit:mm',
          'evapotranspiration_1h:mm',
          'air_quality:idx',
          'pm2p5:ugm3',
          'forest_fire_warning:idx',
          't_2m:C',
          'precip_1h:mm',
          'leaf_wetness:idx',
        ].join(',');

        const model = 'mix';
        const url = `https://api.meteomatics.com/${iso}--${iso}:PT1H/${parameters}/${farmLocation.lat},${farmLocation.lng}/json?model=${encodeURIComponent(model)}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Basic ${authHeader}`
          }
        });

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data into a more usable format
        const weatherData = {
          timestamp: iso,
          location: { 
            lat: parseFloat(farmLocation.lat.toString()), 
            lon: parseFloat(farmLocation.lng.toString()) 
          },
          data: {} as {
            windSpeed?: number;
            pressure?: number;
            soilMoistureDeficit?: number;
            evapotranspiration?: number;
            airQuality?: number;
            pm25?: number;
            fireWarning?: number;
            temperature?: number;
            precipitation?: number;
            leafWetness?: number;
          }
        };

        // Extract values from the API response
        if (data.data) {
          data.data.forEach((item: any) => {
            const param = item.parameter;
            const value = item.coordinates?.[0]?.dates?.[0]?.value;
            
            switch (param) {
              case 'wind_speed_10m:ms':
                weatherData.data.windSpeed = value;
                break;
              case 'msl_pressure:hPa':
                weatherData.data.pressure = value;
                break;
              case 'soil_moisture_deficit:mm':
                weatherData.data.soilMoistureDeficit = value;
                break;
              case 'evapotranspiration_1h:mm':
                weatherData.data.evapotranspiration = value;
                break;
              case 'air_quality:idx':
                weatherData.data.airQuality = value;
                break;
              case 'pm2p5:ugm3':
                weatherData.data.pm25 = value;
                break;
              case 'forest_fire_warning:idx':
                weatherData.data.fireWarning = value;
                break;
              case 't_2m:C':
                weatherData.data.temperature = value;
                break;
              case 'precip_1h:mm':
                weatherData.data.precipitation = value;
                break;
              case 'leaf_wetness:idx':
                weatherData.data.leafWetness = value;
                break;
            }
          });
        }

        setWeatherData(weatherData);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [farmLocation.lat, farmLocation.lng]);

  const getAirQualityText = (index: number) => {
    if (index <= 1) return 'Good';
    if (index <= 2) return 'Moderate';
    if (index <= 3) return 'Unhealthy for Sensitive';
    if (index <= 4) return 'Unhealthy';
    if (index <= 5) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAirQualityColor = (index: number) => {
    if (index <= 1) return 'text-green-600';
    if (index <= 2) return 'text-yellow-600';
    if (index <= 3) return 'text-orange-600';
    if (index <= 4) return 'text-red-600';
    if (index <= 5) return 'text-purple-600';
    return 'text-rose-600';
  };

  const getFireWarningText = (index: number) => {
    if (index <= 0.2) return 'Low';
    if (index <= 0.4) return 'Moderate';
    if (index <= 0.6) return 'High';
    if (index <= 0.8) return 'Very High';
    return 'Extreme';
  };

  const getFireWarningColor = (index: number) => {
    if (index <= 0.2) return 'text-green-600';
    if (index <= 0.4) return 'text-yellow-600';
    if (index <= 0.6) return 'text-orange-600';
    if (index <= 0.8) return 'text-red-600';
    return 'text-red-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading weather data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No weather data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Weather Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Weather Conditions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Updated {format(new Date(weatherData.timestamp), 'MMM dd, HH:mm')} UTC
          </p>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-card border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-7.757l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l.707-.707M7.05 5.636l.707-.707M12 12a5 5 0 110 0 5 5 0 010 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-semibold text-foreground mb-1">
            {weatherData.data.temperature?.toFixed(1)}°C
          </div>
          <div className="text-sm text-muted-foreground">Temperature</div>
        </div>

        <div className="bg-card border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-950 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H6.737a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 10H14zm0 0V5a2 2 0 10-4 0v5m0 0H5.263a2 2 0 00-1.789 2.894l3.5 7A2 2 0 008.737 21h7.525a2 2 0 001.789-2.894l-3.5-7A2 2 0 0014.737 10H14z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-semibold text-foreground mb-1">
            {weatherData.data.precipitation?.toFixed(1)}mm
          </div>
          <div className="text-sm text-muted-foreground">Precipitation (1h)</div>
        </div>

        <div className="bg-card border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-950 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-7.757l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l.707-.707M7.05 5.636l.707-.707M12 12a5 5 0 110 0 5 5 0 010 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-semibold text-foreground mb-1">
            {weatherData.data.windSpeed?.toFixed(1)}m/s
          </div>
          <div className="text-sm text-muted-foreground">Wind Speed</div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Pressure</div>
          <div className="text-xl font-semibold text-foreground">
            {weatherData.data.pressure?.toFixed(0)} hPa
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Air Quality</div>
          <div className={`text-lg font-semibold ${getAirQualityColor(weatherData.data.airQuality || 0)}`}>
            {getAirQualityText(weatherData.data.airQuality || 0)}
          </div>
          {weatherData.data.pm25 && (
            <div className="text-xs text-muted-foreground mt-1">
              PM2.5: {weatherData.data.pm25.toFixed(1)} μg/m³
            </div>
          )}
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Fire Risk</div>
          <div className={`text-lg font-semibold ${getFireWarningColor(weatherData.data.fireWarning || 0)}`}>
            {getFireWarningText(weatherData.data.fireWarning || 0)}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Leaf Wetness</div>
          <div className="text-lg font-semibold text-foreground">
            {weatherData.data.leafWetness === 0 ? 'Dry' : 'Wet'}
          </div>
        </div>
      </div>

      {/* Agricultural Data */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Agricultural Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Soil Moisture Deficit</span>
            <span className="text-lg font-medium text-foreground">
              {weatherData.data.soilMoistureDeficit?.toFixed(1)} mm
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Evapotranspiration</span>
            <span className="text-lg font-medium text-foreground">
              {weatherData.data.evapotranspiration?.toFixed(2)} mm/h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
