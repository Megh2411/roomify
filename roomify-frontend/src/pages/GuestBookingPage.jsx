import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BedDouble, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

// --- 1. DEFINE API_BASE_URL ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// ------------------------------

const GuestBookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Default dates for immediate viewing
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);

  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // --- Utility Function to Fetch Data ---
  const fetchRooms = async () => {
    if (!token) {
      setError("You must be logged in to view rooms.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Corrected: Removed single quotes, now using proper template literal
      const { data: roomData } = await axios.get(`${API_BASE_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRooms(roomData.filter(r => r.status === 'Available')); // Only show available rooms
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load room inventory.');
    } finally {
      setLoading(false);
    }
  };

  // --- Room Search/Filter Logic ---
  const filterRooms = () => {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    setError(null);
    alert(`Simulating search for ${days} nights from ${checkInDate}.`);
  };

  // --- Booking Submission ---
  const handleReserve = async (roomId) => {
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setSelectedRoomId(roomId);
    if (!window.confirm("Confirm reservation? Your total will be calculated at checkout.")) {
      setSelectedRoomId(null);
      return;
    }

    try {
      setError(null);

      const payload = {
        roomIds: [roomId],
        checkInDate,
        checkOutDate,
      };

      // ✅ Corrected: Proper API call
      const { data } = await axios.post(`${API_BASE_URL}/api/bookings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Booking Confirmed! ID: ${data._id}. Your booking is now pending check-in.`);
      navigate('/book');
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed. Room may be unavailable or dates conflict.');
    } finally {
      setSelectedRoomId(null);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const days = Math.max(1, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4" /> Loading rooms...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 sm:p-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400">
          Welcome, {userInfo?.name || 'Guest'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find your perfect stay at Roomify based on your travel dates.
        </p>
      </header>

      {/* Search Bar */}
      <Card className="max-w-4xl mx-auto shadow-lg dark:bg-gray-700 mb-10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="checkIn" className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-2" /> Check-in Date
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="checkOut" className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-2" /> Check-out Date
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <Button
              onClick={filterRooms}
              className="h-10 bg-blue-600 hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Search {days} Nights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900 dark:text-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Room Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Available Rooms ({rooms.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room._id}
              className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600"
            >
              <img
                src={`https://placehold.co/400x200/F0F4FF/25387F?text=${room.type.replace(/\s/g, '+')}`}
                alt={`${room.type} room`}
                className="w-full h-48 object-cover object-center"
              />
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-white">
                  <BedDouble className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> {room.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-lg font-semibold flex items-center mb-3 dark:text-white">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                  ${room.pricePerNight.toFixed(2)}{' '}
                  <span className="text-gray-500 dark:text-gray-400 font-normal text-sm ml-1">/ night</span>
                </p>
                <Button
                  onClick={() => handleReserve(room._id)}
                  disabled={selectedRoomId === room._id}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {selectedRoomId === room._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reserving...
                    </>
                  ) : (
                    'Reserve Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && !loading && (
          <div className="text-center p-10 text-gray-500 dark:text-gray-400 border rounded-lg dark:border-gray-600">
            No rooms currently available based on inventory.
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookingPage;
