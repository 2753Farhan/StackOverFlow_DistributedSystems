import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import OwnPosts from "./components/Post/OwnPosts"; // Updated import
import OtherPosts from "./components/Post/OtherPosts"; // Updated import
import SinglePost from "./components/Post/SinglePost"; // Updated import
import CreatePost from "./components/Post/CreatePost";
import Notifications from "./components/Notifications/Notifications";
import SingleOtherPost from "./components/Post/SingleOtherPost";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          
          {/* New routes for posts */}
          <Route path="/posts/own" element={<OwnPosts />} />
          <Route path="/posts/others" element={<OtherPosts />} />
          <Route path="/post/my/:id" element={<SinglePost />} /> {/* For user's single post */}
          <Route path="/post/others/:id" element={<SingleOtherPost />} /> {/* For other's single post */}
          
          {/* Route to create a new post */}
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
