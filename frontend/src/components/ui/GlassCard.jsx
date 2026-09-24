import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className, hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -5, 
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderColor: 'rgba(249, 115, 22, 0.3)'
      } : {}}
      className={cn(
        "glass-card p-6 rounded-2xl transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NeonButton = ({ children, className, onClick, disabled, variant = 'primary' }) => {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, className)}
    >
      {children}
    </motion.button>
  );
};
