import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock, Loader2, FileText } from 'lucide-react'; 
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns'; 

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'PP'); // Format like 'Oct 27, 2025'
    } catch (e) {
        return 'Invalid Date';
    }
}

const ReceptionDesk = () => {
    const [searchId, setSearchId] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [invoiceAmount, setInvoiceAmount] = useState(0); 
    const [invoiceId, setInvoiceId] = useState(null); 
    const [isSearching, setIsSearching] = useState(false);
    const [message, setMessage] = useState(null); 
    const [searchError, setSearchError] = useState(null); 

    const token = localStorage.getItem('userToken');

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Confirmed': return 'default';
            case 'Active': return 'secondary';
            case 'Completed': return 'outline';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    }

    // --- Fetch Booking Details Logic ---
    const fetchBookingDetails = async (id) => {
        setBookingDetails(null);
        setInvoiceStatus(null);
        setInvoiceAmount(0);
        setInvoiceId(null);
        setMessage(null);
        setSearchError(null); 
        setIsSearching(true);

        const trimmedId = id?.trim(); 
        if (!trimmedId) {
             setSearchError('Please enter a valid Booking ID.');
             setIsSearching(false);
             return;
        }

        let bookingData = null;

        try {
            // 1. Fetch booking details
            const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${trimmedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            bookingData = bookingResponse.data;
            setBookingDetails(bookingData); 

            // 2. Fetch invoice status 
            try {
                const invoiceResponse = await axios.get(`http://localhost:5000/api/invoices/booking/${trimmedId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInvoiceStatus(invoiceResponse.data.status);
                setInvoiceAmount(invoiceResponse.data.amount || 0);
                setInvoiceId(invoiceResponse.data.invoiceId || null);
            } catch (invoiceErr) {
                if (invoiceErr.response?.status === 404 || invoiceErr.response?.data?.status === 'N/A') {
                    setInvoiceStatus('N/A'); // Treat Invoice Not Found as N/A status
                } else {
                    setSearchError("Booking found, but could not retrieve invoice details."); 
                }
            }

        } catch (err) {
            if (err.response?.status === 404) {
                 setSearchError(`Booking with ID '${trimmedId}' not found.`);
            } else {
                 setSearchError(err.response?.data?.message || 'Error fetching booking details.');
            }
            setBookingDetails(null); 
        } finally {
            setIsSearching(false);
        }
    };

    // --- Check-In Logic ---
    const handleCheckIn = async () => {
        if (!bookingDetails) return;
        setMessage(null); 
        let currentInvoiceId = invoiceId; 

        try {
            // Generate Invoice if needed
            if (invoiceStatus === 'N/A') {
                setMessage({ type: 'info', text: 'Generating invoice automatically...' });
                const { data: newInvoice } = await axios.post('http://localhost:5000/api/invoices', 
                    { bookingId: bookingDetails._id }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                currentInvoiceId = newInvoice._id; 
                setMessage({ type: 'info', text: `Invoice ${currentInvoiceId} generated. Proceeding...` });
            }
            
            // Perform Check-In
            await axios.post('http://localhost:5000/api/reception/checkin', 
                { bookingId: bookingDetails._id }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: `Check-in successful for Booking ${bookingDetails._id}` });
            fetchBookingDetails(bookingDetails._id); 

        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed.' });
        }
    };

    // --- Record Payment Logic ---
    const handleRecordPayment = async () => {
        if (!invoiceId || invoiceStatus === 'Paid') return;
        
        const paymentMethod = prompt("Enter Payment Method (Cash, Credit Card, Debit Card, UPI/Online):", "Credit Card");
        if (!paymentMethod) return; 

        setMessage(null);
        try {
             await axios.post(`http://localhost:5000/api/invoices/${invoiceId}/pay`, 
                { amount: invoiceAmount, method: paymentMethod }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: `Payment recorded for Invoice ${invoiceId}` });
            fetchBookingDetails(bookingDetails._id); 
        } catch(err) {
             setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to record payment.' });
        }
    };

    // --- Check-Out Logic ---
    const handleCheckOut = async () => {
        if (!bookingDetails) return;
        setMessage(null); 
        try {
            await axios.post('http://localhost:5000/api/reception/checkout', { bookingId: bookingDetails._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: `Check-out successful for Booking ${bookingDetails._id}. Rooms marked for maintenance.` });
            fetchBookingDetails(bookingDetails._id); 
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed. Ensure invoice is paid.' });
        }
    };

    const isCheckInAllowed = bookingDetails && bookingDetails.status === 'Confirmed';
    const isCheckOutAllowed = bookingDetails && bookingDetails.status === 'Active' && invoiceStatus === 'Paid';

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reception Desk</h1>
            
            {/* --- CORRECTED MESSAGE DISPLAY --- */}
            {message && (
                <div className={`p-4 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 
                    message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' // Info
                    }`}>
                    {message.text}
                </div>
            )}
            {/* ------------------------------- */}
            {searchError && <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">{searchError}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Check-In Card */}
                <Card className="shadow-lg dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2 dark:text-white"><Check className="h-5 w-5 text-green-600 dark:text-green-400" /> Guest Check-In</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Enter Booking ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                            <Button onClick={() => fetchBookingDetails(searchId)} disabled={isSearching}>
                                {isSearching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : 'Find Booking'}
                            </Button>
                        </div>

                        {bookingDetails && (
                            <div className="border dark:border-gray-500 rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-lg dark:text-white">{bookingDetails.user?.name || 'Guest'}</h3>
                                <p className="dark:text-gray-300"><strong>Rooms:</strong> {bookingDetails.rooms?.map(r => r.roomNumber).join(', ')} ({bookingDetails.rooms?.map(r => r.type).join(', ')})</p>
                                <p className="dark:text-gray-300"><strong>Dates:</strong> {formatDate(bookingDetails.checkInDate)} to {formatDate(bookingDetails.checkOutDate)}</p>
                                <p className="dark:text-gray-300"><strong>Status:</strong> <Badge variant={getStatusVariant(bookingDetails.status)}>{bookingDetails.status}</Badge></p>
                                <p className="dark:text-gray-300"><strong>Payment:</strong> 
                                     <Badge variant={invoiceStatus === 'Paid' ? 'secondary' : invoiceStatus === 'N/A' ? 'outline' : 'destructive'}>
                                         {invoiceStatus || 'Error'}
                                     </Badge>
                                     {invoiceStatus === 'Pending' && ` ($${invoiceAmount.toFixed(2)})`}
                                 </p>
                            </div>
                        )}
                        
                        <Button
                            onClick={handleCheckIn}
                            disabled={!isCheckInAllowed || isSearching} 
                            className="w-full bg-green-600 hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600"
                        >
                            Check-In Guest
                        </Button>
                        {!isCheckInAllowed && bookingDetails && bookingDetails.status !== 'Confirmed' && (
                            <p className="text-sm text-center text-red-500 dark:text-red-400">Booking status must be 'Confirmed' to check in.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Check-Out Card */}
                <Card className="shadow-lg dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2 dark:text-white"><X className="h-5 w-5 text-red-600 dark:text-red-400" /> Guest Check-Out</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">First, search the booking using the panel on the left.</p>
                        
                        {bookingDetails && (
                            <div className="border dark:border-gray-500 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-600">
                                <h3 className="font-semibold text-lg dark:text-white">{bookingDetails.user?.name || 'Guest'}</h3>
                                <p className="dark:text-gray-300"><strong>Total Due:</strong> ${invoiceAmount?.toFixed(2)}</p>
                                <p className="dark:text-gray-300"><strong>Payment Status:</strong> 
                                    <Badge variant={invoiceStatus === 'Paid' ? 'secondary' : invoiceStatus === 'N/A' ? 'outline' : 'destructive'}>
                                        {invoiceStatus || 'Error'}
                                    </Badge>
                                </p>
                                {/* Add Record Payment Button if Pending */}
                                {invoiceStatus === 'Pending' && (
                                     <Button 
                                         onClick={handleRecordPayment} 
                                         variant="outline" 
                                         size="sm" 
                                         className="ml-4 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
                                         disabled={isSearching}
                                     >
                                        Record Payment
                                    </Button>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">Room Status After Checkout: Maintenance</p>
                            </div>
                        )}

                        <Button
                            onClick={handleCheckOut}
                            disabled={!isCheckOutAllowed || isSearching} 
                            className="w-full bg-red-600 hover:bg-red-700 transition-colors dark:bg-red-500 dark:hover:bg-red-600"
                        >
                            Process Check-Out
                        </Button>
                        {!isCheckOutAllowed && bookingDetails && (
                            <p className="text-sm text-center text-red-500 dark:text-red-400">
                                { bookingDetails.status !== 'Active' ? "Booking must be 'Active'." : "Invoice must be 'Paid'." }
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReceptionDesk;

// --- Helper to format date ---
// function formatDate(dateString) { // Function definition moved to top
//     if (!dateString) return 'N/A';
//     try {
//         return format(new Date(dateString), 'PP'); // e.g., Oct 27, 2025
//     } catch (e) {
//         return 'Invalid Date';
//     }
// }