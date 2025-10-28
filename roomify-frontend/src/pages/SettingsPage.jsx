import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Database, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider'; 

const SettingsPage = () => {
    // --- SIMPLIFIED THEME HOOK USAGE ---
    const { theme, setTheme } = useTheme(); // No safety check needed now
    
    // Business Rule States (Mock for now)
    const [checkInTime, setCheckInTime] = useState('12:00 PM');
    const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
    const [cancellationFee, setCancellationFee] = useState('30');
    const [apiKey, setApiKey] = useState('********************');

    const handleSave = (e) => {
        e.preventDefault();
        alert(`Settings Saved!\nCheck-in: ${checkInTime}\nFee: ${cancellationFee}%`);
    };

    const SystemStatusCard = ({ title, status, icon: Icon, color }) => (
        <Card className="flex items-center p-4 shadow-sm dark:bg-gray-700 dark:border-gray-600">
            <Icon className={`h-8 w-8 mr-4 ${color}`} />
            <div>
                <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
                <CardDescription className={`font-semibold ${status === 'Connected' || status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {status}
                </CardDescription>
            </div>
        </Card>
    );
    
    return (
        // Added dark mode classes for page background
        <div className="p-8 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">System Settings</h1>

            <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="business">Business Rules</TabsTrigger>
                    <TabsTrigger value="security">Security & Theme</TabsTrigger>
                </TabsList>
                
                <TabsContent value="business">
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Business Rules</CardTitle>
                            <CardDescription>Configure core operating policies (BR-3, BR-2).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="checkIn" className="dark:text-gray-200">Standard Check-in Time (BR-3)</Label>
                                        <Input id="checkIn" type="text" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="checkOut" className="dark:text-gray-200">Standard Check-out Time (BR-3)</Label>
                                        <Input id="checkOut" type="text" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fee" className="dark:text-gray-200">Cancellation Fee (%) (BR-2)</Label>
                                    <Input id="fee" type="number" min="0" max="100" value={cancellationFee} onChange={(e) => setCancellationFee(e.target.value)} className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                </div>
                                
                                <Button type="submit">Save Business Rules</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Security & Theme</CardTitle>
                            <CardDescription>Manage theme preference and integration keys.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {/* --- DARK MODE TOGGLE (FUNCTIONAL) --- */}
                            <div className="flex items-center space-x-4 pt-4">
                                <Label className="dark:text-gray-200">Theme</Label>
                                {/* Removed disabled prop */}
                                <Select value={theme} onValueChange={setTheme}> 
                                    <SelectTrigger className="w-[180px] dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                        <SelectValue placeholder="Select Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* --- SYSTEM STATUS DISPLAY --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <SystemStatusCard 
                                    title="Backend API"
                                    status="Online"
                                    icon={Server}
                                    color="text-blue-600"
                                />
                                <SystemStatusCard 
                                    title="MongoDB"
                                    status="Connected"
                                    icon={Database}
                                    color="text-indigo-600"
                                />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="api-key" className="dark:text-gray-200">Payment Gateway API Key</Label>
                                <Input id="api-key" type="password" value={apiKey} disabled className="dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Integration status: Mocked (Backend dependency fulfilled)</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;