
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currency';

const RecommendationPanel = ({ insights }) => {
  const allTips = [
    ...(insights?.tips || []),
    ...(insights?.aiRecommendations || []),
  ];

  if (!insights || allTips.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">💡 Insights</h3>
        <p className="text-gray-400">No insights available yet. Add transactions to get personalized recommendations!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary-900/20 to-primary-800/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">💡</span>
        Smart Recommendations
      </h3>
      <ul className="space-y-3">
        {allTips.slice(0, 5).map((tip, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <span className="text-primary-400 mt-1">•</span>
            <span className="text-gray-300 text-sm">{tip}</span>
          </motion.li>
        ))}
      </ul>
      
      {insights.totalSpent !== undefined && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Spent This Month</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(insights.totalSpent)}
              </p>
            </div>
            {insights.changeFromLastMonth !== undefined && (
              <div>
                <p className="text-sm text-gray-400">Change from Last Month</p>
                <p
                  className={`text-2xl font-bold ${
                    insights.changeFromLastMonth >= 0
                      ? 'text-red-400'
                      : 'text-green-400'
                  }`}
                >
                  {insights.changeFromLastMonth >= 0 ? '+' : ''}
                  {insights.changeFromLastMonth.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecommendationPanel;

