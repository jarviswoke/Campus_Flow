import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Activity, CheckCircle, AlertCircle, Edit, Trash2, Shield, FileText, User } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'LOG001', timestamp: '2026-01-24 14:32:15', user: 'Admin User', userId: 'ADM001', role: 'admin', action: 'User Role Updated', category: 'user', details: 'Changed Dr. Sarah Johnson role from Faculty to Department Head', ip: '192.168.1.100', status: 'success' },
  { id: 'LOG002', timestamp: '2026-01-24 14:15:42', user: 'Admin User', userId: 'ADM001', role: 'admin', action: 'Room Allocated', category: 'room', details: 'Allocated Lab A to CS401 – Artificial Intelligence', ip: '192.168.1.100', status: 'success' },
  { id: 'LOG003', timestamp: '2026-01-24 13:45:23', user: 'Dr. Sarah Johnson', userId: 'FC2024001', role: 'faculty', action: 'Complaint Status Updated', category: 'complaint', details: 'Updated CMP024591234 status to In Progress', ip: '192.168.1.105', status: 'success' },
  { id: 'LOG004', timestamp: '2026-01-24 12:30:11', user: 'System', userId: 'SYS', role: 'admin', action: 'Backup Completed', category: 'system', details: 'Automated database backup completed successfully', ip: 'localhost', status: 'success' },
  { id: 'LOG005', timestamp: '2026-01-24 11:20:44', user: 'John Doe', userId: 'ST2024001', role: 'student', action: 'Login Failed', category: 'user', details: 'Failed login attempt – incorrect password', ip: '192.168.2.45', status: 'failed' },
  { id: 'LOG006', timestamp: '2026-01-24 10:55:02', user: 'Admin User', userId: 'ADM001', role: 'admin', action: 'User Deleted', category: 'user', details: 'Removed inactive account SF2023099', ip: '192.168.1.100', status: 'warning' },
  { id: 'LOG007', timestamp: '2026-01-24 10:22:19', user: 'Admin User', userId: 'ADM001', role: 'admin', action: 'Timetable Uploaded', category: 'timetable', details: 'Spring 2026 timetable uploaded for CS Department', ip: '192.168.1.100', status: 'success' },
];

const statusConfig = {
  success: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  failed: { cls: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  warning: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
};

const categoryIcon = { user: User, complaint: FileText, room: Shield, timetable: Edit, system: Activity };
const categoryColor = {
  user: 'bg-blue-50 text-blue-600',
  complaint: 'bg-purple-50 text-purple-600',
  room: 'bg-emerald-50 text-emerald-600',
  timetable: 'bg-amber-50 text-amber-600',
  system: 'bg-slate-100 text-slate-500',
};

const roleConfig = {
  admin: 'bg-purple-50 text-purple-700',
  faculty: 'bg-indigo-50 text-indigo-700',
  student: 'bg-blue-50 text-blue-700',
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = AUDIT_LOGS.filter((log) => {
    const q = search.toLowerCase();
    return (
      (log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.details.toLowerCase().includes(q)) &&
      (categoryFilter === 'all' || log.category === categoryFilter)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Complete trail of all system activities.</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'user', 'complaint', 'room', 'timetable', 'system'].map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                categoryFilter === c ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Log list */}
      <div className="space-y-2">
        {filtered.map((log, i) => {
          const sc = statusConfig[log.status];
          const StatusIcon = sc.icon;
          const CatIcon = categoryIcon[log.category] || FileText;
          return (
            <motion.div key={log.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${categoryColor[log.category]}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.cls}`}>
                      {log.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleConfig[log.role] || 'bg-slate-50 text-slate-600'}`}>
                      {log.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">{log.details}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.user} ({log.userId})</span>
                    <span className="font-mono">{log.ip}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
