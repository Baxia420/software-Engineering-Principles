import React from 'react';

/**
 * Editorial page header: large Newsreader serif title with a gold accent rule,
 * supporting subtitle, and an optional right-side action slot (children).
 */
export default function PageHeader({ title, subtitle, children, className = '' }) {
  return (
    <header
      className={`mb-8 pb-6 border-b border-outline-variant flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${className}`}
    >
      <div>
        <h1 className="font-h1 text-h1 text-primary font-bold relative inline-block pb-3 leading-tight">
          {title}
          <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-secondary-container rounded-full" />
        </h1>
        {subtitle && (
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="shrink-0 flex items-center gap-3">{children}</div>}
    </header>
  );
}
