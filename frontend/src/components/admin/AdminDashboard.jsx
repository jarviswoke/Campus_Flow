import { motion } from 'framer-motion';
import { Users, ClipboardList, DoorOpen, Activity, ArrowRight, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

const STATS = [
  { label: 'Total Users', value: '1,247', change: '+18 this week', icon: Users, color: 'blue', sub: 'Students: 1,156 · Faculty: 78' },
  { label: 'Active Complaints', value: '47', change: '15 pending action', icon: ClipboardList, color: 'amber', sub: 'Critical: 8 · High: 15' },
  { label: 'Room Occupancy', value: '73%', change: '124 rooms active', icon: DoorOpen, color: 'green', sub: 'Occupied: 124 · Available: 46' },
  { label: 'System Health', value: '98%', change: 'All systems operational', icon: Activity, color: 'purple', sub: 'Uptime: 99.9% · 120ms' },
];

const URGENT = [
  { priority: 'critical', title: 'Power outage in Hostel Block C', details: 'Affecting 150+ students', time: '15 mins ago', assigned: 'Not Assigned' },
  { priority: 'high', title: 'Timetable conflict – Room 205', details: 'CS301 and MA201 scheduled simultaneously', time: '1 hour ago', assigned: 'Admin Review' },
  { priority: 'medium', title: 'New faculty registration pending', details: 'Dr. Michael Chen – Computer Science', time: '2 hours ago', assigned: 'HR Department' },
];

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
};

const urgencyColor = { critical: 'bg-red-500', high: 'bg-orange-400', medium: 'bg-amber-400' };
const activityIcon = { success: <CheckCircle className="w-4 h-4 text-emerald-500" />, user: <Users className="w-4 h-4 text-blue-500" />, info: <ArrowRight className="w-4 h-4 text-indigo-400" />, system: <Activity className="w-4 h-4 text-slate-400" /> };

export default function AdminDashboard({ onNavigate }) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">System overview — Jan 24, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">All systems operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Manage Users', page: 'users', icon: Users, color: 'blue' },
          { label: 'Room Allocation', page: 'rooms', icon: DoorOpen, color: 'green' },
          { label: 'Analytics', page: 'analytics', icon: Activity, color: 'purple' },
          { label: 'Audit Logs', page: 'audit', icon: Zap, color: 'amber' },
        ].map((q) => {
          const Icon = q.icon;
          return (
            <button key={q.label} onClick={() => onNavigate(q.page)}
              className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                q.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                q.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                q.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Urgent + Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Urgent items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-semibold text-slate-900">Urgent Items</h2>
          </div>
          <div className="space-y-3">
            {URGENT.map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${urgencyColor[item.priority]}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>{item.time} ago</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {item.assigned}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
            <button onClick={() => onNavigate('audit')}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
              View audit log <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map((a) => (
              <div key={a.action + a.time} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcon[a.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{a.action}</p>
                  <p className="text-xs text-slate-500 truncate">{a.details}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.user} · {a.time} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
