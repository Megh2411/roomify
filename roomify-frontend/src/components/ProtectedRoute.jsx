import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // Check if the user token is in local storage
  const token = localStorage.getItem('userToken')

  // If token exists, show the page they are trying to access
  // (Outlet is a placeholder for the child component, e.g., AdminDashboard)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute