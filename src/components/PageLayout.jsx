import { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ children, className = '' }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageLayout;

