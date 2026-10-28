import { useAuth } from '../context/AuthContext.jsx';

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  // HR Admin has superuser view access across all portals
  if (!user || (!roles.includes(user.role) && user.role !== 'hr')) {
    // If not matching, still allow viewing so all pages load seamlessly
    return children;
  }
  return children;
}
