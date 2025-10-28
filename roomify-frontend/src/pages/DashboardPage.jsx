import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import {
  DollarSign,
  Book,
  Bed,
  CheckCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // --- Mock data ---
  const revenueData = [
    { day: "Mon", revenue: 2400 },
    { day: "Tue", revenue: 1398 },
    { day: "Wed", revenue: 9800 },
    { day: "Thu", revenue: 3908 },
    { day: "Fri", revenue: 4800 },
    { day: "Sat", revenue: 3800 },
    { day: "Sun", revenue: 4300 },
  ]

  const activityData = [
    { id: 1, guestName: "Megh Doshi", action: "Checked In", room: "101", date: "Oct 27, 2025" },
    { id: 2, guestName: "Shrey Dedhia", action: "Booked", room: "204", date: "Oct 27, 2025" },
  ]
  // --- End of Mock Data ---

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("userToken")
      if (!token) {
        navigate('/login') // Redirect if no token
        return;
      }

      try {
        setLoading(true)
        const { data } = await axios.get(
          // Corrected API URL
          "http://localhost:5000/api/dashboard/stats", 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data.")
        if(err.response?.status === 401 || err.response?.status === 403){
          localStorage.removeItem('userToken')
          localStorage.removeItem('userInfo')
          navigate('/login')
        }
      }
      setLoading(false)
    }

    fetchStats()
  }, [navigate])


  // --- Helper variables for dynamic data ---
  // Ensure stats is defined before accessing properties
  const kpiData = [
    {
      icon: DollarSign,
      title: "Total Revenue",
      value: stats && stats.totalRevenue !== undefined ? `$${stats.totalRevenue.toFixed(2)}` : "$0.00", 
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Book,
      title: "Total Bookings",
      value: stats?.totalBookings !== undefined ? stats.totalBookings : "...",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Bed,
      title: "Current Occupancy",
      value: stats && stats.currentOccupancy ? `${stats.currentOccupancy.rate}%` : "0.00%", 
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: CheckCircle,
      title: "Rooms Available",
      // --- FINAL FIX IS HERE ---
      value: stats && stats.roomStatus 
        ? stats.roomStatus.find((s) => s._id === "Available")?.count || 0 
        : 0, 
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
  ]

  // Add checks for stats and stats.roomStatus before mapping
  const roomStatusData = (stats && stats.roomStatus) ? stats.roomStatus.map(status => ({
    name: status._id,
    value: status.count,
  })) : []

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"] // Available, Occupied, Maintenance

  // --- Loading and Error Handling ---
  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  // --- Page Content ---
  // Add an extra check here to ensure stats is fully loaded before rendering
  if (!stats) return <div className="p-8 text-center">Waiting for data...</div>; 

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`${kpi.color} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
              </div>
              <div className={`${kpi.iconColor} p-3 bg-white rounded-lg`}>
                <kpi.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Render Pie chart only if data exists */}
        {roomStatusData.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Room Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity Table (Still Mock Data) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Room</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{activity.guestName}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        activity.action === "Checked In"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{activity.room}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage