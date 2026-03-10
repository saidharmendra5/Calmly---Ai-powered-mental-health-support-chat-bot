import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, UserPlus, Heart, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    healthScore: 100 // Default state
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_BASE}/api/users/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch profile information");

        const data = await response.json();

        setProfileData({
          name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          emergencyContactName: data.emergency_contact_name || "",
          emergencyContactPhone: data.emergency_contact_phone || "",
          healthScore: data.health_score ?? 100, // Handle the score from DB
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper to determine bar color based on score
  const getScoreColor = (score) => {
    if (score > 70) return 'bg-green-500';
    if (score > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">User Details</h1>
          <p className="text-gray-400 text-lg">Your personal information and wellness status</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* --- NEW: HEALTH SCORE SECTION --- */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Mental Wellness Score</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Current Status</span>
              <span className={`font-bold ${profileData.healthScore <= 30 ? 'text-red-400' : 'text-green-400'}`}>
                {profileData.healthScore}%
              </span>
            </div>

            {/* The Health Bar Container */}
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${getScoreColor(profileData.healthScore)}`}
                style={{ width: `${profileData.healthScore}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 italic">
              *This score is based on your recent interactions and helps us prioritize your support.
            </p>
          </div>
        </div>

        {/* --- EXISTING: PERSONAL INFO --- */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 mb-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-gray-400">{profileData.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={profileData.name} readOnly className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-80 cursor-default focus:outline-none" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={profileData.email} readOnly className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-80 cursor-default focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* --- EMERGENCY CONTACT --- */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Emergency Contact</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Contact Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={profileData.emergencyContactName} readOnly className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-80 cursor-default focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={profileData.emergencyContactPhone} readOnly className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white opacity-80 cursor-default focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;