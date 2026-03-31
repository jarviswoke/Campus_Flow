import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Bell, Shield } from 'lucide-react';

const STATS = [
  { label: 'Total Complaints', value: '12', icon: BookOpen, color: 'blue' },
  { label: 'Resolved', value: '8', icon: Award, color: 'green' },
  { label: 'Current Semester', value: '6th', icon: Calendar, color: 'purple' },
  { label: 'CGPA', value: '8.5', icon: Award, color: 'amber' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function Profile() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                SK
              </div>
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Suhani Kabra</h1>
                  <p className="text-slate-500 text-sm">Computer Science Engineering</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">ST2024001</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">Batch 2021–2025</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${colorMap[s.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Personal Information
          </h2>
          <div className="space-y-3">
            {[
              { icon: Mail, label: 'Email', value: 'suhani@gmail.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Address', value: 'Hostel Block A, Room 205' },
              { icon: Calendar, label: 'Date of Birth', value: 'March 15, 2003' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm text-slate-800 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Academic Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> Academic Information
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Department', value: 'Computer Science Engineering' },
              { label: 'Program', value: 'B.Tech' },
              { label: 'Enrollment Year', value: '2021' },
              { label: 'Expected Graduation', value: '2025' },
              { label: 'Roll Number', value: 'CSE21B001' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Email Notifications', desc: 'Complaint status updates', on: true },
              { label: 'SMS Alerts', desc: 'Critical updates via SMS', on: true },
              { label: 'Push Notifications', desc: 'Browser notifications', on: false },
              { label: 'Weekly Digest', desc: 'Summary every Monday', on: false },
            ].map(({ label, desc, on }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" /> Security
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Change Password</span>
              <span className="text-slate-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Two-Factor Authentication</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Disabled</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
              <span className="font-medium text-slate-800">Active Sessions</span>
              <span className="text-xs text-slate-400">2 devices</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
