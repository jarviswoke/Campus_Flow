import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, Edit, Trash2, Shield, Mail, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const USERS = [
  { id: 'ST2024001', name: 'John Doe', email: 'john.doe@university.edu', role: 'student', department: 'Computer Science', status: 'active', joinDate: '2024-01-15', lastActive: '2 hours ago' },
  { id: 'FC2024001', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'faculty', department: 'Computer Science', status: 'active', joinDate: '2020-08-01', lastActive: '1 hour ago' },
  { id: 'ST2024002', name: 'Alice Smith', email: 'alice.smith@university.edu', role: 'student', department: 'Electrical Engineering', status: 'active', joinDate: '2024-01-15', lastActive: '5 hours ago' },
  { id: 'SF2024001', name: 'Michael Brown', email: 'michael.brown@university.edu', role: 'staff', department: 'Maintenance', status: 'active', joinDate: '2023-05-10', lastActive: '30 mins ago' },
  { id: 'ST2024003', name: 'Carol Davis', email: 'carol.davis@university.edu', role: 'student', department: 'Mechanical Engineering', status: 'inactive', joinDate: '2024-01-15', lastActive: '1 week ago' },
  { id: 'FC2024002', name: 'Prof. Robert Chen', email: 'robert.chen@university.edu', role: 'faculty', department: 'Physics', status: 'active', joinDate: '2019-07-15', lastActive: '3 hours ago' },
];

const roleConfig = {
  student: 'bg-blue-50 text-blue-700 border-blue-200',
  faculty: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  staff: 'bg-amber-50 text-amber-700 border-amber-200',
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
};

const statusConfig = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-50 text-slate-500 border-slate-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
};

export default function UserManagement() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter)
    );
  });

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('User removed successfully');
  };

  const initials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColor = (role) => role === 'student' ? 'bg-blue-100 text-blue-700' : role === 'faculty' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} total users in the system.</p>
        </div>
        <button onClick={() => toast.info('Add user form coming soon')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition" />
        </div>
        <div className="flex gap-2">
          {['all', 'student', 'faculty', 'staff', 'admin'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                roleFilter === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-xs font-semibold text-slate-500 text-left px-5 py-3">User</th>
              <th className="text-xs font-semibold text-slate-500 text-left px-4 py-3 hidden md:table-cell">ID</th>
              <th className="text-xs font-semibold text-slate-500 text-left px-4 py-3 hidden sm:table-cell">Department</th>
              <th className="text-xs font-semibold text-slate-500 text-left px-4 py-3">Role</th>
              <th className="text-xs font-semibold text-slate-500 text-left px-4 py-3">Status</th>
              <th className="text-xs font-semibold text-slate-500 text-left px-4 py-3 hidden lg:table-cell">Last Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <motion.tr key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(user.role)}`}>
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-mono text-slate-500">{user.id}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-slate-600">{user.department}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleConfig[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-slate-400">{user.lastActive}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => toast.info(`Editing ${user.name}`)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteUser(user.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
