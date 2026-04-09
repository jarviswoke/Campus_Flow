import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Bell, Shield } from 'lucide-react';

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, { headers });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Unable to load profile');
          return;
        }

        setProfile(data.user || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center text-slate-500">Loading profile...</div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center text-red-600">{error}</div>
    );
  }

  const initials = profile?.full_name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'ST';
  const stats = [
    { label: 'College ID', value: profile?.college_id || 'N/A', icon: BookOpen, color: 'blue' },
    { label: 'Department', value: profile?.department || 'N/A', icon: Award, color: 'green' },
    { label: 'Year / Semester', value: profile?.year_semester || 'N/A', icon: Calendar, color: 'purple' },
    { label: 'Status', value: profile?.is_active ? 'Active' : 'Inactive', icon: Shield, color: 'amber' },
  ];

  const personalInfo = [
    { icon: Mail, label: 'Email', value: profile?.email || 'Not provided' },
    { icon: Phone, label: 'Phone', value: profile?.mobile || 'Not provided' },
    { icon: MapPin, label: 'Department', value: profile?.department || 'Not provided' },
    { icon: Calendar, label: 'Year / Semester', value: profile?.year_semester || 'Not provided' },
  ];

  const academicInfo = [
    { label: 'College ID', value: profile?.college_id || 'N/A' },
    { label: 'User Type', value: profile?.user_type || 'N/A' },
    { label: 'Verified', value: profile?.is_verified ? 'Yes' : 'No' },
    { label: 'Joined', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A' },
    { label: 'Bio', value: profile?.bio || 'No bio available' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile?.full_name || 'Student'}</h1>
                  <p className="text-slate-500 text-sm">{profile?.department || 'Department not set'}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{profile?.college_id || 'N/A'}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{profile?.year_semester || 'Year/Semester not set'}</span>
                    <span className={`text-xs ${profile?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} font-medium px-2 py-0.5 rounded-full`}>{profile?.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${colorMap[s.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Personal Information
          </h2>
          <div className="space-y-3">
            {personalInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm text-slate-800 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Academic Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> Academic Information
          </h2>
          <div className="space-y-3">
            {academicInfo.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Email Notifications', desc: 'Complaint status updates', on: true },
              { label: 'SMS Alerts', desc: 'Critical updates via SMS', on: true },
              { label: 'Push Notifications', desc: 'Browser notifications', on: false },
              { label: 'Weekly Digest', desc: 'Summary every Monday', on: false },
            ].map(({ label, desc, on }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" /> Security
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Change Password</span>
              <span className="text-slate-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Two-Factor Authentication</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Disabled</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Active Sessions</span>
              <span className="text-xs text-slate-400">2 devices</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
