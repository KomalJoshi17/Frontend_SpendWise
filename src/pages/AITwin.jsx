import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../utils/api';
import PageLayout from '../components/PageLayout';
import { formatCurrency } from '../utils/currency';

const AITwin = () => {
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTwinData();
  }, []);

  const fetchTwinData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getTwin();
      setTwinData(response.data);
    } catch (err) {
      console.error('Error fetching AI Twin data:', err);
      setError('Failed to load your AI Spending Twin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPersonalityEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('saver') || lowerName.includes('frugal')) return '💰';
    if (lowerName.includes('balanced')) return '⚖️';
    if (lowerName.includes('spender') || lowerName.includes('impulse')) return '🛍️';
    if (lowerName.includes('planner') || lowerName.includes('strategic')) return '📊';
    if (lowerName.includes('minimalist')) return '🎯';
    return '🧠';
  };

  const getRiskColor = (riskScore) => {
    const risk = riskScore?.toLowerCase() || 'medium';
    if (risk === 'low') return 'text-green-400 bg-green-900/20 border-green-800';
    if (risk === 'high') return 'text-red-400 bg-red-900/20 border-red-800';
    return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
  };

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
            <p className="mt-4 text-white">Analyzing your spending patterns...</p>
            <p className="mt-2 text-sm text-gray-400">This may take a few seconds</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <p className="text-white text-lg mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchTwinData}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!twinData) {
    return null;
  }

  return (
    <PageLayout>
      <div className="space-y-6">     
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary-900/20 to-primary-800/20"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-4"
            >
              {getPersonalityEmoji(twinData.personalityName)}
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">Your AI Spending Twin</h1>
            <p className="text-gray-400 text-lg">A personalized look at how you spend and save</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{getPersonalityEmoji(twinData.personalityName)}</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{twinData.personalityName}</h2>
              <p className="text-gray-400 mt-1">{twinData.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Top Strengths
            </h3>
            <ul className="space-y-3">
              {twinData.strengths?.slice(0, 3).map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-300">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-red-400 mr-2">⚠</span>
              Top Weaknesses
            </h3>
            <ul className="space-y-3">
              {twinData.weaknesses?.slice(0, 3).map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <span className="text-red-400 mt-1">⚠</span>
                  <span className="text-gray-300">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`glass-card rounded-2xl p-6 border-2 ${getRiskColor(twinData.riskScore)}`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Risk Score</h3>
            <p className="text-3xl font-bold">{twinData.riskScore || 'Medium'}</p>
            <p className="text-sm text-gray-400 mt-2">
              {twinData.riskScore === 'Low' && 'You have good financial control'}
              {twinData.riskScore === 'High' && 'Consider reviewing your spending habits'}
              {(!twinData.riskScore || twinData.riskScore === 'Medium') && 'Moderate financial risk level'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-2xl p-6 bg-yellow-900/20 border-2 border-yellow-800"
          >
            <h3 className="text-lg font-semibold text-white mb-2">💡 Habit to Improve</h3>
            <p className="text-yellow-300 leading-relaxed">{twinData.habitToImprove || 'Track your expenses daily'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-green-800/20 border-2 border-green-800"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Predicted Savings</h3>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              className="text-3xl font-bold text-green-400"
            >
              {formatCurrency(twinData.predictedSavings || 0)}
            </motion.p>
            <p className="text-sm text-gray-400 mt-2">Expected by month-end</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchTwinData}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            🔄 Refresh Analysis
          </motion.button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default AITwin;

