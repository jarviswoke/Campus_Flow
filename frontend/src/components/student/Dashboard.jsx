import React from 'react';
import { motion } from "framer-motion";
import {
  MessageSquare, CheckCircle, Clock, AlertCircle,
  TrendingUp, ArrowRight
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const STAT_CONFIG = [
  { label: 'Total Complaints', key: 'total', icon: MessageSquare, color: 'blue' },
  { label: 'Resolved', key: 'resolved', icon: CheckCircle, color: 'green' },
  { label: 'Open', key: 'open', icon: Clock, color: 'amber' },
  { label: 'Pending', key: 'pending', icon: AlertCircle, color: 'red' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const statusStyles = {
  open: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-slate-50 text-slate-600 border-slate-200',
};

const statusLabels = {
  open: 'Open',
  pending: 'Pending',
  resolved: 'Resolved',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [RECENT, setRECENT] = React.useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // 📊 Stats calculation
  const totalComplaints = RECENT.length;
  const resolvedCount = RECENT.filter((c) => c.status === 'resolved').length;
  const openCount = RECENT.filter((c) => c.status === 'open').length;
  const pendingCount = RECENT.filter((c) => c.status === 'pending').length;
  const resolutionRate = totalComplaints
    ? Math.round((resolvedCount / totalComplaints) * 100)
    : 0;

  const stats = STAT_CONFIG.map((item) => {
    let value = 0;
    let change = '';

    if (item.key === 'total') {
      value = totalComplaints;
      change = totalComplaints ? `${totalComplaints} logged` : 'No complaints yet';
    } else if (item.key === 'resolved') {
      value = resolvedCount;
      change = totalComplaints ? `${resolutionRate}% resolution rate` : 'No complaints yet';
    } else if (item.key === 'open') {
      value = openCount;
      change = openCount ? `${openCount} open` : 'All caught up';
    } else if (item.key === 'pending') {
      value = pendingCount;
      change = pendingCount ? `${pendingCount} pending` : 'No pending items';
    }

    return { ...item, value, change };
  });

  // 🔗 Backend integration (UNCHANGED)
  React.useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/complaints/`, { headers });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to load complaints:', data);
          return;
        }

        setRECENT(data.complaints || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <p className="text-slate-500">
            Here's what's happening with your complaints today.
          </p>

          <button
            onClick={() => navigate('/complaint')}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            <MessageSquare className="w-4 h-4" />
            New Complaint
          </button>
        </div>
      </motion.div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[s.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 🧾 ALL COMPLAINTS LIST */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">All Complaints</h2>

          <button
            onClick={() => navigate('/status')}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View detailed <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {RECENT.length > 0 ? (
            RECENT.map((c) => (
              <div
                key={c._id || c.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {c.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {c.category} •{" "}
                    {c.created_at
                      ? new Date(c.created_at).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[c.status]}`}>
                  {statusLabels[c.status] ||
                    c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              No complaints yet
            </div>
          )}
        </div>
      </div>

    </div>
  );
}