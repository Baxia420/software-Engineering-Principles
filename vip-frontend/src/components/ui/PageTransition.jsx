import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps page content in a gentle fade + slide-up so route changes feel smooth.
 * Purely presentational — does not affect layout flow.
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
