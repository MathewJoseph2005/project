import { useState, useEffect } from 'react';
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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.username}!</span>
            <Link
              to="/game"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Play Game
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {error && (
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Users</p>
                <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <Users size={48} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Logged In Users</p>
                <p className="text-4xl font-bold mt-2">{stats.loggedInUsers}</p>
              </div>
              <Users size={48} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Admin Users</p>
                <p className="text-4xl font-bold mt-2">{stats.adminUsers}</p>
              </div>
              <Users size={48} className="text-purple-200" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={handleAddUser} className="bg-gray-700 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Create New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                      className="mr-2 w-4 h-4"
                    />
                    <span>Admin User</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
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
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          u.isLoggedIn
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {u.isLoggedIn ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          u.isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
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
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
