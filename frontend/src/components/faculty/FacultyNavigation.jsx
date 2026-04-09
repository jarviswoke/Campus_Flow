import { LayoutDashboard, ClipboardList, CalendarDays, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { jwtDecode } from 'jwt-decode';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'complaints', label: 'Manage Complaints', icon: ClipboardList },
  { id: 'timetable', label: 'My Timetable', icon: CalendarDays },
];

export default function FacultyNavigation({ activeTab = 'dashboard' }) {
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = React.useState('');
  const [facultyDepartment, setFacultyDepartment] = React.useState('');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFacultyName(decoded.full_name);
      setFacultyDepartment(decoded.department)
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-700 border-b border-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">Campus Flow</p>
            <p className="text-xs text-indigo-200">Faculty Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = id === activeTab;
            return (
              <button key={id}
                onClick={() => navigate(id === 'dashboard' ? '/faculty' : `/faculty/${id}`)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-white/20 text-white backdrop-blur-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight">{facultyName}</p>
            <p className="text-xs text-indigo-200">{facultyDepartment}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-indigo-300 flex items-center justify-center text-white text-sm font-bold">
            FAC
          </div>
          <button onClick={handleLogout} title="Logout"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-100 hover:bg-white/10 hover:text-white transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}