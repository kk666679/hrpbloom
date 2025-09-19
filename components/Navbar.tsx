"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  useEffect(() => {
    // Check local storage for the user's preference on page load
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Save the dark mode preference to localStorage
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <nav className={`p-4 shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-semibold flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="https://oq1gkkfo4q0hj5xi.public.blob.vercel-storage.com/images/Sleek%20Flat%20Design%20Logo%20in%20Blue%20and%20Green_20250918_023037_0000.svg" alt="Company Logo" className="w-10 h-10" />
          <span>MyCompany</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="/" className="hover:text-gray-400">
            Home
          </a>
          <a href="/features" className="hover:text-gray-400">
            Features
          </a>
          <a href="/services" className="hover:text-gray-400">
            Services
          </a>
          <a href="/jobs" className="hover:text-gray-400">
            Jobs
          </a>
          <a href="/about" className="hover:text-gray-400">
            About
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-xl">
            {darkMode ? "🌙" : "☀️"}
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-lg"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>

        {/* Sign Up / Login Buttons */}
        <div className="hidden md:flex space-x-4">
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
          <button
            className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-gray-400 transition duration-300"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};
