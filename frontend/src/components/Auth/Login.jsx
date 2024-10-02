import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
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
      <section className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6 bg-blue-950">
        {/* Login Form Section */}
<div className="w-full md:w-1/2 lg:w-1/3 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg relative z-10">
  <div className="text-center mb-6">
    <img src="/Logo.png" alt="logo" className="w-55 h-32 mx-auto mb-4" />
    <h3 className="text-2xl font-semibold text-gray-800">Login to your account</h3>
  </div>
  <form onSubmit={handleLogin} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Login As</label>
      <div className="relative mt-1">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="Employer">Admin</option>
          <option value="Job Seeker">Normal User</option>
        </select>
        <FaRegUser className="absolute right-3 top-3 text-gray-400" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email Address</label>
      <div className="relative mt-1">
        <input
          type="email"
          placeholder="zk@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MdOutlineMailOutline className="absolute right-3 top-3 text-gray-400" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <div className="relative mt-1">
        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <RiLock2Fill className="absolute right-3 top-3 text-gray-400" />
      </div>
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Login
    </button>
    <div className="flex justify-between text-sm text-gray-500">
      <Link to={"/forgot-password"} className="hover:text-blue-500">
        Forgot Password?
      </Link>
      <Link to={"/register"} className="hover:text-blue-500">
        Register Now
      </Link>
    </div>
  </form>
</div>

      </section>
    </>
  );
};

export default Login;
