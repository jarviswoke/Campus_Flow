import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// const STATS = [
//   { label: 'Total Complaints', value: '47', change: '+8 this week', icon: ClipboardList, color: 'blue' },
//   { label: 'Resolved', value: '32', change: '68% resolution rate', icon: CheckCircle, color: 'green' },
//   { label: 'In Progress', value: '12', change: 'Avg 1.5 days', icon: Clock, color: 'amber' },
//   { label: 'Pending', value: '3', change: 'Needs attention', icon: AlertCircle, color: 'red' },
// ];

// const URGENT = [
//   { id: 'CMP024591234', title: 'Air Conditioner not working', student: 'John Doe', location: 'Hostel Block A', priority: 'high', time: '2 hours ago' },
//   { id: 'CMP024587890', title: 'WiFi connectivity issue', student: 'Alice Smith', location: 'Computer Lab 1', priority: 'high', time: '5 hours ago' },
//   { id: 'CMP024583456', title: 'Projector not working', student: 'Bob Wilson', location: 'Room 201', priority: 'medium', time: '1 day ago' },
// ];



const SCHEDULE = [
  { time: '9:00 AM', subject: 'Data Structures', room: 'Room 201', students: 45 },
  { time: '11:00 AM', subject: 'Algorithms', room: 'Lab A', students: 30 },
  { time: '2:00 PM', subject: 'Database Systems', room: 'Room 101', students: 50 },
  { time: '4:00 PM', subject: 'Office Hours', room: 'Faculty Room', students: null },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const priorityCls = { high: 'bg-red-50 text-red-700 border-red-200', medium: 'bg-amber-50 text-amber-700 border-amber-200' };

export default function FacultyDashboard({  }) {
  
  const [facultyName, setFacultyName] = React.useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
  

  const navigate=useNavigate();

  React.useEffect(() => {
    const fetchUrgent = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/complaints/urgent`, { headers });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to load complaints:', data);
          return;
        }

        setURGENT(data.complaints || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchUrgent();
  }, []);


  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${BACKEND_URL}/api/complaints/stats`, { headers });
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to load stats:', data);
          return;
        }

        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFacultyName(decoded.full_name);
    }
  }, []);

  const [URGENT, setURGENT] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {facultyName}</p>
        </div>
        <button onClick={() => navigate('/faculty/complaints')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <ClipboardList className="w-4 h-4" /> View All Complaints
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && [
          {
            label: 'Total Complaints',
            value: stats.total,
            icon: ClipboardList,
            color: 'blue'
          },
          {
            label: 'Resolved',
            value: stats.resolved,
            icon: CheckCircle,
            color: 'green'
          },
          {
            label: 'In Progress',
            value: stats.open,
            icon: Clock,
            color: 'amber'
          },
          {
            label: 'Pending',
            value: stats.pending,
            icon: AlertCircle,
            color: 'red'
          }
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs text-slate-400 mt-1">{s.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Urgent Complaints */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Urgent Complaints</h2>
            <button onClick={() => navigate('/faculty/complaints')}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {URGENT.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.priority === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.student} · {c.location} · {c.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${priorityCls[c.priority]}`}>
                  {c.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">Today's Schedule</h2>
          </div>
          <div className="space-y-3">
            {SCHEDULE.map((s) => (
              <div key={s.time} className="flex gap-3">
                <div className="text-xs font-mono text-slate-400 w-16 shrink-0 pt-0.5">{s.time}</div>
                <div className="flex-1 p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                  <p className="text-sm font-semibold text-indigo-900">{s.subject}</p>
                  <p className="text-xs text-indigo-600 mt-0.5 flex items-center gap-1">
                    {s.room}
                    {s.students && <><span className="text-indigo-300">·</span><Users className="w-3 h-3" />{s.students}</>}
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
