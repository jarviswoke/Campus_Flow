import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, MessageSquare, MapPin, User, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const COMPLAINTS = [
  { id: 'CMP024591234', title: 'Air Conditioner not working', student: 'John Doe (ST2024001)', location: 'Hostel Block A - Room 205', category: 'Hostel', status: 'in-progress', priority: 'high', date: 'Jan 24, 2026', description: 'The AC unit has stopped cooling entirely. Room temperature is very high making it unbearable.' },
  { id: 'CMP024587890', title: 'WiFi connectivity issue', student: 'Alice Smith (ST2024002)', location: 'Computer Lab 1 - IT Wing', category: 'IT', status: 'pending', priority: 'high', date: 'Jan 22, 2026', description: 'Intermittent WiFi disconnections affecting multiple workstations.' },
  { id: 'CMP024583456', title: 'Projector not working', student: 'Bob Wilson (ST2024003)', location: 'Room 201 - Science Block', category: 'Classroom', status: 'pending', priority: 'medium', date: 'Jan 21, 2026', description: 'Projector bulb appears to have burned out. Cannot display lecture slides.' },
  { id: 'CMP024579012', title: 'Broken chair in lab', student: 'Carol Davis (ST2024004)', location: 'Lab A - Engineering Block', category: 'Laboratory', status: 'resolved', priority: 'low', date: 'Jan 20, 2026', description: 'One chair has a broken backrest and is unsafe.' },
  { id: 'CMP024575678', title: 'Leaking water pipe', student: 'David Lee (ST2024005)', location: 'Hostel Block B - Room 102', category: 'Hostel', status: 'in-progress', priority: 'high', date: 'Jan 19, 2026', description: 'Water is leaking from the pipe under the sink, causing water damage.' },
];

const statusConfig = {
  'in-progress': { label: 'In Progress', icon: Clock, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pending', icon: AlertCircle, cls: 'bg-slate-50 text-slate-600 border-slate-200' },
};

const priorityCls = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function FacultyComplaints() {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.title.toLowerCase().includes(q) || c.id.includes(q) || c.student.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || c.status === statusFilter)
    );
  });

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Complaint status updated to ${newStatus}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Complaint Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">Review and update student complaints assigned to your department.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'in-progress', 'resolved'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}>
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table / cards */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const sc = statusConfig[c.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={c.id} layout
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${sc.cls}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityCls[c.priority]}`}>{c.priority}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-2">{c.id} · {c.category} · {c.date}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.student}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                  </div>
                  <p className="text-sm text-slate-600">{c.description}</p>
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
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
}
