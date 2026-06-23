import React from 'react';
import { motion } from 'framer-motion';

/**
 * Standard surface container. Replaces the repeated
 * `bg-surface-container-lowest border border-outline-variant rounded-* shadow-sm`
 * block used across pages.
 *
 * Props:
 *   accent   - show the 4px amber left border (signature listing/card accent)
 *   hover    - enable hover lift + border->primary transition (for clickable cards)
 *   animate  - fade-up entrance (set `delay` in ms for staggering)
 *   as       - underlying element/component (default div)
 */
export default function Card({
  children,
  className = '',
  accent = false,
  hover = false,
  animate = false,
  delay = 0,
  as = 'div',
  ...props
}) {
  const base =
    'bg-surface-container-lowest border border-outline-variant rounded-lg shadow-soft';
  const accentCls = accent ? 'border-l-4 border-l-secondary-container' : '';
  const hoverCls = hover
    ? 'transition-all duration-300 ease-out hover:shadow-lift hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer'
    : '';

  if (animate) {
    const MotionTag = motion[as] || motion.div;
    return (
      <MotionTag
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
        className={`${base} ${accentCls} ${hoverCls} ${className}`}
        {...props}
      >
        {children}
      </MotionTag>
    );
  }

  const Tag = as;
  return (
    <Tag className={`${base} ${accentCls} ${hoverCls} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
