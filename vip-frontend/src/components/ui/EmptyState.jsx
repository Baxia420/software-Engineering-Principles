import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Branded empty-state block: icon medallion + title + optional description and
 * call-to-action. Replaces bare "No results" text strings.
 *
 * Props:
 *   icon   - a lucide icon component (defaults to Inbox)
 *   title  - main message
 *   description - supporting copy
 *   action - optional node (e.g. a <Button/>)
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-6 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-secondary-container/20 border border-outline-variant flex items-center justify-center text-secondary mb-4">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-h3 text-h3 text-on-surface mb-1.5">{title}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-5">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
