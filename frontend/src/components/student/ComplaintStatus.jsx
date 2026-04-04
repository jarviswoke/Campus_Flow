import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, Clock, AlertCircle, XCircle,
  MapPin, User, FileText, ChevronDown, ChevronUp, Calendar,
} from 'lucide-react';

// const COMPLAINTS = [
//   {
//     id: 'CMP024591234', title: 'Air Conditioner not working in Room 205',
//     category: 'Hostel', location: 'Hostel Block A - Room 205',
//     description: 'The AC unit has stopped cooling. Room temperature is very high.',
//     status: 'in-progress', priority: 'high',
//     submittedDate: 'Jan 24, 2026 11:30 AM', lastUpdated: 'Jan 24, 2026 2:15 PM',
//     assignedTo: 'Maintenance Team A', estimatedResolution: 'Jan 25, 2026',
//     timeline: [
//       { stage: 'Submitted', description: 'Complaint registered', date: 'Jan 24, 11:30 AM', completed: true },
//       { stage: 'Acknowledged', description: 'Assigned to maintenance team', date: 'Jan 24, 12:00 PM', completed: true },
//       { stage: 'In Progress', description: 'Technician dispatched', date: 'Jan 24, 2:15 PM', completed: true },
//       { stage: 'Resolution', description: 'Awaiting completion', date: 'Pending', completed: false },
//     ],
//   },
//   {
//     id: 'CMP024589012', title: 'Broken chair in Classroom 101',
//     category: 'Classroom', location: 'Main Building - Room 101',
//     description: 'One of the chairs has a broken leg and is unsafe to use.',
//     status: 'resolved', priority: 'medium',
//     submittedDate: 'Jan 23, 2026 9:00 AM', lastUpdated: 'Jan 23, 2026 4:30 PM',
//     assignedTo: 'Furniture Maintenance',
//     timeline: [
//       { stage: 'Submitted', description: 'Complaint registered', date: 'Jan 23, 9:00 AM', completed: true },
//       { stage: 'Acknowledged', description: 'Verified by admin', date: 'Jan 23, 9:30 AM', completed: true },
//       { stage: 'In Progress', description: 'Replacement ordered', date: 'Jan 23, 10:00 AM', completed: true },
//       { stage: 'Resolved', description: 'Chair replaced', date: 'Jan 23, 4:30 PM', completed: true },
//     ],
//   },
//   {
//     id: 'CMP024587890', title: 'WiFi connectivity issue in Computer Lab',
//     category: 'IT', location: 'Computer Lab 1 - IT Wing',
//     description: 'Intermittent WiFi disconnections affecting multiple workstations.',
//     status: 'pending', priority: 'high',
//     submittedDate: 'Jan 22, 2026 3:00 PM', lastUpdated: 'Jan 22, 2026 3:00 PM',
//     assignedTo: 'Not Assigned',
//     timeline: [
//       { stage: 'Submitted', description: 'Complaint registered', date: 'Jan 22, 3:00 PM', completed: true },
//       { stage: 'Acknowledged', description: 'Pending review', date: 'Pending', completed: false },
//       { stage: 'In Progress', description: '', date: '', completed: false },
//       { stage: 'Resolution', description: '', date: '', completed: false },
//     ],
//   },
// ];

const statusConfig = {
  'in-progress': { label: 'In Progress', icon: Clock, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved: { label: 'Resolved', icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pending', icon: AlertCircle, cls: 'bg-slate-50 text-slate-600 border-slate-200' },
  rejected: { label: 'Rejected', icon: XCircle, cls: 'bg-red-50 text-red-700 border-red-200' },
};

const priorityCls = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function ComplaintStatus() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view complaints');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/complaints/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to fetch complaints');
          return;
        }

        const transformed = (data.complaints || []).map((complaint) => ({
          id: complaint.complaint_id,
          title: complaint.title,
          category: complaint.category,
          location: complaint.category,
          description: complaint.description,
          status: complaint.status === 'open' ? 'pending' : complaint.status,
          priority: complaint.priority || 'medium',
          submittedDate: complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'Unknown',
          lastUpdated: complaint.updated_at ? new Date(complaint.updated_at).toLocaleString() : 'Unknown',
          assignedTo: 'Not Assigned',
          timeline: [
            {
              stage: 'Submitted',
              description: 'Complaint registered',
              date: complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'Unknown',
              completed: true,
            },
            {
              stage: complaint.status === 'resolved' ? 'Resolved' : 'In Progress',
              description: complaint.status === 'resolved' ? 'Complaint resolved' : 'Being processed',
              date: complaint.status === 'resolved' && complaint.updated_at ? new Date(complaint.updated_at).toLocaleString() : 'Pending',
              completed: complaint.status === 'resolved',
            },
          ],
        }));

        setComplaints(transformed);
      } catch (fetchError) {
        console.error('Error fetching complaints:', fetchError);
        setError(fetchError.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-5">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          <p className="text-slate-500 mt-4">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-5">
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="text-slate-500 mt-2">Please login or refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Complaints</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track the status of all your submitted complaints.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or ID…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'in-progress', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                filter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const sc = statusConfig[c.status];
          const StatusIcon = sc.icon;
          const isOpen = expanded === c.id;

          return (
            <motion.div
              key={c.id}
              layout
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${sc.cls}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 font-mono">{c.id} · {c.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden sm:inline text-xs font-medium px-2.5 py-1 rounded-full border ${sc.cls}`}>
                    {sc.label}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityCls[c.priority]}`}>
                    {c.priority}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 border-t border-slate-100 pt-4 space-y-4">
                      {/* Meta */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          {c.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          {c.assignedTo}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          Submitted: {c.submittedDate}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          Updated: {c.lastUpdated}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p>{c.description}</p>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-3">Progress Timeline</p>
                        <div className="flex items-start gap-0">
                          {c.timeline.map((t, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                              <div className="flex items-center w-full">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                  t.completed ? 'bg-blue-600' : 'bg-slate-200'
                                }`}>
                                  {t.completed
                                    ? <CheckCircle className="w-4 h-4 text-white" />
                                    : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                </div>
                                {i < c.timeline.length - 1 && (
                                  <div className={`flex-1 h-0.5 ${t.completed ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                )}
                              </div>
                              <p className={`text-xs mt-1.5 text-center ${t.completed ? 'text-blue-700 font-medium' : 'text-slate-400'}`}>
                                {t.stage}
                              </p>
                              {t.date && (
                                <p className="text-xs text-slate-400 text-center leading-tight">{t.date}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No complaints found</p>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
