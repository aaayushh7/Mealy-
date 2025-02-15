import React, { useState } from 'react';
import { ChevronLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinishedFood = ({ users, onUndo }) => {
  const navigate = useNavigate();
  const [showUndoMessage, setShowUndoMessage] = useState(false);
  const remainingUsers = users.filter(user => !user.hasEaten && !user.isAway);
  const usersWhoAte = users.filter(user => user.hasEaten);

  const handleUndoHover = () => {
    setShowUndoMessage(true);
    setTimeout(() => setShowUndoMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <nav className="flex items-center justify-between">
          

          <div className="relative">
            <button
              onClick={onUndo}
              onMouseEnter={handleUndoHover}
              className="w-12 h-12 rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 transition-all backdrop-blur-xl flex items-center justify-center group"
            >
              <RotateCcw className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {showUndoMessage && (
              <div className="absolute right-0 top-14 w-48 p-2 bg-neutral-800/90 backdrop-blur-xl rounded-lg text-sm text-center animate-fade-in z-10">
                Was it a mistake? Reset status
              </div>
            )}
          </div>
        </nav>

        <div className="bg-neutral-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-neutral-800/50 overflow-hidden">
          <div className="p-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold">Food Status</h2>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            {usersWhoAte.length > 0 && (
              <section className="p-3">
                <h3 className="text-lg font-medium text-neutral-400 mb-4">Have eaten</h3>
                <div className="space-y-3">
                  {usersWhoAte.map(user => (
                    <div 
                      key={user._id} 
                      className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-2xl backdrop-blur-xl border border-neutral-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-emerald-400 text-xl">✓</span>
                        </div>
                        <span className="text-md font-medium">{user.name}</span>
                      </div>
                      <time className="text-sm font-medium text-neutral-400">
                        {user.lastEatenAt && new Date(user.lastEatenAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {remainingUsers.length > 0 && (
              <section className="p-3">
                <h3 className="text-lg font-medium text-neutral-400 mb-4">Need to eat</h3>
                <div className="space-y-3">
                  {remainingUsers.map(user => (
                    <div 
                      key={user._id} 
                      className="flex items-center justify-between p-4 bg-red-950/20 rounded-2xl backdrop-blur-xl border border-red-900/20"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <span className="text-red-400 text-lg">!</span>
                        </div>
                        <span className="text-md font-medium">{user.name}</span>
                      </div>
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium">
                        Missed meal
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedFood;
