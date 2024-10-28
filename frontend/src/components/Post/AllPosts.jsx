import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function AllPosts() {
  const [AllPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherPosts = async () => {
      try {
        const { data } = await api.get('/post');
        setAllPosts(data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch other posts", error);
      }
    };
    fetchOtherPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-medium mb-4">All Posts</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="list-none space-y-4">
          {otherPosts.map(post => (
            <li key={post._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-700">{post.description}</p>
              </div>
              <Link
                to={`/post/${post._id}`}
                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllPosts;