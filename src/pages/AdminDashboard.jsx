import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Link } from '../components/Router';
import { Users, UserPlus, Trash2, LogOut } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, loggedInUsers: 0, adminUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats()
      ]);

      if (usersData.users) {
        setUsers(usersData.users);
      }
      if (statsData.totalUsers !== undefined) {
        setStats(statsData);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const result = await adminAPI.deleteUser(userId);
      if (result.message) {
        setSuccess(`User ${username} deleted successfully`);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await adminAPI.createUser(newUser);
      if (result.username) {
        setSuccess(`User ${result.username} created successfully`);
        setNewUser({ username: '', email: '', password: '', isAdmin: false });
        setShowAddUser(false);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else if (result.message) {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to create user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <nav className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-400 p-1.5 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">Admin Control</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-slate-300 px-3 py-1 bg-slate-700/30 rounded-full flex-shrink-0">👤 {user?.username}</span>
            <Link
              to="/game"
              className="btn-primary text-xs sm:text-sm font-medium px-3 py-2"
            >
              Play Game
            </Link>
            <button
              onClick={logout}
              className="btn-danger text-xs sm:text-sm font-medium px-3 py-2 flex items-center gap-2"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto p-4 sm:p-8">
        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">!</span>
            </div>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/15 border border-green-500/30 text-green-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">✓</span>
            </div>
            <div>{success}</div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card p-6 sm:p-8 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Total Users</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{stats.totalUsers}</p>
              </div>
              <Users size={40} className="text-blue-400/30 sm:w-16 sm:h-16" />
            </div>
          </div>

          <div className="card p-6 sm:p-8 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Logged In</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">{stats.loggedInUsers}</p>
              </div>
              <Users size={40} className="text-green-400/30 sm:w-16 sm:h-16" />
            </div>
          </div>

          <div className="card p-6 sm:p-8 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Admins</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2 bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">{stats.adminUsers}</p>
              </div>
              <Users size={40} className="text-purple-400/30 sm:w-16 sm:h-16" />
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold">User Management</h2>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="bg-blue-600 px-3 sm:px-4 py-2 sm:py-2 rounded hover:bg-blue-700 active:bg-blue-800 transition flex items-center gap-2 text-xs sm:text-sm font-medium w-full sm:w-auto justify-center sm:justify-start"
            >
              <UserPlus size={16} />
              Add User
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={handleAddUser} className="bg-gray-700 p-4 sm:p-6 rounded-lg mb-6">
              <h3 className="text-base sm:text-xl font-bold mb-4">Create New User</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-2 sm:py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    required
                    minLength={3}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 sm:py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    required
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 sm:py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    required
                    minLength={6}
                    placeholder="Password"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs sm:text-sm">Admin User</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 px-4 sm:px-6 py-2 rounded hover:bg-green-700 transition text-xs sm:text-sm font-medium"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="bg-gray-600 px-4 sm:px-6 py-2 rounded hover:bg-gray-700 transition text-xs sm:text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Users Display - Table on desktop, Cards on mobile */}
          {isMobile ? (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u._id} className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Username</p>
                    <p className="text-sm font-semibold">{u.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-xs sm:text-sm truncate">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.isLoggedIn
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {u.isLoggedIn ? 'Online' : 'Offline'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Login</p>
                    <p className="text-xs">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u._id, u.username)}
                    disabled={u._id === user?.id}
                    className="w-full bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs font-medium"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Username</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">{u.username}</td>
                      <td className="py-3 px-4 truncate">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          u.isLoggedIn
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {u.isLoggedIn ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          u.isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {u.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.username)}
                          disabled={u._id === user?.id}
                          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
