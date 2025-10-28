import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- 1. Define API_BASE_URL (for future API expansions if needed) ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// -------------------------------------------------------------------

/**
 * Returns dynamic page content for Privacy, Terms, or Help pages.
 */
const getContent = (type) => {
  switch (type) {
    case "Privacy":
      return {
        title: "Privacy Policy",
        subtitle: "Last Updated: October 27, 2025",
        body: (
          <div className="space-y-6 leading-relaxed">
            <p>
              Welcome to <strong>Roomify</strong>. Your privacy is critically important to us. 
              This policy outlines how we collect, use, and protect your personal data collected via the application.
            </p>

            <h3 className="text-xl font-semibold mt-4">1. Information We Collect</h3>
            <p>
              We collect <strong>Personally Identifiable Information (PII)</strong> such as your Name, 
              Email, Contact Number, and Payment details only for processing bookings and billing, 
              as defined in our Software Requirements Specification (SRS).
            </p>

            <h3 className="text-xl font-semibold mt-4">2. Data Usage and Security</h3>
            <p>
              Your data is stored securely in our <strong>MongoDB</strong> database and protected by
              industry-standard encryption (TLS/SSL). This information is used solely for booking, invoicing, 
              and check-in/out operations and is never shared externally, except when required by law or for 
              secure payment processing.
            </p>

            <h3 className="text-xl font-semibold mt-4">3. Data Retention (SRS 5.5)</h3>
            <p>
              Booking and payment records are retained for a minimum of <strong>5 years</strong> to meet compliance 
              and reporting requirements, after which they are securely archived or anonymized.
            </p>
          </div>
        ),
      };

    case "Terms":
      return {
        title: "Terms of Use",
        subtitle: "Governing the use of Roomify Software",
        body: (
          <div className="space-y-6 leading-relaxed">
            <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
            <p>
              By using the <strong>Roomify Hotel Management System</strong>, you agree to these Terms. 
              If you are using the system on behalf of an organization, you represent that you are authorized 
              to bind that organization.
            </p>

            <h3 className="text-xl font-semibold mt-4">2. Role-Based Access</h3>
            <p>
              Access and functionality are determined by your assigned user role 
              (<strong>Admin, Receptionist, Housekeeping, Guest</strong>). Any attempt to bypass 
              <strong> Role-Based Access Control (RBAC)</strong> is prohibited and may lead to account termination.
            </p>

            <h3 className="text-xl font-semibold mt-4">3. Booking and Cancellation Policy</h3>
            <p>
              All bookings require at least a <strong>30% advance payment</strong> to confirm. 
              Cancellations follow the hotel's policy configured in the Admin Settings. Unauthorized 
              modifications or misuse of the booking feature are strictly forbidden.
            </p>
          </div>
        ),
      };

    case "Help":
    default:
      return {
        title: "Help & Support Center",
        subtitle: "Getting started with Roomify",
        body: (
          <div className="space-y-6 leading-relaxed">
            <h3 className="text-xl font-semibold">Staff Guides</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Login/Logout:</strong> Accessible via the top-right corner of the app.</li>
              <li><strong>Admin:</strong> Use the Dashboard to monitor KPIs and manage user roles.</li>
              <li><strong>Receptionist:</strong> Use the Reception Desk for check-in/check-out actions.</li>
              <li><strong>Housekeeping:</strong> Use the Housekeeping page to update room statuses.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">API & Technical Details</h3>
            <p>
              Roomify is built using a secure <strong>MERN Stack</strong> architecture. 
              All communication is encrypted with <strong>HTTPS</strong>, and authentication uses 
              <strong> JSON Web Tokens (JWT)</strong> for secure user verification.
            </p>
          </div>
        ),
      };
  }
};

/**
 * Main LegalPage Component
 */
const LegalPage = ({ type }) => {
  const navigate = useNavigate();
  const content = getContent(type);

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {/* Content card */}
        <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold dark:text-white">
              {content.title}
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {content.subtitle}
            </CardDescription>
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
