import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, ClipboardList, DoorOpen, Activity, ArrowRight,
  AlertCircle, CheckCircle, Clock, Zap
} from 'lucide-react';

const ACTIVITY = [
  { action: 'User Role Updated', user: 'Dr. Sarah Johnson', details: 'Changed to Department Head', time: '10 mins', type: 'user' },
  { action: 'Complaint Resolved', user: 'Maintenance Team A', details: 'AC repair completed – Room 205', time: '25 mins', type: 'success' },
  { action: 'Room Allocation Changed', user: 'Admin User', details: 'Lab A reassigned for CS401', time: '1 hour', type: 'info' },
  { action: 'System Alert', user: 'System', details: 'Database backup completed', time: '2 hours', type: 'system' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const urgencyColor = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-amber-400'
};

const activityIcon = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  user: <Users className="w-4 h-4 text-blue-500" />,
  info: <ArrowRight className="w-4 h-4 text-indigo-400" />,
  system: <Activity className="w-4 h-4 text-slate-400" />
};

export default function AdminDashboard({ onNavigate }) {
  const navigate = useNavigate();

  const [URGENT, setURGENT] = React.useState([]);
  const [ALL_COMPLAINTS, setALL_COMPLAINTS] = React.useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  React.useEffect(() => {

    const fetchURGENT = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/complaints/urgent`, { headers });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to load urgent complaints:', data);
          return;
        }

        setURGENT(data.complaints || []);
      } catch (error) {
        console.error('Error fetching urgent complaints:', error);
      }
    };

    const fetchAllComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/complaints/`, { headers });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to load all complaints:', data);
          return;
        }

        setALL_COMPLAINTS(data.complaints || []);
      } catch (error) {
        console.error('Error fetching all complaints:', error);
      }
    };

    fetchURGENT();
    fetchAllComplaints();

  }, []);

  // 📊 Stats based on urgent complaints
  const totalUrgent = URGENT.length;
  const criticalCount = URGENT.filter(i => i.priority === "critical").length;
  const highCount = URGENT.filter(i => i.priority === "high").length;
  const mediumCount = URGENT.filter(i => i.priority === "medium").length;

  const stats = [
    {
      label: 'Total Urgent',
      value: totalUrgent,
      icon: ClipboardList,
      color: 'blue',
      sub: totalUrgent ? `${totalUrgent} issues detected` : 'No urgent issues'
    },
    {
      label: 'Critical',
      value: criticalCount,
      icon: AlertCircle,
      color: 'red',
      sub: criticalCount ? `${criticalCount} critical` : 'All clear'
    },
    {
      label: 'High',
      value: highCount,
      icon: Zap,
      color: 'amber',
      sub: highCount ? `${highCount} high priority` : 'No high priority'
    },
    {
      label: 'Medium',
      value: mediumCount,
      icon: Clock,
      color: 'green',
      sub: mediumCount ? `${mediumCount} medium` : 'No medium issues'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">System overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">All systems operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 🧾 ALL COMPLAINTS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">All Complaints</h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {ALL_COMPLAINTS.length > 0 ? (
            ALL_COMPLAINTS.map((c) => (
              <div
                key={c._id || c.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-blue-500" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">
                    {c.category} • {c.created_at ? new Date(c.created_at).toLocaleString() : "Unknown"}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full border ${
                  c.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : c.status === 'pending'
                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {c.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">No complaints found</div>
          )}
        </div>
      </div>

 
    </div>
  );
}