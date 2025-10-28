import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const HousekeepingRoute = () => {
  // 1. Get user info
  const userInfoString = localStorage.getItem('userInfo')
  let isAuthorized = false;

  // 2. Check if user exists and has the correct role
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString)
    if (userInfo && (userInfo.role === 'Housekeeping' || userInfo.role === 'Admin')) {
      isAuthorized = true;
    }
  }

  // 3. Render page or redirect to login/appropriate page
  // If not authorized, send them back to login. Or, you could send them to '/book' if they are a logged-in guest.
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />
}

export default HousekeepingRoute