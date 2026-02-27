import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Router } from './components/Router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Game } from './pages/Game';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserStats } from './pages/UserStats';

function App() {
  return (
    <AuthProvider>
      <Router>
        {(currentPath) => {
          if (currentPath === '/' || currentPath === '') {
            return <Landing />;
          }
          if (currentPath === '/login') {
            return <Login />;
          }
          if (currentPath === '/register') {
            return <Register />;
          }
          if (currentPath === '/game') {
            return (
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            );
          }
          if (currentPath === '/stats') {
            return (
              <ProtectedRoute>
                <UserStats />
              </ProtectedRoute>
            );
          }
          if (currentPath === '/admin') {
            return (
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            );
          }
          return <Landing />;
        }}
      </Router>
    </AuthProvider>
  );
}

export default App;
