Method,Endpoint,Access,Description
POST,/api/users/login,Public,Login a user.
POST,/api/users,Public,Register a new user.
GET,/api/rooms,Private,Get all rooms.
POST,/api/rooms,Admin,Create a new room.
POST,/api/bookings,Private,Create a new booking.
GET,/api/bookings/mybookings,Private,Get bookings for the logged-in user.
POST,/api/reception/checkin,Staff,Check-in a guest.
GET,/api/dashboard/stats,Admin,Get hotel analytics.