import React from 'react';
import { motion } from 'framer-motion';

/**
 * Themed button with three variants. Keeps the brand's flat aesthetic but
 * adds a subtle hover lift and a tactile press (scale) for responsiveness.
 *
 *   primary   -> solid maroon
 *   secondary -> outline maroon
 *   ghost     -> text-only / subtle hover fill
 */
const VARIANTS = {
  primary:
    'bg-primary-container text-on-primary border border-transparent hover:bg-primary shadow-soft hover:shadow-lift',
  secondary:
    'bg-transparent text-primary border border-primary/60 hover:bg-primary/5 hover:border-primary',
  ghost:
    'bg-transparent text-on-surface-variant border border-transparent hover:bg-surface-container-high hover:text-primary',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-label-sm',
  md: 'px-5 py-2.5 text-label-md',
  lg: 'px-6 py-3.5 text-label-md',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 font-label-md rounded-DEFAULT cursor-pointer
        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
