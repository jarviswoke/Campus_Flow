import { motion } from "framer-motion";
import {
  MessageSquare, CheckCircle, Clock, AlertCircle,
  TrendingUp, Bell, DoorOpen, ArrowRight, Calendar,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import ComplaintForm from '../student/ComplaintForm';

const STATS = [
  { label: 'Total Complaints', value: '12', change: '+2 this week', icon: MessageSquare, color: 'blue' },
  { label: 'Resolved', value: '8', change: '66% resolution rate', icon: CheckCircle, color: 'green' },
  { label: 'In Progress', value: '3', change: 'Avg 2 days', icon: Clock, color: 'amber' },
  { label: 'Pending', value: '1', change: 'Within SLA', icon: AlertCircle, color: 'red' },
];

const RECENT = [
  { id: 'CMP024591234', title: 'Air Conditioner not working', category: 'Hostel', status: 'in-progress', date: '2 hours ago', priority: 'high' },
  { id: 'CMP024589012', title: 'Broken chair in classroom', category: 'Classroom', status: 'resolved', date: '1 day ago', priority: 'medium' },
  { id: 'CMP024587890', title: 'WiFi connectivity issue', category: 'IT', status: 'in-progress', date: '2 days ago', priority: 'high' },
];

const ANNOUNCEMENTS = [
  { title: 'Hostel Maintenance Schedule', desc: 'Scheduled maintenance in Block A on Jan 28', date: 'Today', type: 'info' },
  { title: 'New Lab Equipment Installed', desc: 'Engineering Lab B now has updated equipment', date: 'Yesterday', type: 'success' },
  { title: 'Campus WiFi Upgrade', desc: 'Network upgrade scheduled for this weekend', date: '2 days ago', type: 'warning' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const statusStyles = {
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-slate-50 text-slate-600 border-slate-200',
};

const announcementDot = { info: 'bg-blue-500', success: 'bg-emerald-500', warning: 'bg-amber-500' };

export default function Dashboard({ }) {
  const navigate=useNavigate();

  return (
    
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning, John 👋</h1>
            <p className="text-slate-500 mt-0.5">Here's what's happening with your complaints today.</p>
          </div>
          <button
            onClick={() => navigate('/complaint')}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            New Complaint
          </button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[s.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom two-col */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent complaints */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Complaints</h2>
            <button
              onClick={() => onNavigate('status')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {RECENT.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.category} • {c.date}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[c.status]}`}>
                  {c.status === 'in-progress' ? 'In Progress' : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">Announcements</h2>
          </div>
          <div className="space-y-4">
            {ANNOUNCEMENTS.map((a) => (
              <div key={a.title} className="flex gap-3">
                <div className="mt-1.5 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${announcementDot[a.type]}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {a.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
