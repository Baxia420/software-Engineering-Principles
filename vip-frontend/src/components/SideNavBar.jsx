import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export default function SideNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const role = profile?.role || localStorage.getItem('role') || 'student';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for hamburger toggle event from TopNavBar
  useEffect(() => {
    const handler = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggle-mobile-nav', handler);
    return () => window.removeEventListener('toggle-mobile-nav', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const isSupervisor = role === 'supervisor';
  const isCompany = role === 'company';
  const isStudent = role === 'student';

  const activeClass = "flex items-center gap-3 px-4 py-3 bg-primary-container border-l-4 border-secondary-container text-white font-bold rounded-lg transition-all duration-200 shadow-soft";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-primary-fixed/75 hover:bg-primary-container/60 hover:text-white hover:translate-x-0.5 rounded-lg transition-all duration-200 active:scale-[0.98]";

  const displayName = profile 
    ? (isCompany ? profile.company_name : `${profile.first_name} ${profile.last_name}`) 
    : (isSupervisor ? 'UTM Staff' : isCompany ? 'Company Partner' : 'Student User');

  const displaySub = profile 
    ? (isStudent ? `Matric: ${profile.matric_number || 'Pending'}` : isCompany ? (profile.is_approved ? 'Verified Partner' : 'Pending Verification') : `${profile.department || 'Faculty'}`) 
    : '';

  const initials = profile 
    ? (isCompany ? profile.company_name?.charAt(0) : `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`)?.toUpperCase() 
    : 'U';

  const navContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex flex-col items-center text-center">
        <div className="h-16 w-16 mb-4 rounded-full bg-white flex items-center justify-center p-2 shadow-soft ring-2 ring-secondary-container/40">
          <img
            alt="UTM Logo"
            className="h-full w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALJ0IC37RsH7JLKd8P899TSVUiIgwwZC4a-pLfFURvinhF7kAG8ZaJRUFn-Lx9Q17AoYEojN3xJAxEUQhFSc22dRmF3lwjWYhRrpgLMNymQir2fQaUKZTGv0WfX2-5EuUpQT1xXf7cZeMfwQyLCwyaW2y9r718Cd5OomWK8OcXChiWF4uo9T-PFt_RZ-oV7S5_8tWOVC3xy2vBi29FGRbuQA6CJiGtrwVDrqcEByhOPIzMr6I1iSv0MTgii6g9CMJ22XZuYuxK6A"
          />
        </div>
        <h1 className="text-xl font-black text-white uppercase font-h1 serif antialiased tracking-wide">VIP Portal</h1>
        <p className="font-body-sm text-secondary-container/90 text-sm mt-1 font-label-sm uppercase tracking-wider">
          {isSupervisor ? 'Supervisor Panel' : isCompany ? 'Company Panel' : 'Student Panel'}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-2">
        {isSupervisor && (
          <>
            <NavLink to="/supervisor/dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Approvals Roster</span>
            </NavLink>
            <NavLink to="/forum" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">forum</span>
              <span className="font-label-md text-label-md">Monitor Forums</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md text-label-md">Profile</span>
            </NavLink>
          </>
        )}

        {isCompany && (
          <>
            <NavLink to="/company/dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </NavLink>
            <NavLink to="/company/postings" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">work</span>
              <span className="font-label-md text-label-md">My Postings</span>
            </NavLink>
            <NavLink to="/forum" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">forum</span>
              <span className="font-label-md text-label-md">Peer Forum</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md text-label-md">Profile</span>
            </NavLink>
            <div className="mt-4 px-2">
              <button
                onClick={() => navigate('/company/create-listing')}
                disabled={profile && !profile.is_approved}
                className="w-full bg-secondary-container text-on-secondary-fixed font-label-md text-label-md py-3 rounded-lg hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent shadow-soft hover:shadow-lift active:scale-[0.98] disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Post Internship
              </button>
            </div>
          </>
        )}

        {isStudent && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </NavLink>
            <NavLink to="/career-radar" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">explore</span>
              <span className="font-label-md text-label-md">Career Radar</span>
            </NavLink>
            <NavLink to="/forum" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">forum</span>
              <span className="font-label-md text-label-md">Peer Forum</span>
            </NavLink>
            <NavLink to="/browse-listings" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">search</span>
              <span className="font-label-md text-label-md">Browse Listings</span>
            </NavLink>
            <NavLink to="/my-applications" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-label-md text-label-md">My Applications</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md text-label-md">Profile</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Footer Info & Logout */}
      <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3 px-3 py-2">
        <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-label-md text-label-md overflow-hidden shrink-0 ring-2 ring-white/10">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-label-sm text-label-sm text-white truncate">
            {displayName}
          </p>
          <p className="font-body-sm text-body-sm text-primary-fixed/60 text-xs truncate">
            {displaySub}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-primary-fixed/75 hover:bg-primary-container hover:text-white rounded-lg transition-all duration-200 active:scale-[0.98] font-label-md text-label-md bg-transparent border-none cursor-pointer text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 w-64 overflow-y-auto border-r border-primary-container bg-primary text-on-primary transition-all duration-150 ease-in-out p-4 gap-2">
        {navContent}
      </nav>

      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar — slides in from left */}
      <nav className={`md:hidden flex flex-col h-screen fixed left-0 top-0 z-50 w-64 overflow-y-auto border-r border-primary-container bg-primary text-on-primary p-4 gap-2 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button for mobile */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-primary-fixed/80 hover:text-white p-1 bg-transparent border-none cursor-pointer rounded-full hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {navContent}
      </nav>
    </>
  );
}
