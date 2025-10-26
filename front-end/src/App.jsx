import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';

// 🔒 Protected route component
const ProtectedRoute = ({ element: Element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Wait for auth context to restore user
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <p>Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If no user and not loading, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Element />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <div className="container mt-5">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route (only visible when user restored or logged in) */}
            <Route path="/" element={<ProtectedRoute element={() => <h2>Home Page</h2>} />} />
            <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
