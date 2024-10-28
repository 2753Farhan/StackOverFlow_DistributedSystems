import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function OwnPosts() {
  const [ownPosts, setOwnPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnPosts = async () => {
      try {
        const { data } = await api.get('/post/posts/own');
        setOwnPosts(data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch own posts", error);
      }
    };
    fetchOwnPosts();
  }, []);

  const deletePost = async (postId) => {
    try {
      await api.delete(`/post/post/${postId}`);
      setOwnPosts(ownPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-medium mb-4">Your Posts</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="list-none space-y-4">
          {ownPosts.map(post => (
            <li key={post._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-700">{post.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50"
                >
                  Delete
                </button>
                <Link
                  to={`/post/my/${post._id}`}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OwnPosts;