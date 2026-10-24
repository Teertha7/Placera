import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { StudentLayout } from './components/layout/StudentLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { JobsDirectoryPage } from './pages/student/JobsDirectoryPage';
import { JobDetailPage } from './pages/student/JobDetailPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { InterviewsPage } from './pages/student/InterviewsPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsManagementPage } from './pages/admin/StudentsManagementPage';
import { CompaniesManagementPage } from './pages/admin/CompaniesManagementPage';
import { JobsManagementPage } from './pages/admin/JobsManagementPage';
import { ApplicationsManagementPage } from './pages/admin/ApplicationsManagementPage';
import { AnalyticsReportsPage } from './pages/admin/AnalyticsReportsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsDirectoryPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Protected Student Portal */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="jobs" element={<JobsDirectoryPage />} />
                <Route path="jobs/:id" element={<JobDetailPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="interviews" element={<InterviewsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Protected Admin Console */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentsManagementPage />} />
                <Route path="companies" element={<CompaniesManagementPage />} />
                <Route path="jobs" element={<JobsManagementPage />} />
                <Route path="applications" element={<ApplicationsManagementPage />} />
                <Route path="analytics" element={<AnalyticsReportsPage />} />
              </Route>
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
