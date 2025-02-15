// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Login from './components/Login';
import Home from './components/Home';
import ScheduleSettings from './components/ScheduleSettings';
import { RoomManager, CreateRoom, JoinRoom } from './components/RoomManager';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <RoomManager />
              </PrivateRoute>
            } />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <ScheduleSettings />
              </PrivateRoute>
            } />
            <Route path="/create-room" element={
              <PrivateRoute>
                <CreateRoom />
              </PrivateRoute>
            } />
            <Route path="/join-room" element={
              <PrivateRoute>
                <JoinRoom />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;