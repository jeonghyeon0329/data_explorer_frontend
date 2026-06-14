import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-[#18181b] border-b border-gray-800 px-6 py-3 flex items-center justify-between shrink-0">
      <span
        className="text-white font-bold text-lg cursor-pointer tracking-wide hover:text-gray-300 transition"
        onClick={() => navigate('/dashboard')}
      >
        DataExplorer
      </span>
      <div className="flex items-center gap-5">
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-yellow-400 hover:text-yellow-300 transition font-medium"
          >
            Admin
          </button>
        )}
        <span className="text-sm text-gray-400">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
