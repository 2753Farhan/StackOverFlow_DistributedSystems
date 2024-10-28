import React, { useContext } from "react";
import { Context } from "../../main";
import { Navigate, Link } from "react-router-dom";

const Home = () => {
  const { isAuthorized, user } = useContext(Context);
  
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome {user.name}</h1>
        {/* <nav className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/create-post" className="hover:text-gray-300">Create Post</Link>
          <Link to="/notifications" className="hover:text-gray-300">Notifications</Link>
        </nav> */}
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 py-8 px-4 lg:px-0">
        
        {/* Post List Section */}
        <section className="lg:w-2/3 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Posts</h2>
          <Link to="/posts" className="text-blue-500 hover:underline">View All Posts</Link>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">Other Posts</h2>
          <Link to="/posts/others" className="text-blue-500 hover:underline">View Other Users' Posts</Link>
        </section>

        {/* Sidebar: Create Post and Notifications */}
        <aside className="lg:w-1/3 space-y-8">
          {/* Create Post Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Post</h2>
            <Link to="/create-post" className="text-blue-500 hover:underline">Create a Post</Link>
          </section>

          {/* Notifications Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            <Link to="/notifications" className="text-blue-500 hover:underline">View Notifications</Link>
          </section>
        </aside>
      </main>

     
    </div>
  );
};

export default Home;
