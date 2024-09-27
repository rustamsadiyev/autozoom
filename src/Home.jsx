import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="fixed h-full">
        <Sidebar /> {/* Sidebar stays fixed on the left */}
      </div>
      <div className="content flex-grow p-4 ml-60"> {/* ml-60 to make space for the fixed Sidebar */}
        <Outlet /> {/* Dynamic content (Dashboard, Settings, etc.) will be rendered here */}
      </div>
    </div>
  );
};

export default Home;
