import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI, transactionAPI, profileAPI } from '../utils/api';
import PageLayout from '../components/PageLayout';

const AISavings = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiAPI.getSavingsRecommendations();
      let recs = response.data.recommendations || [];
      
      if (typeof recs === 'string') {
        try {
          recs = JSON.parse(recs);
        } catch {
          recs = recs
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(line => line.length > 0);
        }
      }
      
      if (!Array.isArray(recs)) {
        recs = [recs];
      }
      
      setRecommendations(recs);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setError('Failed to fetch AI recommendations. Please try again.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🤖 AI Savings Advisor
            </h1>
            <p className="text-gray-400">
              Get personalized savings recommendations powered by AI
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRecommendations}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : '🔄 Refresh'}
          </motion.button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400">AI is analyzing your spending patterns...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-300"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">💡</span>
                      <h3 className="font-semibold text-white">
                        Recommendation {index + 1}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(rec, index)}
                  className="w-full px-4 py-2 bg-primary-900/20 text-primary-300 rounded-lg hover:bg-primary-900/30 transition-colors text-sm font-medium"
                >
                  {copiedIndex === index ? '✓ Copied!' : '📋 Copy'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-gray-400 text-lg">
              No recommendations available. Add some transactions to get AI insights!
            </p>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default AISavings;

