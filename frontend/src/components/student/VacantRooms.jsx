import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, Wifi, Monitor, AirVent, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

const amenityIcon = (a) => {
  if (a === 'WiFi') return <Wifi className="w-3 h-3" />;
  if (a === 'AC') return <AirVent className="w-3 h-3" />;
  if (a.includes('omputer') || a === 'Projector' || a === 'Smart Board') return <Monitor className="w-3 h-3" />;
  if (a === 'Quiet Zone' || a.includes('Library')) return <BookOpen className="w-3 h-3" />;
  return null;
};

const typeColor = {
  Classroom: 'bg-blue-50 text-blue-700',
  Laboratory: 'bg-purple-50 text-purple-700',
  'Computer Lab': 'bg-indigo-50 text-indigo-700',
  Seminar: 'bg-amber-50 text-amber-700',
  Library: 'bg-emerald-50 text-emerald-700',
};

const roomTypeLabel = {
  classroom: 'Classroom',
  lab: 'Laboratory',
  seminar_hall: 'Seminar Hall',
};

export default function VacantRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view rooms.');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/rooms/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to fetch rooms');
          return;
        }

        const transformedRooms = (data.rooms || []).map((room) => ({
          id: room.id,
          name: room.name,
          building: room.building,
          floor: room.floor || 'N/A',
          capacity: room.capacity,
          type: roomTypeLabel[room.room_type] || 'Other',
          amenities: [
            room.facilities?.projector ? 'Projector' : null,
            room.facilities?.ac ? 'AC' : null,
            room.facilities?.computers ? 'Computers' : null,
          ].filter(Boolean),
          available: room.status === 'available',
          nextAvailable: room.nextClass || null,
          currentClass: room.currentClass || null,
          status: room.status,
        }));

        setRooms(transformedRooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Unable to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const types = ['all', ...new Set(rooms.map((r) => r.type))];

  const filtered = rooms.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    const matchAvail = !onlyAvailable || r.available;
    return matchSearch && matchType && matchAvail;
  });

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-5 text-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
        <p className="text-slate-500 mt-4">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-5 text-center py-16">
        <p className="text-red-600 font-semibold">{error}</p>
        <p className="text-slate-500 mt-2">Please login or refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vacant Rooms</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {rooms.filter((r) => r.available).length} of {rooms.length} rooms available right now.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms or buildings…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
          <button onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              onlyAvailable ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}>
            <CheckCircle className="w-3.5 h-3.5" /> Available only
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Status bar */}
            <div className={`h-1 w-full ${room.available ? 'bg-emerald-400' : 'bg-red-400'}`} />

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{room.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {room.building}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[room.type] || 'bg-slate-50 text-slate-600'}`}>
                  {room.type}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity}</span>
                <span>{room.floor}</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {room.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1 text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">
                    {amenityIcon(a)}
                    {a}
                  </span>
                ))}
              </div>

              {/* Status + action */}
              <div className="mt-auto">
                {room.available ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Available
                    </span>
                    <button
                      onClick={() => toast.success(`Booking request sent for ${room.name}`)}
                      className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Book Room
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                      <Clock className="w-3.5 h-3.5" /> Occupied
                    </span>
                    {room.nextAvailable && (
                      <span className="text-xs text-slate-500">Free at {room.nextAvailable}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No rooms match your filters</p>
        </div>
      )}
    </div>
  );
}
