import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  // Do not render Navbar if not authenticated
  if (!isAuthorized) {
    return null;
  }

  return (
    <nav className="bg-slate-400 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="">
          <img src="/Logo.png" alt="logo" className="w-52 h-36" />
        </div>

        {/* Menu Links - hidden on small screens */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link
              to={"/"}
              onClick={() => setShow(false)}
              className="hover:text-gray-300"
            >
              HOME
            </Link>
          </li>

          {/* Logout Button */}
          {isAuthorized && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                LOGOUT
              </button>
            </li>
          )}
        </ul>

        {/* Hamburger Menu Icon - only visible on mobile */}
        <div className="md:hidden">
          <GiHamburgerMenu
            onClick={() => setShow(!show)}
            className="text-2xl cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Menu - only visible when 'show' is true */}
      <div
        className={`md:hidden transition-all duration-300 ${
          show ? "block" : "hidden"
        } bg-gray-700 text-white`}
      >
        <ul className="space-y-4 py-4">
          <li>
            <Link
              to={"/"}
              onClick={() => setShow(false)}
              className="block px-4 py-2 hover:bg-gray-600"
            >
              HOME
            </Link>
          </li>

          {isAuthorized && (
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                LOGOUT
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
