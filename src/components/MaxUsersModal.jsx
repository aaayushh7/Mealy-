import React, { useEffect } from 'react';
import { Home, X } from 'lucide-react';

export const MaxUsersModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    console.log('Modal isOpen:', isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <Home className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">House Full!</h2>
          <p className="text-gray-300 mb-6">
            W-306 is at full capacity with all 5 flatmates registered. Please contact current residents if you believe this is a mistake.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-500"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};