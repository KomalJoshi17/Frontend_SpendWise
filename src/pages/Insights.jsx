import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { insightsAPI, profileAPI } from '../utils/api';
import { CategoryPieChart, CategoryBarChart } from '../components/Charts';
import RecommendationPanel from '../components/RecommendationPanel';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(2000);

  const fetchInsights = async () => {
    try {
      const [insightsRes, profileRes] = await Promise.all([
        insightsAPI.getMonthly(),
        profileAPI.get().catch(() => ({ data: { monthlyIncome: 2000 } })),
      ]);
      setInsights(insightsRes.data);
      setIncome(profileRes.data.monthlyIncome || 2000);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full mx-auto mb-4"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading insights...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Insights</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Analyze your spending patterns</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent This Month</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(insights?.totalSpent || 0)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Month Total</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(insights?.previousMonthTotal || 0)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Change from Last Month</p>
            <p
              className={`text-3xl font-bold ${
                insights?.changeFromLastMonth >= 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {insights?.changeFromLastMonth >= 0 ? '+' : ''}
              {insights?.changeFromLastMonth?.toFixed(1) || '0.0'}%
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Category Breakdown</h2>
            <CategoryPieChart data={insights?.categoryBreakdown} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Category Comparison</h2>
            <CategoryBarChart data={insights?.categoryBreakdown} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RecommendationPanel insights={insights} />
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Insights;
