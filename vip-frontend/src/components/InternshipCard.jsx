import React from 'react';

export default function InternshipCard({ id, title, company, status, appliedDate, onViewDetails, actionLabel = "View Details", messageCount = 0, avatarUrl }) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return 'bg-green-600/10 text-green-700 border-green-600';
      case 'rejected':
        return 'bg-[#6B1B1B]/10 text-[#6B1B1B]';
      case 'reviewed':
        return 'bg-[#C4860A]/10 text-[#C4860A]';
      case 'pending':
      default:
        return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  return (
    <div className="group bg-surface-container-lowest border border-outline-variant rounded-DEFAULT border-l-4 border-l-secondary-container hover:border-l-primary hover:bg-surface-container-low/30 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 gap-4">
      <div className="flex-1 flex gap-4">
        {avatarUrl && (
          <div className="w-12 h-12 rounded border border-outline-variant bg-surface-container-lowest flex items-center justify-center shrink-0 overflow-hidden shadow-sm mt-1">
            <img src={avatarUrl} alt={company} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-3 mb-1">
          <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">{title}</h3>
          <span className={`inline-block px-2 py-0.5 rounded-sm font-label-sm text-label-sm uppercase tracking-wider ${getStatusStyle(status)}`}>
            {status}
          </span>
          {messageCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#6B1B1B]/10 text-[#6B1B1B] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
              <span className="material-symbols-outlined text-[14px]">mail</span>
              {messageCount} Recruiter Message{messageCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
          <p className="font-body-md text-body-md text-on-surface-variant">{company}</p>
        </div>
      </div>
      {appliedDate && (
        <div className="flex flex-col md:items-end gap-1">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Applied: <span className="font-label-md text-label-md text-on-surface font-normal">{appliedDate}</span>
          </p>
        </div>
      )}
      <div className="mt-4 md:mt-0 md:ml-8 border-t border-outline-variant md:border-none pt-4 md:pt-0">
        <button 
          onClick={onViewDetails}
          className="w-full md:w-auto px-4 py-2 border border-[#6B1B1B] text-[#6B1B1B] font-label-md text-label-md rounded-DEFAULT hover:bg-[#6B1B1B]/5 transition-colors whitespace-nowrap cursor-pointer bg-transparent"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
