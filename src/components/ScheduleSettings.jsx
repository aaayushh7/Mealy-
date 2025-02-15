import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

function ScheduleSettings({ user }) {
  const [schedule, setSchedule] = useState({
    lunchTime: '12:00',
    dinnerTime: '19:00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('https://w-306-mealy-server.vercel.app/api/schedule', {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` }
        });
        setSchedule(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('https://w-306-mealy-server.vercel.app/api/schedule', schedule, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }
      });
      alert('Schedule updated successfully!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Meal Schedule Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunch Time
            </label>
            <input
              type="time"
              name="lunchTime"
              value={schedule.lunchTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dinner Time
            </label>
            <input
              type="time"
              name="dinnerTime"
              value={schedule.dinnerTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleSettings;