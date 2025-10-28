import { useState } from "react"
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  ShoppingBag,
  Users,
  Settings,
  Briefcase, 
  Menu,
  X,
  LogOut,
  Trash2 // For Housekeeping icon
} from "lucide-react"
import Footer from './Footer'; // <-- Imported Footer

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  // Get user details from localStorage for display
  const userInfoString = localStorage.getItem('userInfo')
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const userName = userInfo?.name || 'Admin User';
  const userEmail = userInfo?.email || 'admin@roomify.com';

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BedDouble, label: "Rooms", href: "/admin/rooms" },
    { icon: ShoppingBag, label: "Services", href: "/admin/services" },
    { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
    { icon: Users, label: "Staff & Guests", href: "/admin/users" },
    // Staff Access Points
    { icon: Briefcase, label: "Reception Desk", href: "/staff/reception" },
    { icon: Trash2, label: "Housekeeping", href: "/staff/housekeeping" },
    // Guest Access Point
    { icon: BedDouble, label: "Guest Booking", href: "/book" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    // Applied dark:bg-gray-800 to the main container
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">R</div>
            {sidebarOpen && <span className="font-bold text-lg">Roomify</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                // Logic to highlight the active link
                location.pathname.startsWith(item.href) && item.href !== "/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800"
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            {/* Display first two initials of the user's name */}
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              {userName.substring(0,2).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Contains Menu and Logout) */}
        <header className="bg-white dark:bg-gray-700 border-b dark:border-gray-600 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* The current page title will be displayed by the nested page component */}
          </div>
          {/* Logout Button */}
          <button 
            onClick={logoutHandler} 
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </header>

        {/* THIS IS WHERE PAGES RENDER (via Outlet) */}
        {/* Added flex-grow to the inner div to ensure pages fill space above footer */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-grow">
            <Outlet />
          </div>
        </div>
        
        <Footer /> {/* <-- FINAL FOOTER PLACEMENT */}
      </div>
    </div>
  )
}

export default AdminLayout