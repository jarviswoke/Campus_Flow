import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, DoorOpen, Users, CheckCircle, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ROOMS = [
  { id: 1, name: 'Room 101', building: 'Main Building', capacity: 40, type: 'Classroom', status: 'occupied', assignedTo: 'CS301 – Data Structures', time: '9:00–11:00 AM', faculty: 'Dr. Sarah Johnson' },
  { id: 2, name: 'Lab A', building: 'Engineering Block', capacity: 30, type: 'Laboratory', status: 'available', assignedTo: null, time: null, faculty: null },
  { id: 3, name: 'Room 201', building: 'Science Block', capacity: 50, type: 'Classroom', status: 'occupied', assignedTo: 'MA201 – Mathematics', time: '10:00–12:00 PM', faculty: 'Prof. Kumar' },
  { id: 4, name: 'Computer Lab 1', building: 'IT Wing', capacity: 60, type: 'Computer Lab', status: 'maintenance', assignedTo: null, time: null, faculty: null },
  { id: 5, name: 'Seminar Hall', building: 'Main Building', capacity: 100, type: 'Seminar', status: 'available', assignedTo: null, time: null, faculty: null },
  { id: 6, name: 'Room 102', building: 'Main Building', capacity: 35, type: 'Classroom', status: 'available', assignedTo: null, time: null, faculty: null },
];

const statusConfig = {
  occupied: { label: 'Occupied', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  available: { label: 'Available', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  maintenance: { label: 'Maintenance', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
};

export default function RoomAllocation() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ROOMS.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.name.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || r.status === statusFilter)
    );
  });

  const stats = {
    total: ROOMS.length,
    available: ROOMS.filter((r) => r.status === 'available').length,
    occupied: ROOMS.filter((r) => r.status === 'occupied').length,
    maintenance: ROOMS.filter((r) => r.status === 'maintenance').length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room Allocation</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage room assignments and availability.</p>
        </div>
        <button onClick={() => toast.info('Room allocation form coming soon')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Allocate Room
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'slate' },
          { label: 'Available', value: stats.available, color: 'green' },
          { label: 'Occupied', value: stats.occupied, color: 'red' },
          { label: 'Maintenance', value: stats.maintenance, color: 'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
            <p className={`text-2xl font-bold ${
              color === 'green' ? 'text-emerald-600' :
              color === 'red' ? 'text-red-600' :
              color === 'amber' ? 'text-amber-600' :
              'text-slate-700'
            }`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rooms…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition" />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'occupied', 'maintenance'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room, i) => {
          const sc = statusConfig[room.status];
          return (
            <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{room.name}</p>
                    <p className="text-xs text-slate-400">{room.building}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.cls}`}>{sc.label}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.capacity} seats</span>
                <span>{room.type}</span>
              </div>

              {room.status === 'occupied' && (
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 mb-3">
                  <p className="font-medium text-slate-700">{room.assignedTo}</p>
                  <p className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{room.time}</p>
                  <p className="text-slate-500">{room.faculty}</p>
                </div>
              )}

              {room.status === 'available' && (
                <button onClick={() => toast.success(`Booking ${room.name}…`)}
                  className="w-full mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Allocate Room
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
