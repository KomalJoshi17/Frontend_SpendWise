import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileAPI, transactionAPI } from '../utils/api';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const Savings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ monthlyIncome: '', savingsGoal: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        profileAPI.get(),
        transactionAPI.getAll(),
      ]);
      setUserProfile(profileRes.data);
      setTransactions(transactionsRes.data);
      setFormData({
        monthlyIncome: profileRes.data.monthlyIncome || '',
        savingsGoal: profileRes.data.savingsGoal || '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await profileAPI.update({
        monthlyIncome: parseFloat(formData.monthlyIncome),
        savingsGoal: parseFloat(formData.savingsGoal),
      });
      await fetchData();
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update savings goals');
    }
  };

  const calculateSavings = () => {
    if (!userProfile) return { spent: 0, remaining: 0, savingsLeft: 0 };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= startOfMonth;
    });

    let totalDebit = 0;
    let totalCredit = 0;

    monthlyTransactions.forEach((txn) => {
      if (txn.type === 'debit') totalDebit += txn.amount;
      else totalCredit += txn.amount;
    });

    const totalSpent = totalDebit - totalCredit;
    const spendable = (userProfile.monthlyIncome || 0) - (userProfile.savingsGoal || 0);
    const remaining = spendable - totalSpent;
    const savingsLeft = (userProfile.savingsGoal || 0) - Math.max(0, totalSpent - spendable);
    const progress = userProfile.monthlyIncome > 0
      ? ((totalSpent / userProfile.monthlyIncome) * 100)
      : 0;

    return { spent: totalSpent, remaining, savingsLeft, progress, spendable };
  };

  const savings = calculateSavings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Savings Goals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your savings and spending</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
          >
            {editing ? 'Save' : 'Edit Goals'}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.02, y: -5 }}>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Monthly Income</h3>
            {editing ? (
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {formatCurrency(userProfile?.monthlyIncome || 0)}
              </p>
            )}
          </motion.div>

          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.02, y: -5 }}>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Savings Goal</h3>
            {editing ? (
              <input
                type="number"
                value={formData.savingsGoal}
                onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(userProfile?.savingsGoal || 0)}
              </p>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.02, y: -5 }}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent This Month</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(savings.spent)}
            </p>
          </motion.div>

          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.02, y: -5 }}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Budget</p>
            <p className={`text-2xl font-bold ${savings.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(savings.remaining)}
            </p>
          </motion.div>

          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.02, y: -5 }}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Protected</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(savings.savingsLeft)}
            </p>
          </motion.div>

        </div>

        {userProfile?.monthlyIncome > 0 && (
          <motion.div className="glass-card rounded-2xl p-6" whileHover={{ scale: 1.01 }}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Progress</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {savings.progress.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-primary-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(savings.progress, 100)}%` }}
              ></div>
            </div>
          </motion.div>
        )}

      </div>
    </PageLayout>
  );
};

export default Savings;
