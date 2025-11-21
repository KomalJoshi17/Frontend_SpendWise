import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Insights from './pages/Insights';
import Home from './pages/Home';
import Savings from './pages/Savings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AISavings from './pages/AISavings';
import AIChat from './pages/AIChat';
import AITwin from './pages/AITwin';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black dark:bg-black transition-colors flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-black">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const googleAuth = urlParams.get('googleAuth');
    const userParam = urlParams.get('user');
    
    if (token && googleAuth === 'true') {
      localStorage.setItem('token', token);
      
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      window.history.replaceState({}, document.title, '/');
      window.location.href = '/'; 
    }
  }, []);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Transactions />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Insights />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-transaction"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddTransaction />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Savings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-savings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AISavings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AIChat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-twin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AITwin />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
