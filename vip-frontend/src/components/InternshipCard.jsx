import React from 'react';
import { Building2, Mail, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import StatusBadge from './ui/StatusBadge';
import Button from './ui/Button';

export default function InternshipCard({
  id,
  title,
  company,
  status,
  appliedDate,
  onViewDetails,
  actionLabel = 'View Details',
  messageCount = 0,
  avatarUrl,
  delay = 0,
}) {
  return (
    <Card
      accent
      hover
      animate
      delay={delay}
      onClick={onViewDetails}
      className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 gap-4"
    >
      <div className="flex-1 flex gap-4">
        <div className="w-12 h-12 rounded-lg border border-outline-variant bg-surface-container-lowest flex items-center justify-center shrink-0 overflow-hidden shadow-soft mt-0.5 text-on-surface-variant">
          {avatarUrl ? (
            <img src={avatarUrl} alt={company} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={20} strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-3 mb-1">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide group-hover:text-primary transition-colors">
              {title}
            </h3>
            {status && <StatusBadge status={status} />}
            {messageCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                <Mail size={13} />
                {messageCount} Recruiter Message{messageCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant truncate">{company}</p>
        </div>
      </div>

      {appliedDate && (
        <div className="flex flex-col md:items-end gap-1">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Applied:{' '}
            <span className="font-label-md text-label-md text-on-surface font-normal">{appliedDate}</span>
          </p>
        </div>
      )}

      <div className="mt-2 md:mt-0 md:ml-8 border-t border-outline-variant md:border-none pt-4 md:pt-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-full md:w-auto whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails && onViewDetails();
          }}
        >
          {actionLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </Card>
  );
}
