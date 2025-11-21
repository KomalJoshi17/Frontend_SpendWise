import { motion } from 'framer-motion';
import { useDarkMode } from '../context/DarkModeContext';
import PageLayout from '../components/PageLayout';

const Settings = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your app preferences</p>
      </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">About</h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p><strong className="text-gray-800 dark:text-white">App Name:</strong> SpendWise AI</p>
          <p><strong className="text-gray-800 dark:text-white">Version:</strong> 2.0.0</p>
          <p><strong className="text-gray-800 dark:text-white">Description:</strong> Smart Personal Finance Manager</p>
        </div>
      </motion.div>
      </div>
    </PageLayout>
  );
};

export default Settings;

