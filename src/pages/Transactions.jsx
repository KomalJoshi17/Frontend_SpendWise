
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transactionAPI, profileAPI } from '../utils/api';
import TransactionList from '../components/TransactionList';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); 
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [userProfile, setUserProfile] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((txn) => {
        return (
          txn.description?.toLowerCase().includes(searchLower) ||
          (txn.category && txn.category.toLowerCase().includes(searchLower)) ||
          txn.amount.toString().includes(searchLower)
        );
      });
    }

    if (filterType === 'spend') {
      filtered = filtered.filter((txn) => txn.type === 'debit');
    } else if (filterType === 'received') {
      filtered = filtered.filter((txn) => txn.type === 'credit');
    }
    filtered.sort((a, b) => {
      const timestampA = new Date(a.date).getTime();
      const timestampB = new Date(b.date).getTime();
      const fallbackA = a.createdAt ? new Date(a.createdAt).getTime() : timestampA;
      const fallbackB = b.createdAt ? new Date(b.createdAt).getTime() : timestampB;
      const finalA = timestampA || fallbackA;
      const finalB = timestampB || fallbackB;
      return sortOrder === 'newest' ? finalB - finalA : finalA - finalB;
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, sortOrder, transactions]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all your transactions</p>
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

        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-2xl p-6"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Budget</p>
              <p className={`text-2xl font-bold ${budgetCalculations.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetCalculations.remaining)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-2xl p-6"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Left</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(budgetCalculations.savingsLeft)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-2xl p-6"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent This Month</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(budgetCalculations.totalSpent)}
              </p>
            </motion.div>
          </div>
        )}

        <div className="glass-card rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-2">Search by Name</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="spend">Spend</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-2">Sort by Date</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest to Oldest</option>
                <option value="oldest">Oldest to Newest</option>
              </select>
            </div>
          </div>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onUpdate={fetchTransactions}
          onDelete={fetchTransactions}
        />
      </div>
    </PageLayout>
  );
};

export default Transactions;
