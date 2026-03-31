import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'];

const CLASSES = [
  { day: 'Monday', slot: '9:00', subject: 'Data Structures', room: 'Room 201', students: 45, code: 'CS301' },
  { day: 'Monday', slot: '11:00', subject: 'Algorithms', room: 'Lab A', students: 30, code: 'CS302' },
  { day: 'Monday', slot: '2:00', subject: 'Office Hours', room: 'Faculty Room 4', students: null, code: null },
  { day: 'Tuesday', slot: '10:00', subject: 'Database Systems', room: 'Room 101', students: 50, code: 'CS303' },
  { day: 'Tuesday', slot: '2:00', subject: 'Data Structures', room: 'Room 201', students: 45, code: 'CS301' },
  { day: 'Wednesday', slot: '9:00', subject: 'Algorithms', room: 'Lab A', students: 30, code: 'CS302' },
  { day: 'Wednesday', slot: '11:00', subject: 'Database Systems', room: 'Room 101', students: 50, code: 'CS303' },
  { day: 'Thursday', slot: '10:00', subject: 'Data Structures', room: 'Room 201', students: 45, code: 'CS301' },
  { day: 'Thursday', slot: '3:00', subject: 'Research Seminar', room: 'Seminar Hall', students: 80, code: 'CS399' },
  { day: 'Friday', slot: '9:00', subject: 'Algorithms', room: 'Lab A', students: 30, code: 'CS302' },
  { day: 'Friday', slot: '1:00', subject: 'Office Hours', room: 'Faculty Room 4', students: null, code: null },
];

const subjectColors = {
  'Data Structures': 'bg-blue-50 border-blue-200 text-blue-900',
  'Algorithms': 'bg-purple-50 border-purple-200 text-purple-900',
  'Database Systems': 'bg-emerald-50 border-emerald-200 text-emerald-900',
  'Office Hours': 'bg-slate-50 border-slate-200 text-slate-600',
  'Research Seminar': 'bg-amber-50 border-amber-200 text-amber-900',
};

export default function FacultyTimetable() {
  const getClass = (day, slot) => CLASSES.find((c) => c.day === day && c.slot === slot);

  const totalClasses = CLASSES.filter((c) => c.students !== null).length;
  const totalStudents = CLASSES.reduce((acc, c) => acc + (c.students || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Timetable</h1>
        <p className="text-slate-500 text-sm mt-0.5">Weekly class schedule – Spring Semester 2026.</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: Calendar, label: `${totalClasses} classes/week`, color: 'blue' },
          { icon: Users, label: `${totalStudents} total students`, color: 'indigo' },
          { icon: Clock, label: '18 teaching hours', color: 'purple' },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${
            color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
            color === 'indigo' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
            'bg-purple-50 text-purple-700 border border-purple-100'
          }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="text-xs font-semibold text-slate-400 text-left p-3 w-16 border-b border-slate-100">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="text-xs font-semibold text-slate-700 text-left p-3 border-b border-slate-100">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot} className="border-b border-slate-50 last:border-0">
                <td className="text-xs font-mono text-slate-400 p-3 align-top">{slot}</td>
                {DAYS.map((day) => {
                  const cls = getClass(day, slot);
                  return (
                    <td key={day} className="p-1.5 align-top">
                      {cls ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`rounded-xl border p-2.5 text-xs ${subjectColors[cls.subject] || 'bg-slate-50 border-slate-200 text-slate-600'}`}
                        >
                          <p className="font-semibold leading-tight">{cls.subject}</p>
                          {cls.code && <p className="font-mono text-[10px] opacity-70 mt-0.5">{cls.code}</p>}
                          <div className="mt-1.5 space-y-0.5 opacity-80">
                            <p className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{cls.room}</p>
                            {cls.students && <p className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{cls.students} students</p>}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-2" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(subjectColors).map(([name, cls]) => (
          <div key={name} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${cls}`}>
            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
