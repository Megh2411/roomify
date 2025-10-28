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
  DialogDescription, // <-- ADDED THIS IMPORT
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

  // --- 1. Fetch all users ---
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      // NOTE: We use the new Admin endpoint: /api/users/all
      const { data } = await axios.get('http://localhost:5000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users. Ensure API endpoint exists.')
    }
    setLoading(false)
  }

  // --- 2. Create a new user (Staff or Guest) ---
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      // The POST /api/users endpoint already exists for registration
      const { data } = await axios.post(
        'http://localhost:5000/api/users',
        newUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the user list state. We manually insert the user data since the response doesn't include the full object.
      setUsers([...users, {...newUserData, _id: data._id, token: undefined, password: ''}]) 
      setIsDialogOpen(false)
      setNewUserData({ name: '', email: '', password: '', role: 'Guest' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user. Email may already exist.')
    }
  }
  
  // --- 3. Update User Role (Admin Function) ---
  const handleUpdateRole = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");
      
      // NOTE: PUT /api/users/:id/role
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the user list state
      setUsers(users.map(u => u._id === editingUser._id ? {...u, role: data.role} : u))
      setIsEditOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update user role.')
    }
  }

  // --- 4. Delete a user ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");
      
      // NOTE: DELETE /api/users/:id
      await axios.delete(
        `http://localhost:5000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsers(users.filter((user) => user._id !== userId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading users...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User and Staff Management</h1>
        
        {/* --- Create User Dialog --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormError(null)}><User className="mr-2 h-4 w-4" /> Create New User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              {/* This component is now correctly imported */}
              <DialogDescription>Use this form to create new staff accounts.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cName">Name</Label>
                  <Input id="cName" value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cEmail">Email</Label>
                  <Input id="cEmail" type="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cPassword">Password</Label>
                  <Input id="cPassword" type="password" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cRole">Role</Label>
                  <Select value={newUserData.role} onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label htmlFor="editRole">New Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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


      {/* --- User List Table --- */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center">No users found.</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.role !== 'Guest' ? 'Staff' : 'Guest'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="mr-2"
                      onClick={() => {
                        setEditingUser(user);
                        setNewRole(user.role); // Set current role as default
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
                      disabled={user.role === 'Admin'} // Prevent deleting yourself or other admins easily
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default UserManagement