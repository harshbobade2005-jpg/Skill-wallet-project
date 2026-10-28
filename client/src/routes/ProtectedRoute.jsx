import { useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import PageLoader from '../components/PageLoader.jsx';
import Login from '../pages/Login.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  // If still not authenticated after auto-login attempt, show Quick Open Launchpad
  if (!user) {
    return <Login />;
  }

  return children;
}
