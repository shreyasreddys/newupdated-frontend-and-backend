import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`glass-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
