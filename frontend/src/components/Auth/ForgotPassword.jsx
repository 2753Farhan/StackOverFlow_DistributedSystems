import React, { useState, useContext } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { isAuthorized } = useContext(Context);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      toast.success(data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={'/'} />;
  }

  return (
    <>
      <section className="">
        <div className="">
          <div className="">
            <img src="/Logo.png" alt="logo" />
            <h3>Forgot Password</h3>
          </div>
          <form onSubmit={handleForgotPassword}>
            <div className="">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <button type="submit">
              Send Reset Link
            </button>
            <Link to={"/login"}>Back to Login</Link>
          </form>
        </div>
        <div className="">
          <img src="/login.png" alt="forgot password" />
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
