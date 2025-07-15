import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HealthResponse {
  status: string
  message: string
  database: string
  clerk_sdk: string
  version: string
  environment: string
}

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_DOMAIN || 'http://localhost:5000'

export function BackendTestPage() {
  const [healthResponse, setHealthResponse] = useState<HealthResponse | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthStatus = async (): Promise<void> => {
    setLoading(true)
    setHealthResponse(null)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data: HealthResponse = await response.json()

      if (!response.ok) {
        setError(data.message || `API Error: ${response.status}`)
        setHealthResponse(data)
      } else {
        setHealthResponse(data)
      }
    } catch (err: any) {
      console.error('Failed to fetch health status:', err)
      setError(
        `Network Error: ${err.message || 'Could not reach the backend server.'}`
      )
    } finally {
      setLoading(false)
    }
  }

  const clearStatus = (): void => {
    setHealthResponse(null)
    setError(null)
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Backend Health Check
          </CardTitle>
          <p className="text-blue-100 text-sm mt-1">
            Verify your Flask API connectivity
          </p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-gray-700 text-center text-lg leading-relaxed">
            Click the button below to check the health status of your Flask
            backend's `/health` endpoint.
          </p>

          <div className="flex justify-center gap-4 mt-6 mb-8">
            <Button
              onClick={fetchHealthStatus}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
              disabled={loading}
            >
              {loading ? 'Checking Health...' : 'Check Backend Health'}
            </Button>
            <Button
              onClick={clearStatus}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300"
              disabled={loading && !healthResponse && !error} // Disable if already loading, or if nothing to clear
            >
              Clear Status
            </Button>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-2 border-gray-200">
            Health Response:
          </h3>
          <div className="response-box bg-gray-100 border border-gray-300 rounded-lg p-5 text-sm text-gray-800 overflow-x-auto shadow-inner min-h-[120px] flex flex-col justify-center items-center">
            {loading && (
              <p className="text-blue-600 text-lg animate-pulse">
                Loading health status...
              </p>
            )}
            {error && (
              <p className="text-red-600 font-bold text-center text-base">
                {error}
              </p>
            )}
            {healthResponse ? (
              <pre className="whitespace-pre-wrap break-words w-full text-left">
                {JSON.stringify(healthResponse, null, 2)}
              </pre>
            ) : (
              !loading &&
              !error && (
                <p className="text-gray-500 text-center text-base">
                  No health response yet. Click the button to check.
                </p>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
