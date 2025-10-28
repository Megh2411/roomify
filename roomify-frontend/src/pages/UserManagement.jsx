import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, User, Edit } from 'lucide-react'
import { Card } from "@/components/ui/card"; // Import Card

// --- 1. DEFINE API_BASE_URL ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// -----------------------------

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formError, setFormError] = useState(null)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Guest',
  })
  
  // States for Editing
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')

  const availableRoles = ['Guest', 'Receptionist', 'Housekeeping', 'Admin'];

  // --- Fetch all users ---
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      // --- 2. FIX URL SYNTAX (Use Backticks) ---
      const { data } = await axios.get(`${API_BASE_URL}/api/users/all`, { 
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error("API did not return an array for users:", data);
        setUsers([]);
        setError('Received unexpected data format from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users. Ensure API endpoint exists.')
      setUsers([]);
    }
    setLoading(false)
  }

  // --- Create a new user ---
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      // --- 2. FIX URL SYNTAX (Use Backticks) ---
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users`, 
        newUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update state safely
      setUsers(prevUsers => Array.isArray(prevUsers) ? [...prevUsers, {...newUserData, _id: data._id, token: undefined, password: ''}] : [{...newUserData, _id: data._id, token: undefined, password: ''}]) 
      setIsDialogOpen(false)
      setNewUserData({ name: '', email: '', password: '', role: 'Guest' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user. Email may already exist.')
    }
  }
  
  // --- Update User Role ---
  const handleUpdateRole = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");
      if (!editingUser) throw new Error("No user selected for editing.");
      
      // --- 2. FIX URL SYNTAX (Use Backticks) ---
      const { data } = await axios.put(
        `${API_BASE_URL}/api/users/${editingUser._id}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the user list state safely
      setUsers(prevUsers => Array.isArray(prevUsers) ? prevUsers.map(u => u._id === editingUser._id ? {...u, role: data.role} : u) : [])
      setIsEditOpen(false)
      setEditingUser(null); // Clear editing state
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update user role.')
    }
  }

  // --- Delete a user ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");
      
      // --- 2. FIX URL SYNTAX (Use Backticks) ---
      await axios.delete(
        `${API_BASE_URL}/api/users/${userId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Update state safely
      setUsers(prevUsers => Array.isArray(prevUsers) ? prevUsers.filter((user) => user._id !== userId) : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) return <div className="p-8 text-center dark:text-gray-300">Loading users...</div>
  // Keep error display as is
  if (error && !isDialogOpen && !isEditOpen) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User and Staff Management</h1>
        
        {/* --- Create User Dialog --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormError(null)}><User className="mr-2 h-4 w-4" /> Create New User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Use this form to create new staff accounts.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              {/* ... Create User Form fields ... */}
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cName" className="dark:text-gray-200">Name</Label>
                  <Input id="cName" value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} required className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cEmail" className="dark:text-gray-200">Email</Label>
                  <Input id="cEmail" type="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} required className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cPassword" className="dark:text-gray-200">Password</Label>
                  <Input id="cPassword" type="password" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} required className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cRole" className="dark:text-gray-200">Role</Label>
                  <Select value={newUserData.role} onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}>
                    <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* --- Edit Role Dialog --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role: {editingUser?.name}</DialogTitle>
            <DialogDescription>Update the role for {editingUser?.email}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRole}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editRole" className="dark:text-gray-200">New Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display page-level error if it exists */}
      {error && <div className="mb-4 p-4 text-center text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">{error}</div>}

      {/* --- User List Table --- */}
      <Card className="bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-600">
              <TableHead className="dark:text-gray-300">Name</TableHead>
              <TableHead className="dark:text-gray-300">Email</TableHead>
              <TableHead className="dark:text-gray-300">Role</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Added safety check for users array */}
            {!Array.isArray(users) || users.length === 0 ? (
              <TableRow className="dark:border-gray-600"><TableCell colSpan={5} className="text-center dark:text-gray-400">No users found.</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} className="dark:border-gray-600">
                  <TableCell className="font-medium dark:text-white">{user.name}</TableCell>
                  <TableCell className="dark:text-gray-300">{user.email}</TableCell>
                  <TableCell className="dark:text-gray-300">{user.role}</TableCell>
                  <TableCell className="dark:text-gray-300">{user.role !== 'Guest' ? 'Staff' : 'Guest'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="mr-2 dark:text-gray-400 dark:hover:bg-gray-600"
                      onClick={() => {
                        setEditingUser(user);
                        setNewRole(user.role); 
                        setIsEditOpen(true);
                        setFormError(null);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === 'Admin'} 
                      className="dark:text-red-400 dark:hover:bg-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default UserManagement