import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Users, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthProvider';

const API_URL = 'https://mealyby-ayush.vercel.app';
const WEBSITE_LINK = 'https://mealy-a7.vercel.app';

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`Hey this is our room code: ${code} and signup here ${WEBSITE_LINK} and join room`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-10 h-10 bg-neutral-800/80 rounded-full hover:bg-neutral-700/80 transition-all"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4 text-neutral-400" />
      )}
    </button>
  );
};

const RoomManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
      const checkRoom = async () => {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`${API_URL}/api/rooms/user/${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.room) {
            navigate('/home');
          }
          setLoading(false);
        } catch (error) {
          console.error('Error checking room:', error);
          setLoading(false);
        }
      };
   
      if (user) {
        checkRoom();
      }
    }, [user, navigate]);
   
    if (loading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      );
    }
   
    return (
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-12">
          <h1 className="text-4xl font-bold text-center text-white tracking-tight">
            Mealy A7
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/create-room')}
              className="w-full flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 transition-all group bg-neutral-900/50 hover:bg-neutral-800/50 backdrop-blur-xl shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:ring-4 ring-neutral-700/50 transition-all">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="text-lg font-medium text-white">Create Room</span>
            </button>
            
            <button
              onClick={() => navigate('/join-room')}
              className="w-full flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 transition-all group bg-neutral-900/50 hover:bg-neutral-800/50 backdrop-blur-xl shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center group-hover:ring-4 ring-neutral-700/50 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <span className="text-lg font-medium text-white">Join Room</span>
            </button>
          </div>
        </div>
      </div>
    );
   };

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const response = await axios.post(`${API_URL}/api/rooms`, {
        name: roomName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoomCode(response.data.code);
      setTimeout(() => navigate('/home'), 9000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 p-6">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-white">
          Create Room
        </h1>

        {error && (
          <div className="p-4 bg-red-500/10 rounded-2xl backdrop-blur-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleCreateRoom} className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-medium text-neutral-400">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-4 bg-neutral-900/80 rounded-2xl border border-neutral-800 focus:ring-2 focus:ring-neutral-700 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-white p-4 rounded-2xl text-lg font-medium hover:bg-neutral-700 disabled:bg-neutral-900 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Room'}
          </button>
        </form>

        {roomCode && (
          <div className="p-6 bg-neutral-900/80 rounded-3xl backdrop-blur-xl border border-neutral-800 space-y-4">
            <p className="text-center text-lg">Share this code with your roommates</p>
            <div className="flex items-center justify-between gap-4 bg-neutral-800/30 p-4 rounded-2xl">
              <p className="text-2xl font-mono text-white">{roomCode}</p>
              <CopyButton code={roomCode} />
            </div>
            <p className="text-center text-neutral-400">Redirecting to home...(5 seconds)</p>
          </div>
        )}
      </div>
    </div>
  );
};

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = await user.getIdToken();
      await axios.post(`${API_URL}/api/rooms/join`, {
        code: roomCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 p-6">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-white">
          Join Room
        </h1>

        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-medium text-neutral-400">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full p-4 bg-neutral-900/80 rounded-2xl border border-neutral-800 focus:ring-2 focus:ring-neutral-700 text-lg"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-center p-4 bg-red-500/10 rounded-2xl backdrop-blur-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-white p-4 rounded-2xl text-lg font-medium hover:bg-neutral-700 disabled:bg-neutral-900 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export { RoomManager, CreateRoom, JoinRoom };
