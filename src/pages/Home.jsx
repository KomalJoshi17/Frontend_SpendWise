import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';

const Home = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome back, {user?.name}! 👋
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Manage your finances smartly with SpendWise AI. Track expenses, set savings goals, and get intelligent insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/add-transaction"
                className="block bg-gradient-to-br from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white rounded-2xl p-6 text-center transition-all shadow-lg"
              >
                <div className="text-4xl mb-2">➕</div>
                <div className="font-semibold text-lg">Add Transaction</div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/transactions"
                className="block bg-gradient-to-br from-emerald-500 to-lime-400 hover:from-emerald-600 hover:to-lime-500 text-white rounded-2xl p-6 text-center transition-all shadow-lg"
              >
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold text-lg">View Transactions</div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/savings"
                className="block bg-gradient-to-br from-indigo-500 to-violet-400 hover:from-indigo-600 hover:to-violet-500 text-white rounded-2xl p-6 text-center transition-all shadow-lg"
              >
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-semibold text-lg">Savings Goals</div>
              </Link>
            </motion.div>

          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🤖 AI-Powered
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatic transaction categorization using Gemini AI. Get smart savings recommendations tailored for you.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              💾 Savings Tracker
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set monthly savings goals and receive alerts when you're about to spend from your planned savings.
            </p>
          </motion.div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
