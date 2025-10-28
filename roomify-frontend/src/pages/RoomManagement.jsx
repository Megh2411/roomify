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
import { Trash2, Edit } from 'lucide-react'

const RoomManagement = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formError, setFormError] = useState(null)
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    type: 'Single',
    pricePerNight: '',
  })

  // --- Fetch all rooms ---
  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      const { data } = await axios.get('http://localhost:5000/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRooms(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms.')
    }
    setLoading(false)
  }

  // --- Create a new room ---
  const handleCreateRoom = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      const { data } = await axios.post(
        'http://localhost:5000/api/rooms',
        {...newRoomData, pricePerNight: Number(newRoomData.pricePerNight)},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRooms([...rooms, data])
      setIsDialogOpen(false)
      setNewRoomData({ roomNumber: '', type: 'Single', pricePerNight: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create room. Room number might already exist.')
    }
  }

  // --- Delete a room ---
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      await axios.delete(
        `http://localhost:5000/api/rooms/${roomId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRooms(rooms.filter((room) => room._id !== roomId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room.')
    }
  }

  // --- Load rooms on component mount ---
  useEffect(() => {
    fetchRooms()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading rooms...</div>
  if (error && !isDialogOpen) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* --- MODIFIED LINE: Removed asChild --- */}
          <DialogTrigger>
            <Button onClick={() => setFormError(null)}>Create New Room</Button>
          </DialogTrigger>
          {/* ------------------------------------- */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRoom}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={newRoomData.roomNumber}
                    onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select
                    value={newRoomData.type}
                    onValueChange={(value) => setNewRoomData({ ...newRoomData, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRoomData.pricePerNight}
                    onChange={(e) => setNewRoomData({ ...newRoomData, pricePerNight: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                {formError && <p className="col-span-4 text-red-500 text-sm text-center">{formError}</p>}
              </div>
              <DialogFooter>
                <Button type="submit">Create Room</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="mb-4 p-4 text-center text-red-600 bg-red-100 rounded">{error}</div>}

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No rooms found.</TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.status}</TableCell>
                  <TableCell>${room.pricePerNight?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="mr-2" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room._id)}>
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

export default RoomManagement