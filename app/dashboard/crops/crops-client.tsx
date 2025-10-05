'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

type FarmLocation = { lat: number; lng: number };

type WeatherSnapshot = {
  temperature?: number;
  precipitation?: number;
  windSpeed?: number;
  pressure?: number;
  airQuality?: number;
  pm25?: number;
  fireWarning?: number;
  soilMoistureDeficit?: number;
  evapotranspiration?: number;
  leafWetness?: number;
};

export function CropsAdvisor() {
  const { user } = useUser();
  const [farmLocation, setFarmLocation] = useState<FarmLocation | null>(null);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [parsed, setParsed] = useState<{
    title: string;
    score?: string;
    rationale?: string;
    window?: string;
    irrigation?: string;
    risks?: string;
  }[] | null>(null);

  // Load current farm + weather
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const farmsRes = await fetch(`/api/settings/farms?userId=${user.id}`);
        if (!farmsRes.ok) return;
        const farms = await farmsRes.json();
        const selectedFarmId = localStorage.getItem('selectedFarmId');
        const farm = selectedFarmId ? (farms.find((f: any) => f.id === selectedFarmId) || farms[0]) : farms[0];
        if (!farm) return;
        setFarmLocation(farm.location);

        const w = await fetch(`/api/weather?lat=${farm.location.lat}&lon=${farm.location.lng}`);
        if (w.ok) {
          const data = await w.json();
          setWeather(data.data);
        }
      } catch (e) {
        console.error('CropsAdvisor init error', e);
      }
    };
    load();
  }, [user?.id]);

  const prompt = useMemo(() => {
    const parts: string[] = [];
    parts.push('You are an expert agronomist. Based ONLY on the following weather snapshot and location, suggest 8-12 crop varieties (mix of staples, vegetables, fruits, legumes, oilseeds) that are newly or increasingly viable due to climate shifts. Output STRICTLY in this markdown format (no extra commentary):');
    parts.push('');
    parts.push('**Crop Name**');
    parts.push('- **Suitability Score:** 88/100');
    parts.push('- **Rationale:** short justification');
    parts.push('- **Planting Window:** date range');
    parts.push('- **Irrigation Needs:** short guidance');
    parts.push('- **Key Risks:** short risks');
    parts.push('');
    if (farmLocation) parts.push(`Location: ${farmLocation.lat.toFixed(4)}, ${farmLocation.lng.toFixed(4)}`);
    parts.push('Weather snapshot:');
    parts.push(`- Temperature: ${weather?.temperature ?? 'n/a'} °C`);
    parts.push(`- Precip (1h): ${weather?.precipitation ?? 'n/a'} mm`);
    parts.push(`- Wind: ${weather?.windSpeed ?? 'n/a'} m/s`);
    parts.push(`- Pressure: ${weather?.pressure ?? 'n/a'} hPa`);
    parts.push(`- Air quality idx: ${weather?.airQuality ?? 'n/a'}`);
    parts.push(`- PM2.5: ${weather?.pm25 ?? 'n/a'} µg/m³`);
    parts.push(`- Fire risk idx: ${weather?.fireWarning ?? 'n/a'}`);
    parts.push(`- Soil moisture deficit: ${weather?.soilMoistureDeficit ?? 'n/a'} mm`);
    parts.push(`- Evapotranspiration: ${weather?.evapotranspiration ?? 'n/a'} mm/h`);
    parts.push(`- Leaf wetness idx: ${weather?.leafWetness ?? 'n/a'}`);
    parts.push('Do not include any <think> sections.');
    return parts.join('\n');
  }, [farmLocation, weather]);

  function stripThinking(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }

  function parseRecommendations(text: string) {
    const entries = text.split(/\n\s*\n+/).map(s => s.trim()).filter(Boolean);
    const items: {
      title: string;
      score?: string;
      rationale?: string;
      window?: string;
      irrigation?: string;
      risks?: string;
    }[] = [];
    for (const entry of entries) {
      const lines = entry.split(/\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;
      const title = lines[0].replace(/^\*+|^#+\s*/, '').replace(/^\*\*|\*\*$/g, '');
      const obj: any = { title };
      for (const line of lines.slice(1)) {
        const [k, ...rest] = line.split(':');
        const val = rest.join(':').trim();
        const key = k.toLowerCase();
        if (key.includes('suitability')) obj.score = val;
        else if (key.includes('rationale')) obj.rationale = val;
        else if (key.includes('planting')) obj.window = val;
        else if (key.includes('irrigation')) obj.irrigation = val;
        else if (key.includes('risk')) obj.risks = val;
      }
      if (obj.title) items.push(obj);
    }
    return items.length ? items : null;
  }

  const getRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: 'Provide the recommended crops now.' }
          ]
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'AI request failed');
      }
        const data = await response.json();
        const clean = stripThinking(data.message);
        setRecommendations(clean);
        setParsed(parseRecommendations(clean));
    } catch (e: any) {
      setRecommendations(`Failed to get recommendations: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run when weather + location available
  useEffect(() => {
    if (farmLocation && weather && !recommendations && !isLoading) {
      getRecommendations();
    }
  }, [farmLocation, weather]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crops Advisor</h1>
        <p className="text-muted-foreground mt-1">Get AI-backed crop recommendations based on your land and current weather.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-4 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold">Context</h2>
          {farmLocation ? (
            <div className="text-sm">
              <div className="text-muted-foreground">Location</div>
              <div>{farmLocation.lat.toFixed(4)}, {farmLocation.lng.toFixed(4)}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Loading farm location…</div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Temp</div>
              <div>{weather?.temperature?.toFixed?.(1) ?? '—'} °C</div>
            </div>
            <div>
              <div className="text-muted-foreground">Precip (1h)</div>
              <div>{weather?.precipitation?.toFixed?.(1) ?? '—'} mm</div>
            </div>
            <div>
              <div className="text-muted-foreground">Wind</div>
              <div>{weather?.windSpeed?.toFixed?.(1) ?? '—'} m/s</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pressure</div>
              <div>{weather?.pressure?.toFixed?.(0) ?? '—'} hPa</div>
            </div>
          </div>
          <button disabled className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm cursor-not-allowed">
            {isLoading ? 'Analyzing…' : 'Auto-analyzing'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-card border rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Recommended Crops</h2>
            {!recommendations ? (
              <p className="text-sm text-muted-foreground">{isLoading ? 'Generating recommendations…' : 'Waiting for weather data…'}</p>
            ) : parsed ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsed.map((rec, idx) => (
                  <div key={idx} className="border rounded-xl p-4 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold">{rec.title}</h3>
                      {rec.score && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          {rec.score}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      {rec.rationale && (
                        <div>
                          <span className="font-medium">Rationale: </span>
                          <span className="text-muted-foreground">{rec.rationale}</span>
                        </div>
                      )}
                      {rec.window && (
                        <div>
                          <span className="font-medium">Planting Window: </span>
                          <span className="text-muted-foreground">{rec.window}</span>
                        </div>
                      )}
                      {rec.irrigation && (
                        <div>
                          <span className="font-medium">Irrigation Needs: </span>
                          <span className="text-muted-foreground">{rec.irrigation}</span>
                        </div>
                      )}
                      {rec.risks && (
                        <div>
                          <span className="font-medium">Key Risks: </span>
                          <span className="text-muted-foreground">{rec.risks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {recommendations}
                </ReactMarkdown>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}


