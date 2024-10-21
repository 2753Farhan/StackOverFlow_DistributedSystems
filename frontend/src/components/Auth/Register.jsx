import React, { useContext, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { setIsAuthorized } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, email, password },
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
      setRedirectToLogin(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <section
        className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
       // Set background image here
      >
        <div className="bg-white bg-opacity-90 shadow-lg rounded-lg w-11/12 md:w-8/12 lg:w-6/12 p-10 flex flex-col items-center "  style={{ backgroundImage: "url(/reg.jpg)" }}>
          <div className="w-full">
            <div className="flex justify-center mb-6">
              <img src="/Logo.png" alt="logo" className="w-56 h-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Create a new account
            </h3>
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-gray-500 font-medium">
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
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
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

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-300 font-semibold text-lg"
              >
                Register
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <Link to={"/login"} className="text-blue-500 hover:underline">
                  Already have an account? Login Now
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
