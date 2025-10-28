import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"; // Assuming you have this installed

const Footer = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();
  
  // Determine if the user is logged in (to change internal links)
  const token = localStorage.getItem('userToken');
  const basePath = token ? '/dashboard' : '/login'; // Default links change if logged in

  const footerLinks = [
    { name: "Privacy Policy", href: "/policy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Help Center", href: "/help" },
    { name: "Admin Login", href: "/login" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-auto w-full">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          {footerLinks.map((item) => (
            // Use Link for internal navigation, ensuring smooth transitions
            <Link 
              key={item.name} 
              to={item.href} 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Separator className="my-4 dark:bg-gray-700" />
        
        {/* Copyright and Name */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {currentYear} Roomify. All rights reserved. Developed by Shrey Dedhia & Megh Doshi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;