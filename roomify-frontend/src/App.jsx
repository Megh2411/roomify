import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Public/Base Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LegalPage from './pages/LegalPage';

// Layouts and Security
import ProtectedRoute from './components/ProtectedRoute'; // General Auth Check
import AdminRoute from './components/AdminRoute';       // Admin Role Check
import HousekeepingRoute from './components/HousekeepingRoute'; // Housekeeping/Admin Check
import AdminLayout from './components/AdminLayout';     // Reusable sidebar/header layout

// Admin/Management Pages
import DashboardPage from './pages/DashboardPage';
import RoomManagement from './pages/RoomManagement';
import ServiceManagement from './pages/ServiceManagement';
import BookingManagement from './pages/BookingManagement';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';

// Staff/Guest Operational Pages
import ReceptionDesk from './pages/ReceptionDesk';
import HousekeepingPage from './pages/HousekeepingPage';
import GuestBookingPage from './pages/GuestBookingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public/Auth Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        {/* --- Legal Pages (Public) --- */}
        <Route path="/policy" element={<LegalPage type="Privacy" />} />
        <Route path="/terms" element={<LegalPage type="Terms" />} />
        <Route path="/help" element={<LegalPage type="Help" />} />


        {/* --- GENERAL PROTECTED ROUTES (For Guests/Receptionists/Admins) --- */}
        {/* All these pages use the AdminLayout for consistent sidebar/header */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Receptionist can access this */}
            <Route path="/staff/reception" element={<ReceptionDesk />} />
            {/* Guest can access this */}
            <Route path="/book" element={<GuestBookingPage />} />
            {/* Fallback index for logged-in users (could redirect based on role later) */}
            {/* For now, non-admins might see dashboard error, but layout is there */}
             <Route index element={<DashboardPage />} /> 
          </Route>
        </Route>


        {/* --- HOUSEKEEPING PROTECTED ROUTE --- */}
        {/* Only Housekeeping or Admin can access this */}
        <Route element={<HousekeepingRoute />}>
           <Route element={<AdminLayout />}> {/* Use AdminLayout */}
             <Route path="/staff/housekeeping" element={<HousekeepingPage />} />
           </Route>
        </Route>


        {/* --- ADMIN PROTECTED ROUTES --- */}
        {/* Only Admin can access these */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/services" element={<ServiceManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        
        {/* Fallback Route - Redirects any unknown path to Login */}
        <Route path="*" element={<LoginPage />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;