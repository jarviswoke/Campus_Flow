import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileSpreadsheet, CheckCircle, Clock, AlertCircle,
  Trash2, Zap, Loader2, RefreshCw, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const statusConfig = {
  active:     { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  pending:    { cls: 'bg-amber-50 text-amber-700 border-amber-200',       icon: Clock },
  processing: { cls: 'bg-blue-50 text-blue-700 border-blue-200',          icon: Loader2 },
  failed:     { cls: 'bg-red-50 text-red-700 border-red-200',             icon: AlertCircle },
};

export default function TimetableManagement() {
  const [timetables, setTimetables]   = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [updatingRooms, setUpdatingRooms] = useState(false);
  const [error, setError]             = useState(null);
  const [expanded, setExpanded]       = useState(null);

  // Upload form state
  const [file, setFile]               = useState(null);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semester, setSemester]       = useState('Spring');

  const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ttRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/timetables/`, { headers: getHeaders() }),
        fetch(`${BACKEND_URL}/api/timetables/stats`, { headers: getHeaders() }),
      ]);
      const ttData    = await ttRes.json();
      const statsData = await statsRes.json();
      if (!ttRes.ok)    throw new Error(ttData.error    || 'Failed to load timetables');
      if (!statsRes.ok) throw new Error(statsData.error || 'Failed to load stats');
      setTimetables(ttData.timetables || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('academic_year', academicYear);
      formData.append('semester', semester);

      const res  = await fetch(`${BACKEND_URL}/api/timetables/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      toast.success('Timetable uploaded! Processing in background…');
      setFile(null);
      document.getElementById('tt-file-input').value = '';
      await fetchAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/timetables/${id}/activate`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Activation failed');
      toast.success('Timetable activated! Room statuses updated.');
      await fetchAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable? This cannot be undone.')) return;
    try {
      const res  = await fetch(`${BACKEND_URL}/api/timetables/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success('Timetable deleted');
      setTimetables(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateRoomStatus = async () => {
    setUpdatingRooms(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/timetables/rooms/status/update`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      toast.success(`Room statuses refreshed — ${data.rooms?.length || 0} rooms updated`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingRooms(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Timetable Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Upload and manage academic timetables.</p>
        </div>
        <button
          onClick={handleUpdateRoomStatus}
          disabled={updatingRooms}
          className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${updatingRooms ? 'animate-spin' : ''}`} />
          Refresh Room Status
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',    value: stats.total_timetables,        color: 'slate' },
            { label: 'Active',   value: stats.active,                  color: 'green' },
            { label: 'Sessions', value: stats.total_sessions,          color: 'blue'  },
            { label: 'Rooms w/ Classes', value: stats.rooms_with_sessions, color: 'purple' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
              <p className={`text-2xl font-bold ${
                color === 'green'  ? 'text-emerald-600' :
                color === 'blue'   ? 'text-blue-600'    :
                color === 'purple' ? 'text-purple-600'  : 'text-slate-700'
              }`}>{value ?? '—'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-600" /> Upload New Timetable
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Academic Year</label>
            <input
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              placeholder="2025-2026"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
            >
              <option>Spring</option>
              <option>Fall</option>
              <option>Summer</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">File (Excel / Image)</label>
            <input
              id="tt-file-input"
              type="file"
              accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.pdf"
              onChange={e => setFile(e.target.files[0])}
              className="w-full h-9 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 bg-slate-50 rounded-lg px-3 py-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">{file.name}</span>
            <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {uploading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
            : <><Upload className="w-4 h-4" /> Upload Timetable</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Timetable List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading timetables…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {timetables.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No timetables uploaded yet</p>
              <p className="text-xs mt-1">Upload an Excel or image file above to get started</p>
            </div>
          )}

          {timetables.map((tt, i) => {
            const sc = statusConfig[tt.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            const isExpanded = expanded === tt.id;

            return (
              <motion.div
                key={tt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900 truncate">{tt.file_name}</p>
                          {tt.is_active && (
                            <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tt.academic_year} · {tt.semester} · Uploaded by {tt.uploaded_by}
                        </p>
                        {tt.created_at && (
                          <p className="text-xs text-slate-400">
                            {new Date(tt.created_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${sc.cls}`}>
                        <StatusIcon className={`w-3 h-3 ${tt.status === 'processing' ? 'animate-spin' : ''}`} />
                        {tt.status}
                      </span>

                      {tt.status === 'active' && !tt.is_active && (
                        <button
                          onClick={() => handleActivate(tt.id)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Zap className="w-3 h-3" /> Activate
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(tt.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setExpanded(isExpanded ? null : tt.id)}
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded: show extracted sessions preview */}
                  {isExpanded && tt.extracted_data && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Extracted Sessions ({tt.extracted_data?.total_sessions ?? tt.extracted_data?.sessions?.length ?? 0})
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-1.5">
                        {(tt.extracted_data?.sessions || []).slice(0, 20).map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs bg-slate-50 rounded-lg px-3 py-2">
                            <span className="font-medium text-slate-700 w-20 shrink-0 capitalize">{s.day}</span>
                            <span className="text-slate-500 w-28 shrink-0">
                              {s.start_time?.slice(0,5)}–{s.end_time?.slice(0,5)}
                            </span>
                            <span className="font-medium text-slate-800 truncate">{s.subject}</span>
                            <span className="text-slate-400 truncate">{s.room}</span>
                          </div>
                        ))}
                        {(tt.extracted_data?.sessions?.length > 20) && (
                          <p className="text-xs text-slate-400 text-center py-1">
                            +{tt.extracted_data.sessions.length - 20} more sessions
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {isExpanded && tt.status === 'failed' && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold text-red-600 mb-1">Error Details</p>
                      <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{tt.error_message}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}