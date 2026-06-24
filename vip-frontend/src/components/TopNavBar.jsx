import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return { open, setOpen, ref };
}

export default function TopNavBar({ breadcrumbs = [] }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const notifications = useDropdown();
  const avatar = useDropdown();

  const avatarUrl = profile?.avatar_url || '';
  const letter = profile?.role === 'company'
    ? profile.company_name?.charAt(0)
    : `${profile?.first_name?.charAt(0) || ''}${profile?.last_name?.charAt(0) || ''}`;
  const initials = letter?.toUpperCase() || 'U';

  async function handleLogout() {
    avatar.setOpen(false);
    await logout();
    navigate('/auth');
  }

  return (
    <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-base md:px-margin-desktop h-16 z-30 sticky top-0">
      <div className="flex items-center gap-4 md:hidden">
        <button
          className="text-on-surface p-2 bg-transparent border-none cursor-pointer"
          onClick={() => window.dispatchEvent(new Event('toggle-mobile-nav'))}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-h3 text-h3 font-semibold text-primary">VIP Portal</span>
      </div>

      <div className="hidden md:flex items-center space-x-2 font-label-sm text-label-sm text-on-surface-variant">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="material-symbols-outlined text-[14px]">chevron_right</span>}
            {crumb.link ? (
              <a className="hover:text-primary-container" href={crumb.link}>{crumb.label}</a>
            ) : (
              <span className="text-on-surface">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifications.ref}>
          <button
            onClick={() => notifications.setOpen(o => !o)}
            className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer active:opacity-80 bg-transparent border-none"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {notifications.open && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-lg py-3 px-4 text-sm text-on-surface-variant">
              No notifications yet.
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate('/profile')}
          className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer active:opacity-80 bg-transparent border-none"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Avatar */}
        <div className="relative" ref={avatar.ref}>
          <button
            onClick={() => avatar.setOpen(o => !o)}
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
          >
            {avatarUrl ? (
              <img alt="User profile avatar" className="w-full h-full object-cover" src={avatarUrl} />
            ) : initials}
          </button>
          {avatar.open && (
            <div className="absolute right-0 mt-2 w-44 bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden text-sm">
              <button
                onClick={() => { avatar.setOpen(false); navigate('/profile'); }}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container text-on-surface transition-colors bg-transparent border-none cursor-pointer"
              >
                View Profile
              </button>
              <div className="border-t border-outline-variant" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container text-error transition-colors bg-transparent border-none cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
