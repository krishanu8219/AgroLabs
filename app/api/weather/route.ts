import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Meteomatics API credentials
    const username = process.env.METEOMATICS_USERNAME || 'gupta_achintya';
    const password = process.env.METEOMATICS_PASSWORD || 's21pmVNR8FgU41C8sV0V';
    
    console.log('Meteomatics credentials check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      usernameLength: username?.length,
      isProduction: process.env.NODE_ENV === 'production'
    });
    
    if (!username || !password) {
      console.error('Missing Meteomatics credentials');
      return NextResponse.json(
        { error: 'Meteomatics credentials not configured' },
        { status: 500 }
      );
    }
    
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
    const url = `https://api.meteomatics.com/${iso}--${iso}:PT1H/${parameters}/${lat},${lon}/json?model=${encodeURIComponent(model)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${authHeader}`
      }
    });

    console.log('Meteomatics API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Meteomatics API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url.replace(/:[^@]+@/, ':****@') // Hide password in logs
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch weather data', 
          details: response.status === 401 ? 'Invalid credentials' : response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Meteomatics API success, data received');

    // Transform the data into a more usable format
    const weatherData = {
      timestamp: iso,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
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

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
