import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, ClipboardList, DoorOpen, BarChart3 } from 'lucide-react';

const COMPLAINT_TRENDS = [
  { month: 'Aug', total: 45, resolved: 38 },
  { month: 'Sep', total: 52, resolved: 44 },
  { month: 'Oct', total: 48, resolved: 42 },
  { month: 'Nov', total: 58, resolved: 50 },
  { month: 'Dec', total: 42, resolved: 38 },
  { month: 'Jan', total: 47, resolved: 32 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Hostel', count: 18, pct: 38, color: 'bg-red-400' },
  { name: 'Classroom', count: 14, pct: 30, color: 'bg-blue-400' },
  { name: 'IT', count: 8, pct: 17, color: 'bg-purple-400' },
  { name: 'Laboratory', count: 5, pct: 11, color: 'bg-emerald-400' },
  { name: 'Others', count: 2, pct: 4, color: 'bg-slate-300' },
];

const ROOM_UTIL = [
  { name: 'Classrooms', pct: 85, color: 'bg-blue-500' },
  { name: 'Labs', pct: 72, color: 'bg-purple-500' },
  { name: 'Auditoriums', pct: 45, color: 'bg-emerald-500' },
  { name: 'Seminar Halls', pct: 60, color: 'bg-amber-500' },
];

const KPI = [
  { label: 'Avg Resolution Time', value: '1.8 days', trend: 'down', note: '↓ 12% vs last month', icon: ClipboardList, color: 'blue' },
  { label: 'Student Satisfaction', value: '87%', trend: 'up', note: '↑ 5% vs last month', icon: TrendingUp, color: 'green' },
  { label: 'Room Utilization', value: '73%', trend: 'up', note: '↑ 3% vs last month', icon: DoorOpen, color: 'purple' },
  { label: 'Active Users (7d)', value: '892', trend: 'up', note: '↑ 18 vs last week', icon: Users, color: 'amber' },
];

const maxTotal = Math.max(...COMPLAINT_TRENDS.map((d) => d.total));

export default function SystemAnalytics() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">System Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Overview for Spring Semester 2026.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <BarChart3 className="w-4 h-4" /> Data updated in real-time
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                k.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                k.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                k.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{k.value}</p>
              <p className="text-xs text-slate-500 mb-1">{k.label}</p>
              <p className={`text-xs font-medium flex items-center gap-1 ${k.trend === 'up' ? 'text-emerald-600' : 'text-blue-600'}`}>
                {k.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.note}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Complaint trend bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Complaint Trends (6 months)</h2>
          <div className="flex items-end gap-3 h-40">
            {COMPLAINT_TRENDS.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col-reverse items-center gap-0.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.total / maxTotal) * 128}px` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.resolved / d.total) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg"
                    />
                  </motion.div>
                </div>
                <p className="text-xs text-slate-400">{d.month}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded bg-blue-100" /> Total
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded bg-blue-500" /> Resolved
            </div>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Complaints by Category</h2>
          <div className="space-y-4">
            {CATEGORY_DISTRIBUTION.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="text-slate-400">{c.count} · {c.pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className={`h-full rounded-full ${c.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room utilization */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-5">Room Utilization by Type</h2>
        <div className="grid sm:grid-cols-4 gap-5">
          {ROOM_UTIL.map((r) => (
            <div key={r.name} className="text-center">
              {/* Circular progress */}
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={r.color === 'bg-blue-500' ? '#3b82f6' : r.color === 'bg-purple-500' ? '#8b5cf6' : r.color === 'bg-emerald-500' ? '#10b981' : '#f59e0b'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - r.pct }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-900">{r.pct}%</span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-700">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
