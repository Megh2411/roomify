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
import { Checkbox } from "@/components/ui/checkbox" // Added for availability
import { Trash2, Edit } from 'lucide-react'

const ServiceManagement = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formError, setFormError] = useState(null)
  const [newServiceData, setNewServiceData] = useState({
    type: 'Food', // Default type
    description: '',
    price: '',
    isAvailable: true,
  })

  // --- Fetch all services ---
  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      const { data } = await axios.get('http://localhost:5000/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setServices(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services.')
    }
    setLoading(false)
  }

  // --- Create a new service ---
  const handleCreateService = async (e) => {
    e.preventDefault()
    setFormError(null)
    try {
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");

      const { data } = await axios.post(
        'http://localhost:5000/api/services',
        {...newServiceData, price: Number(newServiceData.price)}, // Ensure price is a number
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setServices([...services, data])
      setIsDialogOpen(false)
      setNewServiceData({ type: 'Food', description: '', price: '', isAvailable: true })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create service.')
    }
  }

  // --- Delete a service ---
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      setError(null)
      const token = localStorage.getItem('userToken')
      if (!token) throw new Error("No token found");
      
      await axios.delete(
        `http://localhost:5000/api/services/${serviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setServices(services.filter((service) => service._id !== serviceId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service.')
    }
  }

  // --- Load services on component mount ---
  useEffect(() => {
    fetchServices()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading services...</div>
  if (error && !isDialogOpen) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button onClick={() => setFormError(null)}>Create New Service</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateService}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select
                    value={newServiceData.type}
                    onValueChange={(value) => setNewServiceData({ ...newServiceData, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Laundry">Laundry</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input
                    id="description"
                    value={newServiceData.description}
                    onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newServiceData.price}
                    onChange={(e) => setNewServiceData({ ...newServiceData, price: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">Available</Label>
                   <Checkbox
                     id="available"
                     checked={newServiceData.isAvailable}
                     onCheckedChange={(checked) => setNewServiceData({ ...newServiceData, isAvailable: checked })}
                     className="col-span-3 justify-self-start" // Align checkbox left
                   />
                </div>
                {formError && <p className="col-span-4 text-red-500 text-sm text-center">{formError}</p>}
              </div>
              <DialogFooter>
                <Button type="submit">Create Service</Button>
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
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No services found.</TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">{service.type}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>${service.price?.toFixed(2)}</TableCell>
                  <TableCell>{service.isAvailable ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="mr-2" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service._id)}>
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

export default ServiceManagement