import React, { useState, useEffect } from 'react';
import { LogOut, Utensils, AlertTriangle, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { FoodStatusModal, UserRanking, AwayModeButton } from './FoodStatusModals';
import FinishedFood from './FinishedFood';

const API_URL = 'https://mealyby-ayush.vercel.app';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-neutral-900/90 rounded-3xl max-w-md w-full shadow-2xl border border-neutral-800/50" onClick={e => e.stopPropagation()}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-white">Meal Schedule</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-2xl">
                <span className="text-neutral-300">Lunch Status</span>
                <span className="text-white font-medium">7:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-2xl">
                <span className="text-neutral-300">Dinner Status</span>
                <span className="text-white font-medium">5:00 PM</span>
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-2xl">
              <p className="text-sm text-blue-300">Schedule editing coming soon (within 36 hours)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-2xl text-white font-medium transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [awayModeLoading, setAwayModeLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [schedule, setSchedule] = useState({ lunchTime: '12:00', dinnerTime: '21:00' });
  const [currentMeal, setCurrentMeal] = useState('');
  const [markAsAteLoading, setMarkAsAteLoading] = useState(false);
  const [reportFoodLoading, setReportFoodLoading] = useState(false);
  const [currentMealPeriod, setCurrentMealPeriod] = useState(() => localStorage.getItem('currentMealPeriod') || 'none');
  const [isFoodFinished, setIsFoodFinished] = useState(() => localStorage.getItem('isFoodFinished') === 'true');
  
  const currentUser = users.find(u => u.firebaseUid === user?.uid);
  const isAway = currentUser?.isAway || false;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const [usersResponse, scheduleResponse] = await Promise.all([
          axios.get(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          }),
          axios.get(`${API_URL}/api/schedule`, {
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          })
        ]);

        setUsers(usersResponse.data);
        setSchedule(scheduleResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const updateMealStatus = async () => {
      const now = new Date();
      const hours = now.getHours();
      const lunchStart = parseInt(schedule.lunchTime.split(':')[0]);
      const dinnerStart = parseInt(schedule.dinnerTime.split(':')[0]);
      
      let newMealPeriod = hours >= lunchStart && hours < dinnerStart ? 'lunch' : 'dinner';

      if (currentMealPeriod !== newMealPeriod) {
        try {
          const token = await user.getIdToken();
          await axios.post(`${API_URL}/api/users/reset-eaten`,
            { 
              previousMealPeriod: currentMealPeriod, 
              newMealPeriod,
              incrementMissed: !isFoodFinished
            },
            { headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } }
          );

          const response = await axios.get(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          });

          setIsFoodFinished(false);
          localStorage.removeItem('isFoodFinished');
          setUsers(response.data);
          setCurrentMealPeriod(newMealPeriod);
          localStorage.setItem('currentMealPeriod', newMealPeriod);
        } catch (error) {
          console.error('Error resetting eating status:', error);
        }
      }
      setCurrentMeal(newMealPeriod === 'lunch' ? 'Lunch is ready' : 'Dinner is ready');
    };

    updateMealStatus();
    const interval = setInterval(updateMealStatus, 60000);
    return () => clearInterval(interval);
  }, [schedule, user, currentMealPeriod, isFoodFinished]);

  const markAsAte = async () => {
    if (!user) return;
    try {
      setMarkAsAteLoading(true);
      const token = await user.getIdToken();
      await axios.post(`${API_URL}/api/users/mark-eaten`, {}, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error marking as ate:', error);
    } finally {
      setMarkAsAteLoading(false);
    }
  };

  const reportFoodFinished = async () => {
    if (!user) return;
    try {
      setReportFoodLoading(true);
      const token = await user.getIdToken();
      await axios.post(`${API_URL}/api/report-food-finished`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      setUsers(response.data);
      setIsFoodFinished(true);
      localStorage.setItem('isFoodFinished', 'true');
      setIsStatusModalOpen(true);
      setIsRankingModalOpen(true);
    } catch (error) {
      console.error('Error reporting food finished:', error);
    } finally {
      setReportFoodLoading(false);
    }
  };

  const undoFoodFinished = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await axios.post(`${API_URL}/api/undo-food-finished`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      setUsers(response.data);
      setIsFoodFinished(false);
      localStorage.removeItem('isFoodFinished');
    } catch (error) {
      console.error('Error undoing food finished:', error);
    }
  };

  const toggleAwayMode = async () => {
    if (!user) return;
    try {
      setAwayModeLoading(true);
      const token = await user.getIdToken();
      await axios.post(`${API_URL}/api/users/toggle-away`, {}, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error toggling away mode:', error);
    } finally {
      setAwayModeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header className="flex items-center justify-between pt-2">
          <h1 className="text-2xl font-bold text-white">Mealy A7</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => signOut(auth)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {isFoodFinished ? (
          <FinishedFood users={users} onUndo={undoFoodFinished} />
        ) : (
          <main className="space-y-6">
            <section className="bg-neutral-800/70 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-700/80 overflow-hidden">
              <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Current Status</h2>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium">
                  {currentMeal}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                {Array.isArray(users) && users.map((flatmate) => (
                  <div
                    key={flatmate._id}
                    className="flex flex-col p-4 bg-neutral-900/80 border-[1px] border-dashed border-gray-400/80 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{flatmate.name}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          flatmate.hasEaten
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {flatmate.hasEaten ? 'Has eaten' : 'Not eaten yet'}
                      </span>
                    </div>
                    {flatmate.lastEatenAt && (
                      <span className="text-sm text-neutral-400">
                        Last ate at {new Date(flatmate.lastEatenAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 m-7">
              <AwayModeButton
                isAway={isAway}
                onToggle={toggleAwayMode}
                isLoading={awayModeLoading}
              />
              
              <button
                onClick={markAsAte}
                disabled={isAway || markAsAteLoading || (Array.isArray(users) && users.find(u => u.firebaseUid === user.uid)?.hasEaten)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 disabled:bg-neutral-900 disabled:text-neutral-600 rounded-2xl font-medium transition-all"
              >
                {markAsAteLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Utensils className="w-5 h-5" />
                )}
                {markAsAteLoading ? 'Marking...' : 'Mark as ate'}
              </button>

              <button
                onClick={reportFoodFinished}
                disabled={isAway || reportFoodLoading || isFoodFinished}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/40 hover:bg-red-500/20 active:bg-red-500/30 disabled:bg-neutral-900 disabled:text-neutral-600 rounded-2xl font-medium transition-all text-red-300"
              >
                {reportFoodLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {reportFoodLoading ? 'Reporting...' : 'Report food finished'}
              </button>
            </section>

            <UserRanking users={users} />
          </main>
        )}
        
        <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
        <FoodStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          users={users}
        />
      </div>
    </div>
  );
}

export default Home;
