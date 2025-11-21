import { useState } from 'react';
import { motion } from 'framer-motion';
import { transactionAPI } from '../utils/api';
import { formatCurrency } from '../utils/currency';

const categoryColors = {
  food: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  travel: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  shopping: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  bills: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  entertainment: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
  medical: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  education: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
};

const TransactionList = ({ transactions, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '', date: '', time: '', type: 'debit' });
   
  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    const date = transaction.date ? new Date(transaction.date) : new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].substring(0, 5); 
    setEditForm({
      amount: transaction.amount,
      description: transaction.description,
      date: dateStr,
      time: timeStr,
      type: transaction.type || 'debit',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: '', description: '', date: '', time: '', type: 'debit' });
  };

  const handleSaveEdit = async (id) => {
    try {
      const dateTime = editForm.date && editForm.time 
        ? `${editForm.date}T${editForm.time}:00`
        : editForm.date || new Date().toISOString();
      
      const updateData = {
        amount: editForm.amount,
        description: editForm.description,
        date: dateTime,
        type: editForm.type,
      };
      
      await transactionAPI.update(id, updateData);
      onUpdate();
      setEditingId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        onDelete();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const formatCategory = (category) => {
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Other';
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.other;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No transactions found</p>
        <p className="text-sm mt-2">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className="glass-card rounded-2xl p-6"
        >
          {editingId === transaction._id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Type
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({ ...editForm, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveEdit(transaction._id)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors glow-hover"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {transaction.description}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                    {formatCategory(transaction.category)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.type === 'credit'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {transaction.type === 'credit' ? 'Income' : 'Expense'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(transaction.date)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-xl font-bold ${
                  transaction.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(transaction)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(transaction._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;
