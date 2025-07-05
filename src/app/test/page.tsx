'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Simple test - just check if we can connect to Supabase
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus(`❌ Connection Error`)
        setDetails(error.message)
      } else {
        setStatus('✅ Supabase Connected Successfully!')
        setDetails('Your environment variables are correct and Supabase is reachable.')
      }
    } catch (err) {
      setStatus(`❌ Connection Failed`)
      setDetails(`Error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">MAT Platform Setup</h1>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Supabase Connection</h2>
            <p className={`text-lg font-medium ${
              status.includes('✅') ? 'text-green-600' : 
              status.includes('❌') ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {status}
            </p>
            {details && (
              <p className="text-sm text-gray-600 mt-2">{details}</p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Environment Check</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Supabase URL:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Supabase Key:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
            </div>
          </div>

          {status.includes('✅') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Ready for Next Step!</h3>
              <p className="text-green-700 text-sm">
                Supabase is connected. We can now create the database schema and build authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
