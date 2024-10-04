import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
// https://api.dezinfeksiyatashkent.uz/api/auth/signin
    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password,
        }),
      });

      const res = await response.json();

      if (res.success === true) {
        localStorage.setItem("token", res.data.tokens.accessToken.token);
        window.location.href= "/home"
      } else {
        console.log("Login failed:", res.message || "Unknown error");
        toast.error(res.message); 
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number" 
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
}

export default Login;
