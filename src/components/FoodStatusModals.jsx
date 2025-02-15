import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Plane } from 'lucide-react';

export const AwayModeButton = ({ isAway, onToggle, isLoading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const goingAwayMessages = [
    "Going away from flat?",
    "Not having food here?",
    "Mark as away to disable your account"
  ];

  const enableMessages = [
    "Back to flat?",
    "Ready to track meals again?",
    "Enable your account"
  ];

  const messages = isAway ? enableMessages : goingAwayMessages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAway, messages.length]);

  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`
        relative w-full py-4 group rounded-3xl font-medium
        backdrop-blur-xl transition-all duration-300 ease-in-out
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isAway 
          ? 'bg-neutral-800/80 hover:bg-neutral-700/80' 
          : 'bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/50'}
      `}
    >
      <div className="flex items-center justify-between px-6">
        <div className={`
          w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center
          group-hover:scale-110 transition-transform duration-300
          ${isAway ? 'bg-neutral-700/30' : 'bg-neutral-700/50'}
        `}>
          <Plane 
            className={`
              w-5 h-5 transition-all duration-300
              ${isAway ? 'rotate-45 text-neutral-300' : '-rotate-45 text-white'}
            `} 
          />
        </div>
        
        <div className="flex-1 relative h-6 overflow-hidden px-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`
                absolute w-full text-left transition-all duration-300 transform
                ${currentSlide === index 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'}
              `}
            >
              <span className={`text-sm ${isAway ? 'text-neutral-300' : 'text-white'}`}>
                {message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
};

export const FoodStatusModal = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  const { eatenUsers, notEatenUsers, awayUsers } = users.reduce(
    (acc, user) => {
      if (user.isAway) acc.awayUsers.push(user);
      else if (user.hasEaten) acc.eatenUsers.push(user);
      else acc.notEatenUsers.push(user);
      return acc;
    },
    { eatenUsers: [], notEatenUsers: [], awayUsers: [] }
  );

  const getCurrentMeal = () => {
    const hour = new Date().getHours();
    return hour >= 17 || hour < 7 ? 'Dinner' : 'Lunch';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900/90 backdrop-blur-xl rounded-3xl max-w-lg w-full mx-auto shadow-2xl border border-neutral-800/50 overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Food Status</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
          {notEatenUsers.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-red-400">Haven't Eaten Yet</h3>
              <div className="space-y-3">
                {notEatenUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 border border-neutral-700/50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-white">{user.name}</span>
                      <span className="text-sm text-neutral-400">
                        Missed {getCurrentMeal()} on {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {eatenUsers.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-emerald-400">Have Eaten</h3>
              <div className="space-y-3">
                {eatenUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-neutral-800/50 backdrop-blur-xl rounded-2xl p-4 border border-neutral-700/50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-white">{user.name}</span>
                      <span className="text-sm text-neutral-400">
                        {user.lastEatenAt ? new Date(user.lastEatenAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Time not recorded'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {awayUsers.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-400">Away</h3>
              <div className="space-y-3">
                {awayUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-neutral-800/30 backdrop-blur-xl rounded-2xl p-4 border border-neutral-700/30"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-neutral-400">{user.name}</span>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm">Away</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-neutral-800 text-white text-lg font-medium hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserRanking = ({ users }) => {
  const userRankings = users
    .filter(user => !user.isAway)
    .sort((a, b) => (b.missedMealsCount || 0) - (a.missedMealsCount || 0));

  const awayUsers = users.filter(user => user.isAway);

  return (
    <div className="bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-xl border-neutral-600/50 border-dashed  border-2 overflow-hidden">
      <div className="p-4 border-b border-neutral-700/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-neutral-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Missed Meals</h2>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {userRankings.length > 0 ? (
          <div className="space-y-3">
            {userRankings.map((user, index) => (
              <div
                key={user._id}
                className="bg-neutral-800/50 backdrop-blur-xl border-[1px] border-dashed rounded-2xl p-4  border-neutral-700/80 transition-all hover:bg-neutral-700/50"
              >
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center  text-lg font-bold ${
                      index === 0 ? 'bg-red-500/20 text-red-400' : 
                      index === 1 ? 'bg-orange-500/20 text-orange-400' : 
                      index === 2 ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-lg font-medium text-white">{user.name}</span>
                  </div>
                  <span className="text-neutral-400">
                    {user.missedMealsCount || 0} missed {user.missedMealsCount === 1 ? 'meal' : 'meals'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-8">
            No missed meals tracked yet
          </div>
        )}

        {awayUsers.length > 0 && (
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <h3 className="text-lg font-medium text-neutral-400">Away Users</h3>
            <div className="space-y-3">
              {awayUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-neutral-800/30 backdrop-blur-xl rounded-2xl p-4 border border-neutral-700/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-neutral-400">{user.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-700/30 flex items-center justify-center">
                        <Plane className="w-4 h-4 text-neutral-400" />
                      </div>
                      <span className="text-neutral-500">Away</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};