import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Authentication from './pages/Authentication';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import BrowseListings from './pages/BrowseListings';
import MyApplications from './pages/MyApplications';
import ProfilePage from './pages/ProfilePage';
import InternshipDetails from './pages/InternshipDetails';
import ApplicationForm from './pages/ApplicationForm';
import CompanyDashboard from './pages/CompanyDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import MyPostings from './pages/MyPostings';
import CreateListingForm from './pages/CreateListingForm';
import ApplicantReview from './pages/ApplicantReview';
import CareerRadar from './pages/CareerRadar';
import PeerForum from './pages/PeerForum';
import ForumThread from './pages/ForumThread';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Route helper to protect pages
function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role');
  if (!role) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    if (role === 'company') return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Route helper to prevent logged in users from returning to Login page
function AuthRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role) {
    if (role === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    if (role === 'company') return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Wildcard and root redirect helper
function FallbackRedirect() {
  const role = localStorage.getItem('role');
  if (!role) {
    return <Navigate to="/auth" replace />;
  }
  if (role === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
  if (role === 'company') return <Navigate to="/company/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper to resolve the user's role from the profiles table first, metadata second
    async function resolveRole(userId, metadataRole) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        if (error) {
          console.warn('Profile role query error or no row found:', error.message);
        }
        return profile?.role || metadataRole || 'student';
      } catch (err) {
        console.error('Unexpected error in resolveRole:', err);
        return metadataRole || 'student';
      }
    }

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session) {
          const userRole = await resolveRole(
            session.user.id,
            session.user.user_metadata?.role
          );
          localStorage.setItem('role', userRole);
        } else {
          localStorage.removeItem('role');
        }
      } catch (err) {
        console.error('Error in initial session check handler:', err);
      } finally {
        setLoading(false);
      }
    }).catch(err => {
      console.error('Failed to get session:', err);
      setLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session) {
          const userRole = await resolveRole(
            session.user.id,
            session.user.user_metadata?.role
          );
          localStorage.setItem('role', userRole);
        } else {
          localStorage.removeItem('role');
        }
      } catch (err) {
        console.error('Error in auth state change handler:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FallbackRedirect />} />
        <Route path="/auth" element={<AuthRoute><Authentication /></AuthRoute>} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* Student Routes */}
        <Route path="/profile-setup" element={<ProtectedRoute allowedRoles={['student', 'company', 'supervisor']}><ProfileSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
        <Route path="/browse-listings" element={<ProtectedRoute allowedRoles={['student']}><BrowseListings /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'company', 'supervisor']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/internship-details" element={<ProtectedRoute allowedRoles={['student', 'company', 'supervisor']}><InternshipDetails /></ProtectedRoute>} />
        <Route path="/apply" element={<ProtectedRoute allowedRoles={['student']}><ApplicationForm /></ProtectedRoute>} />
        <Route path="/career-radar" element={<ProtectedRoute allowedRoles={['student']}><CareerRadar /></ProtectedRoute>} />
        
        {/* Forums / Radar Routes (Accessible by all roles) */}
        <Route path="/forum" element={<ProtectedRoute allowedRoles={['student', 'company', 'supervisor']}><PeerForum /></ProtectedRoute>} />
        <Route path="/forum/thread/:threadId" element={<ProtectedRoute allowedRoles={['student', 'company', 'supervisor']}><ForumThread /></ProtectedRoute>} />
        
        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/postings" element={<ProtectedRoute allowedRoles={['company']}><MyPostings /></ProtectedRoute>} />
        <Route path="/company/create-listing" element={<ProtectedRoute allowedRoles={['company']}><CreateListingForm /></ProtectedRoute>} />
        <Route path="/company/review" element={<ProtectedRoute allowedRoles={['company']}><ApplicantReview /></ProtectedRoute>} />

        {/* Supervisor Routes (Admin) */}
        <Route path="/supervisor/dashboard" element={<ProtectedRoute allowedRoles={['supervisor']}><SupervisorDashboard /></ProtectedRoute>} />

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </Router>
  );
}
