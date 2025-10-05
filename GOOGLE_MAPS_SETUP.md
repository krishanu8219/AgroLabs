# Google Maps Setup for Weather Map

## 🗺️ Setting Up Google Maps Integration

Follow these steps to enable the weather map feature on your dashboard:

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (for autocomplete in onboarding)
   - **Geocoding API** (for address lookup)

### 2. Create API Key

1. Go to **Credentials** in the Google Cloud Console
2. Click **Create Credentials** → **API Key**
3. Copy your API key
4. (Optional) Restrict the key to your domain for security

### 3. Add API Key to Environment Variables

Add your Google Maps API key to your `.env.local` file:

```bash
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## ✨ Weather Map Features

### What You'll See:
- **Satellite View**: High-resolution satellite imagery of your farm
- **Farm Marker**: Green circle marking your exact farm location
- **Farm Area**: Light green circle showing 1km radius around your farm
- **Weather Stations**: Blue markers showing nearby weather monitoring stations
- **Interactive Info**: Click on your farm marker to see weather data
- **Map Controls**: Switch between Satellite and Terrain views

### Map Controls:
- **Zoom**: Use mouse wheel or +/- buttons
- **Pan**: Click and drag to move around
- **Satellite/Terrain**: Toggle between map types
- **Full Screen**: Click the expand icon (if available)

## 🎯 Benefits for Farmers

### Visual Context:
- **Location Awareness**: See your farm in relation to surrounding terrain
- **Weather Stations**: Identify nearby weather monitoring points
- **Area Coverage**: Understand the 1km radius for weather data accuracy
- **Terrain Analysis**: Assess elevation and landscape features

### Planning Tools:
- **Field Boundaries**: Visualize your farm's exact location
- **Weather Patterns**: See how local geography affects weather
- **Risk Assessment**: Identify potential weather-related risks
- **Resource Planning**: Plan irrigation and crop management

## 🔧 Technical Details

### Map Configuration:
- **Zoom Level**: 12 (shows ~10km area)
- **Map Type**: Satellite (default), Terrain (alternative)
- **Farm Marker**: Green circle with white border
- **Weather Stations**: Blue circles with white borders
- **Farm Area**: 1km radius circle with green fill

### Data Integration:
- **Coordinates**: Uses your farm's exact lat/lng
- **Weather Data**: Shows current conditions in info window
- **Real-time Updates**: Map updates when you select different farms

## 🚀 Next Steps

Once the map is working, you can:

1. **Add More Layers**: Temperature, precipitation, air quality overlays
2. **Historical Data**: Show weather patterns over time
3. **Field Boundaries**: Draw actual field boundaries
4. **Weather Alerts**: Show weather warnings on the map
5. **Crop Health**: Overlay satellite imagery with NDVI data

## 🐛 Troubleshooting

### Map Not Loading?
- Check your API key is correct
- Ensure Maps JavaScript API is enabled
- Verify the key has proper permissions
- Check browser console for errors

### Missing Features?
- Make sure Places API is enabled for autocomplete
- Verify Geocoding API is enabled for address lookup
- Check that your API key isn't restricted too heavily

### Performance Issues?
- The map loads asynchronously to avoid blocking
- Satellite imagery may take a moment to load
- Consider reducing zoom level for faster loading

## 📝 Cost Considerations

Google Maps API pricing:
- **Maps Load**: $7 per 1,000 loads
- **Places API**: $17 per 1,000 requests
- **Geocoding**: $5 per 1,000 requests

For development, you get $200 free credits monthly.

## 🔗 Useful Links

- [Google Maps Platform](https://developers.google.com/maps)
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [API Pricing](https://developers.google.com/maps/billing-and-pricing)
- [Google Cloud Console](https://console.cloud.google.com/)

Your weather map is now ready to provide visual context for your farm's weather data! 🌾🗺️