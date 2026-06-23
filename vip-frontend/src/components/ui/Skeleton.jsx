import React from 'react';

/**
 * Shimmer skeleton block. Compose freely, or use the prebuilt SkeletonCard
 * for list/grid loading states (replaces bare spinners).
 */
export function Skeleton({ className = '' }) {
  return <div className={`vip-skeleton rounded-lg ${className}`} />;
}

/** A card-shaped skeleton matching the InternshipCard / list-row footprint. */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-9 w-24 rounded-DEFAULT" />
      </div>
    </div>
  );
}

/** Convenience: render N skeleton cards. */
export function SkeletonList({ count = 4 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
