
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold text-white">SpendWise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Smart Personal Finance Manager powered by AI. Track expenses, set savings goals, and make better financial decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/savings" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Savings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/settings" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} SpendWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

