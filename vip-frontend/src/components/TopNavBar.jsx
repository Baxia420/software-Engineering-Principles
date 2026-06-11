import React from 'react';
import { useAuth } from '../AuthContext';

export default function TopNavBar({ breadcrumbs = [] }) {
  const { profile } = useAuth();
  
  const avatarUrl = profile?.avatar_url || '';
  const letter = profile?.role === 'company' 
    ? profile.company_name?.charAt(0) 
    : `${profile?.first_name?.charAt(0) || ''}${profile?.last_name?.charAt(0) || ''}`;
  const initials = letter?.toUpperCase() || 'U';

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
        <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer active:opacity-80 bg-transparent border-none">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer active:opacity-80 bg-transparent border-none">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
          {avatarUrl ? (
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              src={avatarUrl} 
            />
          ) : initials}
        </div>
      </div>
    </header>
  );
}
