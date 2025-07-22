import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import blink from '@/blink/client'
import Homepage from '@/pages/Homepage'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import ProjectWorkspace from '@/pages/ProjectWorkspace'
import CandidateProfilePage from '@/pages/candidate/[id]';
import UploadRecording from '@/pages/UploadRecording'
import MarketInsights from '@/pages/MarketInsights'
import Settings from '@/pages/Settings'
import Candidates from '@/pages/Candidates'
import PersonalKPI from '@/pages/PersonalKPI'
import CreateProject from '@/pages/CreateProject'
import CreateCandidate from '@/pages/CreateCandidate'
import CalendarPage from '@/pages/Calendar';
import { Toaster } from '@/components/ui/toaster'
import RecruiterPortalLayout from '@/components/layout/RecruiterPortalLayout';

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading CANDI...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <RecruiterPortalLayout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            {user ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/create-candidate" element={<CreateCandidate />} />
                <Route path="/candidates/new" element={<CreateCandidate />} />
                <Route path="/project/:id" element={<ProjectWorkspace />} />
                <Route path="/candidate/:id" element={<CandidateProfilePage />} />
                <Route path="/upload" element={<UploadRecording />} />
                <Route path="/market-insights" element={<MarketInsights />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/kpi" element={<PersonalKPI />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </>
            ) : (
              <Route path="*" element={<Login />} />
            )}
          </Routes>
          <Toaster />
        </RecruiterPortalLayout>
      </div>
    </Router>
  )
}

export default App