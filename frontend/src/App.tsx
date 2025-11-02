import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useUserStore } from "@/store/userStore"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

// Auth Pages
import { Login } from "@/pages/auth/Login"
import { Signup } from "@/pages/auth/Signup"

// Athlete Pages
import { AthleteDashboard } from "@/pages/athlete/Dashboard"
import { DailyReport } from "@/pages/athlete/DailyReport"
import { AthleteTrends } from "@/pages/athlete/Trends"
import { AthleteProfile } from "@/pages/athlete/Profile"

// Coach Pages
import { CoachDashboard } from "@/pages/coach/Dashboard"
import { CoachAthletes } from "@/pages/coach/Athletes"
import { CoachAnalytics } from "@/pages/coach/Analytics"
import { CoachAlerts } from "@/pages/coach/Alerts"
import { CoachReports } from "@/pages/coach/Reports"

// Physio Pages
import { PhysioDashboard } from "@/pages/physio/Dashboard"
import { PhysioPatients } from "@/pages/physio/Patients"
import { PhysioAssessments } from "@/pages/physio/Assessments"
import { PhysioReports } from "@/pages/physio/Reports"

// Admin Pages
import { AdminDashboard } from "@/pages/admin/Dashboard"
import { AdminUsers } from "@/pages/admin/Users"
import Notifications from "@/pages/common/Notifications"

import './App.css'

function App() {
  const { isAuthenticated, user } = useUserStore()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <Signup />
          }
        />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to={`/${user?.role}`} replace />
          </ProtectedRoute>
        } />

        {/* Athlete Routes */}
        <Route path="/athlete" element={
          <ProtectedRoute allowedRoles={['athlete']}>
            <DashboardLayout userRole={user?.role || 'athlete'} userName={user?.name || ''}>
              <AthleteDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/athlete/profile" element={
          <ProtectedRoute allowedRoles={['athlete']}>
            <DashboardLayout userRole={user?.role || 'athlete'} userName={user?.name || ''}>
              <AthleteProfile />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/athlete/report" element={
          <ProtectedRoute allowedRoles={['athlete']}>
            <DashboardLayout userRole={user?.role || 'athlete'} userName={user?.name || ''}>
              <DailyReport />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/athlete/trends" element={
          <ProtectedRoute allowedRoles={['athlete']}>
            <DashboardLayout userRole={user?.role || 'athlete'} userName={user?.name || ''}>
              <AthleteTrends />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Coach Routes */}
        <Route path="/coach" element={
          <ProtectedRoute allowedRoles={['coach']}>
            <DashboardLayout userRole={user?.role || 'coach'} userName={user?.name || ''}>
              <CoachDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/coach/athletes" element={
          <ProtectedRoute allowedRoles={['coach']}>
            <DashboardLayout userRole={user?.role || 'coach'} userName={user?.name || ''}>
              <CoachAthletes />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/coach/analytics" element={
          <ProtectedRoute allowedRoles={['coach']}>
            <DashboardLayout userRole={user?.role || 'coach'} userName={user?.name || ''}>
              <CoachAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/coach/alerts" element={
          <ProtectedRoute allowedRoles={['coach']}>
            <DashboardLayout userRole={user?.role || 'coach'} userName={user?.name || ''}>
              <CoachAlerts />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/coach/reports" element={
          <ProtectedRoute allowedRoles={['coach']}>
            <DashboardLayout userRole={user?.role || 'coach'} userName={user?.name || ''}>
              <CoachReports />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Physio Routes */}
        <Route path="/physio" element={
          <ProtectedRoute allowedRoles={['physio']}>
            <DashboardLayout userRole={user?.role || 'physio'} userName={user?.name || ''}>
              <PhysioDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/physio/patients" element={
          <ProtectedRoute allowedRoles={['physio']}>
            <DashboardLayout userRole={user?.role || 'physio'} userName={user?.name || ''}>
              <PhysioPatients />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/physio/assessments" element={
          <ProtectedRoute allowedRoles={['physio']}>
            <DashboardLayout userRole={user?.role || 'physio'} userName={user?.name || ''}>
              <PhysioAssessments />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/physio/reports" element={
          <ProtectedRoute allowedRoles={['physio']}>
            <DashboardLayout userRole={user?.role || 'physio'} userName={user?.name || ''}>
              <PhysioReports />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout userRole={user?.role || 'admin'} userName={user?.name || ''}>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout userRole={user?.role || 'admin'} userName={user?.name || ''}>
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Notifications - available to all authenticated users */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <DashboardLayout userRole={user?.role || 'athlete'} userName={user?.name || ''}>
              <Notifications />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
