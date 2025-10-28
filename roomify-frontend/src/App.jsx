import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layouts and Security
import ProtectedRoute from './components/ProtectedRoute'; // General Auth Check
import AdminRoute from './components/AdminRoute';       // Admin Role Check
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
import LegalPage from './pages/LegalPage'; // <-- IMPORTED LegalPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public/Auth Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* ------------------------------------------- */}
        {/* --- LEGAL PAGES (PUBLIC) --- */}
        {/* These links (from the Footer) are accessible without logging in */}
        {/* ------------------------------------------- */}
        <Route path="/policy" element={<LegalPage type="Privacy" />} />
        <Route path="/terms" element={<LegalPage type="Terms" />} />
        <Route path="/help" element={<LegalPage type="Help" />} />

        {/* ------------------------------------------- */}
        {/* --- GENERAL PROTECTED ROUTES (STAFF/GUEST) --- */}
        {/* ------------------------------------------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/staff/reception" element={<ReceptionDesk />} />
            <Route path="/staff/housekeeping" element={<HousekeepingPage />} />
            <Route path="/book" element={<GuestBookingPage />} />
            {/* Fallback route for logged-in users who land on / */}
            <Route index element={<DashboardPage />} /> 
          </Route>
        </Route>

        {/* ------------------------------------------- */}
        {/* --- PROTECTED ADMIN ROUTES (MANAGEMENT) --- */}
        {/* ------------------------------------------- */}
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
        
        {/* Fallback to Login for any invalid path */}
        <Route path="*" element={<LoginPage />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;