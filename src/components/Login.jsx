// Login.jsx
import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { MaxUsersModal } from './MaxUsersModal';

const API_URL = 'http://localhost:3000';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMaxUsersModal, setShowMaxUsersModal] = useState(false);
  const [showRoomOptions, setShowRoomOptions] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await registerUser(result.user, idToken);
      await checkUserRoom(idToken);
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  const registerUser = async (user, idToken) => {
    try {
      await axios.post(
        `${API_URL}/api/users/register`,
        {
          name: user.displayName,
          email: user.email
        },
        {
          headers: { Authorization: `Bearer ${idToken}` }
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const checkUserRoom = async (idToken) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/rooms/user/${auth.currentUser.uid}`,
        {
          headers: { Authorization: `Bearer ${idToken}` }
        }
      );
      
      if (response.data.room) {
        navigate('/home');
      } else {
        setShowRoomOptions(true);
      }
    } catch (error) {
      console.error('Error checking room:', error);
      setShowRoomOptions(true);
    } finally {
      setLoading(false);
    }
  };

  if (showRoomOptions) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-md mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Meal Tracker
          </h1>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => navigate('/create-room')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Room
            </button>
            
            <button
              onClick={() => navigate('/join-room')}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-500 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Join Existing Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-[90%] bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-tight">
            W-306 Meal Tracker
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center bg-gray-700 rounded-lg px-6 py-3.5 text-white font-medium 
              transition-all duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed 
              group relative overflow-hidden"
          >
            <div className="flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <img
                    src="/google.png"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  <span className="text-sm">Sign in with Google</span>
                </>
              )}
            </div>
            
            <div 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                transition-transform duration-700 bg-gradient-to-r from-transparent 
                via-white/10 to-transparent" 
            />
          </button>
        </div>
      </div>
      
      <MaxUsersModal 
        isOpen={showMaxUsersModal} 
        onClose={() => setShowMaxUsersModal(false)} 
      />
    </>
  );
}

export default Login;