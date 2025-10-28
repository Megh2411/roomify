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
  DialogDescription, // Ensure this is imported if used
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
import { Card } from "@/components/ui/card" // <-- 1. IMPORT CARD

// --- 2. DEFINE API_BASE_URL ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// -----------------------------

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
      if (!token) throw new Error("No token found")

      // --- 3. FIX URL SYNTAX (Use Backticks) ---
      const { data } = await axios.get(`${API_BASE_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (Array.isArray(data)) {
        setRooms(data)
      } else {
        console.error("API did not return an array for rooms:", data)
        setRooms([])
        setError('Received unexpected data format from server.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms.')
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  // --- Create a new room ---
  const handleCreateRoom = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found")

      // --- 3. FIX URL SYNTAX (Use Backticks) ---
      const { data } = await axios.post(
        `${API_BASE_URL}/api/rooms`,
        { ...newRoomData, pricePerNight: Number(newRoomData.pricePerNight) },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setRooms((prevRooms) =>
        Array.isArray(prevRooms) ? [...prevRooms, data] : [data]
      )
      setIsDialogOpen(false)
      setNewRoomData({ roomNumber: '', type: 'Single', pricePerNight: '' })
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          'Failed to create room. Room number might already exist.'
      )
    }
  }

  // --- Delete a room ---
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return

    try {
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found")

      // URL Syntax was already correct here, just uses the defined variable now
      await axios.delete(`${API_BASE_URL}/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setRooms((prevRooms) =>
        Array.isArray(prevRooms)
          ? prevRooms.filter((room) => room._id !== roomId)
          : []
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room.')
    }
  }

  // --- Load rooms on mount ---
  useEffect(() => {
    fetchRooms()
  }, [])

  // --- UI rendering ---
  if (loading)
    return <div className="p-8 text-center dark:text-gray-300">Loading rooms...</div>

  // Display error only if dialog is not open
  if (error && !isDialogOpen) return <div className="p-8 text-center text-red-600">{error}</div>;


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Room Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             {/* Re-added asChild based on previous context where removing it caused issues */}
            <Button onClick={() => setFormError(null)}>Create New Room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              {/* Added DialogDescription - ensure it's imported */}
              <DialogDescription>Enter the details for the new room.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoom}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roomNumber" className="text-right dark:text-gray-200">
                    Room Number
                  </Label>
                  <Input
                    id="roomNumber"
                    value={newRoomData.roomNumber}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, roomNumber: e.target.value })
                    }
                    className="col-span-3 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right dark:text-gray-200">
                    Type
                  </Label>
                  <Select
                    value={newRoomData.type}
                    onValueChange={(value) =>
                      setNewRoomData({ ...newRoomData, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3 dark:bg-gray-600 dark:border-gray-500 dark:text-white">
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
                  <Label htmlFor="price" className="text-right dark:text-gray-200">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRoomData.pricePerNight}
                    onChange={(e) =>
                      setNewRoomData({
                        ...newRoomData,
                        pricePerNight: e.target.value,
                      })
                    }
                    className="col-span-3 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    required
                  />
                </div>
                {formError && (
                  <p className="col-span-4 text-red-500 text-sm text-center">
                    {formError}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Create Room</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Moved general error display here */}
       {error && (
         <div className="mb-4 p-4 text-center text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">
           {error}
         </div>
       )}


      {/* --- ADDED DARK MODE CLASSES TO CARD & TABLE --- */}
      <Card className="bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-600">
              <TableHead className="dark:text-gray-300">Room Number</TableHead>
              <TableHead className="dark:text-gray-300">Type</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Price</TableHead>
              <TableHead className="dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Added safety check */}
            {!Array.isArray(rooms) || rooms.length === 0 ? (
              <TableRow className="dark:border-gray-600">
                <TableCell colSpan={5} className="text-center dark:text-gray-400">
                  {loading
                    ? 'Loading...'
                    : error // Show error only if loading is done and rooms array is empty/invalid
                    ? 'Error loading rooms.'
                    : 'No rooms found.'}
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room._id} className="dark:border-gray-600">
                  <TableCell className="font-medium dark:text-white">
                    {room.roomNumber}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{room.type}</TableCell>
                  <TableCell className="dark:text-gray-300">
                    {room.status || '—'} {/* Display dash if status is missing */}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                     {/* Add check for price before formatting */}
                    ${typeof room.pricePerNight === 'number' ? room.pricePerNight.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 dark:text-gray-400 dark:hover:bg-gray-600"
                      disabled // Edit functionality not implemented
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRoom(room._id)}
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
      {/* ------------------------------------------- */}
    </div>
  )
}

export default RoomManagement