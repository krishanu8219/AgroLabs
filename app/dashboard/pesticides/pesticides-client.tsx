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

function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

export function PesticidesAdvisor() {
  const { user } = useUser();
  const [farmLocation, setFarmLocation] = useState<FarmLocation | null>(null);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [crops, setCrops] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string | null>(null);

  // Load farm + weather
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
        console.error('PesticidesAdvisor init error', e);
      }
    };
    load();
  }, [user?.id]);

  const prompt = useMemo(() => {
    const parts: string[] = [];
    parts.push('You are an integrated pest management (IPM) advisor. Provide a concise pesticide/biocontrol plan in markdown. Include: likely pest/disease pressures, recommended actives or biocontrols, PHI/REI notes, spray timing windows based on weather (wind/precip/leaf wetness), resistance-rotation guidance, and safety/environment cautions.');
    if (farmLocation) parts.push(`Location: ${farmLocation.lat.toFixed(4)}, ${farmLocation.lng.toFixed(4)}`);
    parts.push('Weather snapshot:');
    parts.push(`- Temperature: ${weather?.temperature ?? 'n/a'} °C`);
    parts.push(`- Precip (1h): ${weather?.precipitation ?? 'n/a'} mm`);
    parts.push(`- Wind: ${weather?.windSpeed ?? 'n/a'} m/s`);
    parts.push(`- Leaf wetness idx: ${weather?.leafWetness ?? 'n/a'}`);
    parts.push('Predict likely target pests and diseases given the weather and any crops provided.');
    if (crops) parts.push(`Crops provided: ${crops}`);
    parts.push('Do not include any <think> sections.');
    parts.push('Format as short headings and bullet points.');
    return parts.join('\n');
  }, [farmLocation, weather, crops]);

  async function generateAdvice() {
    setIsLoading(true);
    setAdvice(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: 'Provide the pesticide/biocontrol advisory now.' }
          ]
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'AI request failed');
      }
      const data = await response.json();
      setAdvice(stripThinking(data.message));
    } catch (e: any) {
      setAdvice(`Failed to get advisory: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pesticides Advisor</h1>
        <p className="text-muted-foreground mt-1">Generate IPM-aligned pesticide and biocontrol recommendations for your farm.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Inputs (optional)</h2>
          <div className="text-sm text-muted-foreground">Leave blank to get general IPM guidance based on weather. Pests/diseases will be predicted.</div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Crops (comma separated)</label>
              <input value={crops} onChange={(e)=>setCrops(e.target.value)} className="w-full mt-1 px-3 py-2 bg-muted rounded-md text-sm" placeholder="e.g. lettuce, tomato" />
            </div>
          </div>
          <button onClick={generateAdvice} disabled={isLoading} className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm disabled:opacity-50">
            {isLoading ? 'Generating…' : 'Generate Advisory'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-card border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Advisory</h2>
          {!advice ? (
            <p className="text-sm text-muted-foreground">{isLoading ? 'Analyzing weather…' : 'Enter details (optional) and generate an advisory.'}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {advice}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


