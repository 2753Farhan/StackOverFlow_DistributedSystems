import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-11/12 md:w-8/12 lg:w-6/12">
          {/* Left section */}
          <div className="hidden md:block md:w-1/2">
            <img
              src="/register.png"
              alt="register"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          {/* Right section (Form) */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-8">
              <img
                src="/Logo.png"
                alt="logo"
                className="w-32 h-auto"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Create a new account
            </h3>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Register As
                </label>
                <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  >
                    <option value="">Select Role</option>
                    <option value="Employer">Admin</option>
                    <option value="Job Seeker">Normal User</option>
                  </select>
                  <FaRegUser className="text-gray-500 ml-2" />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                  <input
                    type="text"
                    placeholder="Zeeshan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                  <FaPencilAlt className="text-gray-500 ml-2" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                  <input
                    type="email"
                    placeholder="zk@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                  <MdOutlineMailOutline className="text-gray-500 ml-2" />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                  <input
                    type="number"
                    placeholder="12345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                  <FaPhoneFlip className="text-gray-500 ml-2" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <div className="flex items-center bg-gray-100 rounded-md px-4 py-2">
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                  <RiLock2Fill className="text-gray-500 ml-2" />
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
              >
                Register
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <Link to={"/login"} className="text-blue-500 hover:underline">
                  Login Now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
