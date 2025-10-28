import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // <-- ADDED BUTTON IMPORT
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getContent = (type) => {
    switch (type) {
        case 'Privacy':
            return {
                title: "Privacy Policy",
                subtitle: "Last Updated: October 27, 2025",
                body: (
                    <div className="space-y-6">
                        <p>Welcome to Roomify. Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal data collected via the application.</p>
                        <h3 className="text-xl font-semibold mt-4">1. Information We Collect</h3>
                        <p>We collect **Personally Identifiable Information (PII)** such as Name, Email, Contact Number, and Payment details only for the purpose of processing bookings and billing, as defined in the Software Requirements Specification (SRS).</p>
                        <h3 className="text-xl font-semibold mt-4">2. Data Usage and Security</h3>
                        <p>Your data is stored securely in our **MongoDB** database and is protected by industry-standard encryption protocols (TLS/SSL). We use this information solely for internal operational purposes (booking, invoicing, check-in/out) and do not share it with external third parties, except as required by law or for secure payment processing.</p>
                        <h3 className="text-xl font-semibold mt-4">3. Data Retention (SRS 5.5)</h3>
                        <p>Guest booking and payment records are retained for a minimum of **5 years** to meet compliance and reporting requirements, after which they are securely archived or anonymized.</p>
                    </div>
                )
            };
        case 'Terms':
            return {
                title: "Terms of Use",
                subtitle: "Governing the use of Roomify Software",
                body: (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
                        <p>By accessing or using the Roomify Hotel Management System, you agree to be bound by these Terms. If you are using the system on behalf of an organization, you represent that you have the authority to bind that organization to these terms.</p>
                        <h3 className="text-xl font-semibold mt-4">2. Role-Based Access</h3>
                        <p>Access and functionality are strictly controlled by your assigned user role (**Admin, Receptionist, Housekeeping, Guest**). Any attempt to bypass the **Role-Based Access Control (RBAC)** is prohibited and may result in the termination of your account.</p>
                        <h3 className="text-xl font-semibold mt-4">3. Booking and Cancellation Policy</h3>
                        <p>All bookings require a minimum **30% advance payment** to confirm the room. Cancellations are subject to the hotel's cancellation policy (configured in Admin Settings). Unauthorized modifications or misuse of the booking feature are strictly forbidden.</p>
                    </div>
                )
            };
        case 'Help':
        default:
            return {
                title: "Help & Support Center",
                subtitle: "Getting started with Roomify",
                body: (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">Staff Guides</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>**Login/Logout:** Accessible via the top right corner of the application.</li>
                            <li>**Admin:** Use the Dashboard to view KPIs and the Users page to manage staff roles.</li>
                            <li>**Receptionist:** Use the Reception Desk page for quick Check-In/Check-Out actions.</li>
                            <li>**Housekeeping:** Use the Housekeeping page to change room status from 'Maintenance' to 'Available'.</li>
                        </ul>
                        <h3 className="text-xl font-semibold mt-4">API & Technical Details</h3>
                        <p>Roomify uses a secured **MERN Stack** architecture. All communication is secured via **HTTPS** and authentication relies on **JSON Web Tokens (JWT)**.</p>
                    </div>
                )
            };
    }
};


const LegalPage = ({ type }) => {
    const navigate = useNavigate();
    const content = getContent(type);

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-800">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center text-blue-600 dark:text-blue-400">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Card className="shadow-lg dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-3xl dark:text-white">{content.title}</CardTitle>
                        <CardDescription>{content.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="dark:text-gray-200">
                        {content.body}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LegalPage;