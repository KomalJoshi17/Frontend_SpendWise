import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transactionAPI, insightsAPI, profileAPI } from '../utils/api';
import { CategoryPieChart, MonthlyBarChart } from '../components/Charts';
import TransactionList from '../components/TransactionList';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [transactionsRes, insightsRes, profileRes] = await Promise.all([
        transactionAPI.getAll(),
        insightsAPI.getMonthly(),
        profileAPI.get().catch(() => ({ data: { monthlyIncome: 2000 } })),
      ]);
      
      setTransactions(transactionsRes.data || []);
      setInsights(insightsRes.data || null);
      setUserProfile(profileRes.data || { monthlyIncome: 2000 });
    } catch (error) {
      console.error('Error fetching data:', error);
      setTransactions([]);
      setInsights(null);
      setUserProfile({ monthlyIncome: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const totalSpending = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your spending overview.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add-transaction')}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg glow-hover"
          >
            + Add Transaction
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spending</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(-totalSpending)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{transactions.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(insights?.totalSpent || 0)}
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Monthly Spending Trend</h2>
            <MonthlyBarChart transactions={transactions} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h2>
          <TransactionList
            transactions={transactions.slice(0, 10)}
            onUpdate={fetchData}
            onDelete={fetchData}
          />
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
