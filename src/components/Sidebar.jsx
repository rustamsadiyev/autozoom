import React from "react";
import { NavLink } from "react-router-dom";
import { FaCog, FaHome, FaBuilding, FaCity, FaMapMarkedAlt, FaBox } from "react-icons/fa"; // Example icons

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-4 text-lg font-semibold">UzloyalAdmin</div>

      <nav className="mt-4">
        {/* Dashboard */}
        <NavLink
          to="/home/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaHome className="mr-3" /> Categories
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/home/settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaCog className="mr-3" /> Faqs
        </NavLink>

        {/* Brands */}
        <NavLink
          to="/home/brands"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaBuilding className="mr-3" /> News
        </NavLink>

        {/* Models */}
        <NavLink
          to="/home/models"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaBox className="mr-3" /> Blogs
        </NavLink>

        {/* Locations */}
        <NavLink
          to="/home/locations"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaMapMarkedAlt className="mr-3" /> Services
        </NavLink>

        {/* Cities */}
        <NavLink
          to="/home/cities"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm ${
              isActive ? "bg-blue-600" : "hover:bg-blue-700"
            }`
          }
        >
          <FaCity className="mr-3" /> Sources
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
