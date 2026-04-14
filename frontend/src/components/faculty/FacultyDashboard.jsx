import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, CheckCircle, Clock, AlertCircle,
  Search, User, MapPin, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const statusConfig = {
  open: { label: 'In Progress', icon: Clock, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pending', icon: AlertCircle, cls: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const priorityCls = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = React.useState('');
  const [complaints, setComplaints] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [stats, setStats] = React.useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // 🔹 Fetch complaints + stats
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const fetchComplaints = async () => {
      const res = await fetch(`${BACKEND_URL}/api/complaints/`, { headers });
      const data = await res.json();
      if (res.ok) setComplaints(data.complaints || []);
    };

    const fetchStats = async () => {
      const res = await fetch(`${BACKEND_URL}/api/complaints/stats`, { headers });
      const data = await res.json();
      if (res.ok) setStats(data);
    };

    fetchComplaints();
    fetchStats();
  }, []);

  // 🔹 Decode name
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFacultyName(decoded.full_name);
    }
  }, []);

  // 🔹 Filtering logic (same as manage page)
  React.useEffect(() => {
    const q = search.toLowerCase();

    const result = complaints.filter((c) => {
      return (
        (c.title?.toLowerCase().includes(q) ||
          String(c.id).includes(q) ||
          c.student?.toLowerCase().includes(q)) &&
        (statusFilter === 'all' || c.status === statusFilter)
      );
    });

    setFiltered(result);
  }, [complaints, search, statusFilter]);

  // 🔹 Update status (same as manage page)
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${BACKEND_URL}/api/complaints/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to update');
        return;
      }

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );

      toast.success('Status updated');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, {facultyName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && [
          { label: 'Total Complaints', value: stats.total, icon: ClipboardList, color: 'blue' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'green' },
          { label: 'In Progress', value: stats.open, icon: Clock, color: 'amber' },
          { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'red' }
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 " />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'open', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs border ${
                statusFilter === s ? 'bg-indigo-600 text-white  border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List (SAME AS MANAGE PAGE) */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const sc = statusConfig[c.status] || statusConfig['pending'];
          const StatusIcon = sc.icon;

          return (
            <motion.div key={c.id}
              className="bg-white rounded-2xl border p-4"
            >
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sc.cls}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.id} · {c.category}</p>

                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span><User className="w-3 h-3 inline" /> {c.student}</span>
                    <span><MapPin className="w-3 h-3 inline" /> {c.location}</span>
                  </div>

                  <p className="text-sm mt-2">{c.description}</p>
                </div>

                {/* Status dropdown */}
                <div className="shrink-0">
                                  <div className="relative">
                                    <select
                                      value={c.status}
                                      onChange={(e) => updateStatus(c.id, e.target.value)}
                                      className="appearance-none pr-7 pl-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="open">In Progress</option>
                                      <option value="resolved">Resolved</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                  </div>
                                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}