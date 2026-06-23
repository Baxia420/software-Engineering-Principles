import React from 'react';

/**
 * Single source of truth for application / listing status styling.
 * Uses design tokens only (no hardcoded hex) and follows the design system:
 *   Accepted -> maroon (primary), Reviewed -> amber (secondary),
 *   Rejected -> error (red),       Pending  -> neutral.
 *
 * Accepts both the code's vocabulary (`approved`) and the docs' (`accepted`),
 * plus raw listing types (e.g. "Remote", "On-site") which fall through to a
 * neutral accent so it can also label internship cards.
 */
const STATUS_MAP = {
  accepted: { label: 'Accepted', cls: 'bg-green-600/10 text-green-700 border-green-600/40' },
  approved: { label: 'Accepted', cls: 'bg-green-600/10 text-green-700 border-green-600/40' },
  shortlisted: { label: 'Shortlisted', cls: 'bg-green-600/10 text-green-700 border-green-600/40' },
  reviewed: { label: 'Reviewed', cls: 'bg-secondary/10 text-secondary border-secondary/30' },
  rejected: { label: 'Rejected', cls: 'bg-red-600/10 text-red-700 border-red-600/40' },
  pending: { label: 'Pending', cls: 'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant' },
};

export default function StatusBadge({ status, label, className = '' }) {
  const key = String(status || '').toLowerCase();
  const preset = STATUS_MAP[key];

  // Unknown values (e.g. a listing "type") render as a neutral amber-accented chip.
  const cls = preset?.cls || 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/40';
  const text = label || preset?.label || status;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm uppercase tracking-wider whitespace-nowrap ${cls} ${className}`}
    >
      {text}
    </span>
  );
}
