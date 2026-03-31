import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

import Dashboard from    './components/student/Dashboard'
import ComplaintForm from './components/student/ComplaintForm';
import VacantRooms from './components/student/VacantRooms';
import Profile from './components/student/Profile';
import SuccessModal from './components/student/SuccessModal';
import CompliantStatus from './components/student/ComplaintStatus';

//faculty 
import FacultyDashboard from './components/faculty/FacultyDashboard';
import FacultyComplaints from './components/faculty/FacultyComplaints';
import FacultyNavigation from './components/faculty/FacultyNavigation';
import FacultyTimetable from './components/faculty/FacultyTimetable';

//admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminNavigation from './components/admin/AdminNavigation';
import AuditLogs from './components/admin/AuditLogs';
import UserManagement from './components/admin/UserManagement';
import SystemAnalytics from './components/admin/SystemAnalytics';
import RoomAllocation from './components/admin/RoomAllocation';

//layouts
import StudentLayout from './layouts/StudentLayout.jsx';
import FacultyLayout from './layouts/FacultyLayout.jsx';
import AdminLayout   from './layouts/AdminLayout.jsx';

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />

        {/* ── Student pages — student nav only ── */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/rooms"     element={<VacantRooms />} />
          <Route path="/profile"   element={<Profile />} />
          <Route path="/status"    element={<CompliantStatus />} />
          <Route path="/success"   element={<SuccessModal />} />
        </Route>

        <Route element={<FacultyLayout />}>
          <Route path="/faculty"            element={<FacultyDashboard />} />
          <Route path="/faculty/complaints" element={<FacultyComplaints />} />
          <Route path="/faculty/timetable"  element={<FacultyTimetable />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin"           element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<UserManagement />} />
          <Route path="/admin/rooms"     element={<RoomAllocation />} />
          <Route path="/admin/analytics" element={<SystemAnalytics />} />
          <Route path="/admin/audit"     element={<AuditLogs />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App