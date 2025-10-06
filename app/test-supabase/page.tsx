'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check if Supabase is initialized
        setStatus('✅ Supabase client initialized');

        // Test 2: Try to query farmer_profiles table
        const { data, error } = await supabase
          .from('farmer_profiles')
          .select('*')
          .limit(1);

        if (error) {
          setError(`❌ Error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
          setStatus('❌ Failed to connect to farmer_profiles table');
        } else {
          setStatus('✅ Successfully connected to farmer_profiles table');
          setTables(prev => [...prev, 'farmer_profiles']);
        }

        // Test 3: Check environment variables
        const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
        const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!hasUrl || !hasKey) {
          setError(`❌ Missing environment variables:\nURL: ${hasUrl ? '✅' : '❌'}\nKey: ${hasKey ? '✅' : '❌'}`);
        }

      } catch (err: any) {
        setError(`❌ Exception: ${err.message}`);
        setStatus('❌ Test failed with exception');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
        
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <p className="text-lg">{status}</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Environment</h2>
          <div className="space-y-1 font-mono text-sm">
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
            <p>URL Value: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</p>
            <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
          </div>
        </div>

        {tables.length > 0 && (
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">Accessible Tables</h2>
            <ul className="list-disc list-inside">
              {tables.map(table => (
                <li key={table} className="text-green-600">✅ {table}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="p-4 border-2 border-red-600 rounded-lg bg-red-50 dark:bg-red-950">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error Details</h2>
            <pre className="text-sm whitespace-pre-wrap font-mono text-red-700 dark:text-red-300">
              {error}
            </pre>
          </div>
        )}

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>If you see errors, check the browser console (F12)</li>
            <li>Verify your Supabase URL and anon key in .env.local</li>
            <li>Make sure you ran the SQL schema in Supabase SQL Editor</li>
            <li>Check if RLS policies are enabled in Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
