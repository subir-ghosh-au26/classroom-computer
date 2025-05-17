import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClassroomsPage from './pages/ClassroomsPage';
import ComputersPage from './pages/ComputersPage';
import IssuesPage from './pages/IssuesPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Or a proper spinner
  }

  return (
    <>
      {user && <Navbar />} {/* Show Navbar only if user is logged in */}
      <div className={user ? "container" : ""}> {/* Apply container style if user logged in */}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

          <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/classrooms" element={<ClassroomsPage />} />
            <Route path="/computers" element={<ComputersPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Default to dashboard if logged in */}
          </Route>

          {/* If not logged in and not on /login, redirect to /login */}
          {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
        </Routes>
      </div>
    </>
  );
}

export default App;