import { LayoutDashboard, Users, ClipboardList, DoorOpen, BarChart3, FileText, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: DoorOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
];

export default function AdminNavigation({ activeTab = 'dashboard', onNavigate }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white leading-tight">Campus Flow</p>
              <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">ADMIN</span>
            </div>
            <p className="text-xs text-emerald-200">Control Panel</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = id === activeTab;
            return (
              <button key={id} onClick={() => onNavigate?.(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-white/20 text-white backdrop-blur-sm' : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight">Admin User</p>
            <p className="text-xs text-emerald-200">System Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-emerald-300 flex items-center justify-center text-white text-sm font-bold">
            AD
          </div>
        </div>
      </div>
    </nav>
  );
}
