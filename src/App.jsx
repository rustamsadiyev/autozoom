import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Brands from "./components/Brands";
import Cities from "./components/Cities";
import Models from "./components/Models";
import Cars from "./components/Cars";
import Locations from "./components/Locations";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setIsAuth(data.success);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        
        {/* Home layout with nested routes */}
        <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brands" element={<Brands />} />
          <Route path="settings" element={<Settings />} />
          <Route path="models" element={<Models />} />
          <Route path="cities" element={<Cities />} />
          <Route path="locations" element={<Locations />} />
          <Route path="cars" element={<Cars />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
