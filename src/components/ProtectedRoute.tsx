import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={`${import.meta.env.BASE_URL}slouch-logo.png`} 
            alt="Slouch" 
            className="w-16 h-16 animate-pulse" 
          />
          <div className="text-white/50">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
