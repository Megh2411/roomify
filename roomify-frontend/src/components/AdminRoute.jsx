import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  // 1. Get user info from local storage
  const userInfoString = localStorage.getItem('userInfo')
  
  // 2. Check if user exists and is an Admin
  let isAdmin = false
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString)
    if (userInfo && userInfo.role === 'Admin') {
      isAdmin = true
    }
  }

  // 3. Return the page or redirect to login
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}

export default AdminRoute