import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase-config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Users } from 'lucide-react';
import { MaxUsersModal } from './MaxUsersModal';

const API_URL = 'https://mealyby-ayush.vercel.app';

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
        { name: user.displayName, email: user.email },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
    } catch (error) {
      throw error;
    }
  };

  const checkUserRoom = async (idToken) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/rooms/user/${auth.currentUser.uid}`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      response.data.room ? navigate('/home') : setShowRoomOptions(true);
    } catch (error) {
      console.error('Error checking room:', error);
      setShowRoomOptions(true);
    } finally {
      setLoading(false);
    }
  };

  if (showRoomOptions) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center tracking-tight">
            Mealy A7
          </h1>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/create-room')}
              className="flex flex-col items-center justify-center gap-3 bg-neutral-800/80 backdrop-blur-xl p-6 rounded-3xl hover:bg-neutral-700/80 transition-all group border border-neutral-700/50"
            >
              <div className="w-14 h-14 rounded-full bg-neutral-700/50 flex items-center justify-center group-hover:ring-4 ring-neutral-600/50 transition-all">
                <Plus className="w-7 h-7" />
              </div>
              <span className="text-lg font-medium">Create Room</span>
            </button>
            
            <button
              onClick={() => navigate('/join-room')}
              className="flex flex-col items-center justify-center gap-3 bg-neutral-800/80 backdrop-blur-xl p-6 rounded-3xl hover:bg-neutral-700/80 transition-all group border border-neutral-700/50"
            >
              <div className="w-14 h-14 rounded-full bg-neutral-700/50 flex items-center justify-center group-hover:ring-4 ring-neutral-600/50 transition-all">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-lg font-medium">Join Room</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Mealy A7
            </h1>
            <p className="text-neutral-400">Track shared meals effortlessly</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 backdrop-blur-xl border border-red-900/20 rounded-2xl">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-neutral-200 rounded-2xl backdrop-blur-xl">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <img
                    src="/google.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-lg font-medium">Continue with Google</span>
                </>
              )}
            </div>
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