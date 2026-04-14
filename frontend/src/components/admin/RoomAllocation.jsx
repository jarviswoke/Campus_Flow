import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, DoorOpen, Users, CheckCircle, Clock, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const statusConfig = {
  occupied: { label: 'Occupied', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
  available: { label: 'Available', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  maintenance: { label: 'Maintenance', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
};

export default function RoomAllocation() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);

        const res = await fetch(`${BACKEND_URL}/api/rooms/?${params}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rooms');
        setRooms(data.rooms || []);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [statusFilter]);

  const filtered = rooms.filter((r) => {
    const q = search.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.building?.toLowerCase().includes(q);
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room Allocation</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage room assignments and availability.</p>
        </div>
       {/* <button
          onClick={() => toast.info('Room allocation form coming soon')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Allocate Room
        </button> */}
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
              color === 'amber' ? 'text-amber-600' : 'text-slate-700'
            }`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'occupied', 'maintenance'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading rooms…</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room, i) => {
            const sc = statusConfig[room.status] || statusConfig.available;
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
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
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.cls}`}>
                    {sc.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {room.capacity} seats
                  </span>
                  <span>{room.room_type}</span>
                </div>

                {room.status === 'occupied' && (
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 mb-3">
                    <p className="font-medium text-slate-700">{room.assigned_to || 'Assigned'}</p>
                    {room.time_slot && (
                      <p className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{room.time_slot}
                      </p>
                    )}
                    {room.assigned_faculty && (
                      <p className="text-slate-500">{room.assigned_faculty}</p>
                    )}
                  </div>
                )}

             {/*   {room.status === 'available' && (
                  <button
                    onClick={() => toast.success(`Booking ${room.name}…`)}
                    className="w-full mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Allocate Room
                  </button>
                )} */}
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <DoorOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No rooms found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}