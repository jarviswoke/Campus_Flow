import { useState, useEffect } from 'react';
import { Home, DoorOpen, MessageSquare, List, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'rooms', label: 'Vacant Rooms', icon: DoorOpen },
  { id: 'complaint', label: 'Register Complaint', icon: MessageSquare },
  { id: 'status', label: 'My Complaints', icon: List },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Navigation({ activeTab = 'dashboard' }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user || null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'US';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Campus Flow</p>
            <p className="text-xs text-blue-600 font-medium">Student Portal</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = id === activeTab;
            return (
              <button
                key={id}
                onClick={() => navigate(`/${id}`)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : ''}`} />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* User chip + Logout */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.full_name || 'Student'}</p>
            <p className="text-xs text-slate-400 font-mono">{user?.college_id || 'N/A'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow">
            {initials}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
