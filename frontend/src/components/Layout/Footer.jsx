import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);

  // Do not render Footer if not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <footer className="bg-slate-400 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link
            to={"https://www.facebook.com/profile.php?id=100030535123397"}
            target="_blank"
            className="hover:text-blue-500"
          >
            <FaFacebookF />
          </Link>
          <Link
            to={"https://www.youtube.com/@CodeWithZeeshu"}
            target="_blank"
            className="hover:text-red-500"
          >
            <FaYoutube />
          </Link>
          <Link
            to={"https://www.linkedin.com/in/zeeshu"}
            target="_blank"
            className="hover:text-blue-700"
          >
            <FaLinkedin />
          </Link>
          <Link
            to={"https://www.instagram.com/z_4_zeeshuuu/"}
            target="_blank"
            className="hover:text-pink-500"
          >
            <RiInstagramFill />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
