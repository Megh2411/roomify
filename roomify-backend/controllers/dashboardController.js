import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Invoice from '../models/invoiceModel.js';

// @desc    Get dashboard analytics (KPIs)
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Calculate Total Revenue
    const revenueStats = await Invoice.aggregate([
      {
        $match: { status: 'Paid' }, // Only count paid invoices
      },
      {
        $group: {
          _id: null, // Group all
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // 2. Total Bookings
    const totalBookings = await Booking.countDocuments({});
    const totalCompletedBookings = await Booking.countDocuments({
      status: 'Completed',
    });

    // 3. Current Occupancy
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const totalRooms = await Room.countDocuments({});
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // 4. Daily Check-ins/Check-outs (for today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const checkInsToday = await Booking.countDocuments({
      status: 'Active',
      updatedAt: { $gte: todayStart, $lt: todayEnd },
    });

    const checkOutsToday = await Booking.countDocuments({
      status: 'Completed',
      updatedAt: { $gte: todayStart, $lt: todayEnd },
    });

    // 5. Room Status Breakdown
    const roomStatus = await Room.aggregate([
      {
        $group: {
          _id: '$status', // Group by status
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalRevenue,
      totalBookings,
      totalCompletedBookings,
      currentOccupancy: {
        occupiedRooms,
        totalRooms,
        rate: occupancyRate.toFixed(2), // Format to 2 decimal places
      },
      dailyActivity: {
        checkInsToday,
        checkOutsToday,
      },
      roomStatus, // Provides: [{ _id: 'Available', count: 8 }, { _id: 'Occupied', count: 2 }, ...]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { getDashboardStats };