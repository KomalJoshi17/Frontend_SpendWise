import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transactionAPI, profileAPI } from '../utils/api';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showSavingsAlert, setShowSavingsAlert] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
    type: 'debit',
  });

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.get();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
  }, []);
  const budgetCalculations = useMemo(() => {
    if (!userProfile) return { totalSpent: 0, remaining: 0, savingsLeft: 0 };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= startOfMonth;
    });

    let totalDebit = 0;
    let totalCredit = 0;

    monthlyTransactions.forEach((txn) => {
      if (txn.type === 'debit') {
        totalDebit += txn.amount;
      } else {
        totalCredit += txn.amount;
      }
    });

    const totalSpent = totalDebit - totalCredit;
    const spendable = (userProfile.monthlyIncome || 0) - (userProfile.savingsGoal || 0);
    const remaining = spendable - totalSpent;
    const savingsLeft = (userProfile.savingsGoal || 0) - Math.max(0, totalSpent - spendable);

    return { totalSpent, remaining, savingsLeft, spendable };
  }, [transactions, userProfile]);

  const checkSavingsUsage = (amount, type) => {
    if (type === 'credit' || !userProfile) return false;
    const { remaining } = budgetCalculations;
    return remaining - amount < 0;
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(newTransaction.amount);
    const wouldUseSavings = checkSavingsUsage(amount, newTransaction.type);

    if (wouldUseSavings) {
      setPendingTransaction(newTransaction);
      setShowSavingsAlert(true);
      return;
    }

    await submitTransaction(newTransaction);
  };

  const submitTransaction = async (txnData) => {
    try {
      const dateTime = txnData.date && txnData.time 
        ? `${txnData.date}T${txnData.time}:00`
        : txnData.date || new Date().toISOString();
      
      const transactionData = {
        amount: txnData.amount,
        description: txnData.description,
        date: dateTime,
        type: txnData.type,
        category: txnData.category || 'other',
      };
      
      await transactionAPI.create(transactionData);
      navigate('/transactions');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleSavingsAlertConfirm = async () => {
    setShowSavingsAlert(false);
    await submitTransaction(pendingTransaction);
    setPendingTransaction(null);
  };

  const handleSavingsAlertCancel = () => {
    setShowSavingsAlert(false);
    setPendingTransaction(null);
  };

  const balanceAfterTransaction = useMemo(() => {
    if (!newTransaction.amount || !userProfile) return budgetCalculations.remaining;
    const amount = parseFloat(newTransaction.amount) || 0;
    if (newTransaction.type === 'credit') {
      return budgetCalculations.remaining + amount;
    }
    return budgetCalculations.remaining - amount;
  }, [newTransaction, budgetCalculations, userProfile]);

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add Transaction</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Record a new income or expense</p>
        </div>
        <button
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      {userProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Budget</p>
            <p className={`text-2xl font-bold ${budgetCalculations.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(budgetCalculations.remaining)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Protected</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(budgetCalculations.savingsLeft)}
            </p>
          </div>
        </div>
      )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type
            </label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="debit">Debit (Expense)</option>
              <option value="credit">Credit (Income)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, description: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Pizza at restaurant"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newTransaction.time}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, time: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {userProfile && newTransaction.amount && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance after this transaction:</p>
              <p className={`text-lg font-semibold ${balanceAfterTransaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balanceAfterTransaction)}
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg glow-hover"
          >
            Add Transaction
          </motion.button>
        </form>
        </motion.div>

      {showSavingsAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">⚠️ Savings Alert</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You are using money from your savings goal. Avoid this purchase or adjust your expenses. Do you want to continue?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleSavingsAlertCancel}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavingsAlertConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AddTransaction;

