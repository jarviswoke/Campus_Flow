
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from    './components/student/Dashboard'
import ComplaintForm from './components/student/ComplaintForm';
import VacantRooms from './components/student/VacantRooms';
import Profile from './components/student/Profile';
import SuccessModal from './components/student/SuccessModal';
import CompliantStatus from './components/student/ComplaintStatus';
import FacultyDashboard from './components/faculty/FacultyDashboard';


const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <Routes>
    <Route path='/login' element= {<LoginPage  /> }/>
    <Route path='/dashboard' element= {<Dashboard  /> }/>
    <Route path='/complaint' element= {<ComplaintForm  /> }/>
    <Route path='/rooms' element= {<VacantRooms  /> }/>
    <Route path='/profile' element= {<Profile  /> }/>
    <Route path='/status' element= {<CompliantStatus  /> }/>
    <Route path='/success' element= {<SuccessModal  /> }/>
    <Route path="/faculty" element={<FacultyDashboard /> }/>

</Routes> </div>
  )
}

export default App