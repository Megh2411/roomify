import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // <-- ADDED LABEL IMPORT
import { Loader2, BedDouble } from 'lucide-react';

const HousekeepingPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(null); 

    const token = localStorage.getItem('userToken');

    // --- Fetch all rooms ---
    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!token) throw new Error("No token found");

            const { data } = await axios.get('http://localhost:5000/api/rooms', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Housekeeping only cares about rooms that need action or are currently occupied
            const filteredRooms = data.filter(r => r.status === 'Occupied' || r.status === 'Maintenance');
            setRooms(filteredRooms);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch rooms.');
        } finally {
            setLoading(false);
        }
    };

    // --- Update room status ---
    const handleUpdateStatus = async (roomId, newStatus) => {
        // Find the specific room to get its current status before prompting
        const room = rooms.find(r => r._id === roomId);
        if (!room) return; // Should not happen

        // Use the selected pending status or default to current status if none selected yet
        const statusToSet = newStatus || room.status; 
        
        if (!window.confirm(`Set Room ${room.roomNumber} status to '${statusToSet}'?`)) return;

        try {
            setStatusUpdating(roomId);
            const body = { status: statusToSet };
            
            await axios.put(
                `http://localhost:5000/api/housekeeping/rooms/${roomId}/status`,
                body,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state immediately
            setRooms(prevRooms => prevRooms.map(r => 
                r._id === roomId ? { ...r, status: statusToSet, pendingStatus: undefined } : r // Clear pendingStatus
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setStatusUpdating(null);
        }
    };

    // --- Handle Select Change (Store Pending Status) ---
    const handleSelectChange = (roomId, newStatus) => {
        setRooms(prevRooms => prevRooms.map(room =>
            room._id === roomId ? { ...room, pendingStatus: newStatus } : room
        ));
    };


    // Load rooms on mount
    useEffect(() => {
        fetchRooms();
    }, []);


    if (loading) return <div className="p-8 text-center dark:text-gray-300">Loading rooms...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Housekeeping Status</h1>
            
            {rooms.length === 0 ? (
                <Card className="dark:bg-gray-700 dark:border-gray-600"><CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">No rooms currently require service.</CardContent></Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <Card key={room._id} className={`shadow-md dark:bg-gray-700 ${room.status === 'Maintenance' ? 'border-yellow-500 border-2 dark:border-yellow-400' : 'border-gray-200 dark:border-gray-600'}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-extrabold flex items-center gap-2 dark:text-white">
                                    <BedDouble className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Room {room.roomNumber}
                                </CardTitle>
                                <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    room.status === 'Available' ? 'bg-green-100 text-green-700' :
                                    room.status === 'Occupied' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {room.status}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Type: {room.type}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Price: ${room.pricePerNight?.toFixed(2)}</p>
                                </div>
                                <div className="space-y-2">
                                    {/* --- THIS LABEL IS NOW CORRECTLY IMPORTED --- */}
                                    <Label htmlFor={`status-${room._id}`} className="text-sm font-medium dark:text-gray-200">Update Status</Label>
                                    <Select 
                                        defaultValue={room.status}
                                        // Update pendingStatus state on change
                                        onValueChange={(newStatus) => handleSelectChange(room._id, newStatus)} 
                                        disabled={statusUpdating === room._id} // Disable select while saving
                                    >
                                        <SelectTrigger id={`status-${room._id}`} className="dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                            <SelectValue placeholder="Select New Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available" className="text-green-600">Available (Clean)</SelectItem>
                                            <SelectItem value="Maintenance" className="text-yellow-600">Maintenance (Needs Cleaning)</SelectItem>
                                            {/* Optionally allow setting back to Occupied if needed, though unusual */}
                                            {/* <SelectItem value="Occupied" className="text-red-600">Occupied</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    onClick={() => handleUpdateStatus(room._id, room.pendingStatus)} // Pass the pending status
                                    disabled={statusUpdating === room._id || !room.pendingStatus || room.pendingStatus === room.status} // Disable if no change or saving
                                    className="w-full"
                                >
                                    {statusUpdating === room._id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : 'Save Status'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HousekeepingPage;