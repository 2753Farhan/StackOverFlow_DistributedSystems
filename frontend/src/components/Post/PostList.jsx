// PostList.js
import React from 'react';

export const PostList = ({ posts, deletePost, viewDetails }) => (
  <div>
    {posts.map(post => (
      <div key={post._id}>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        {deletePost && <button onClick={() => deletePost(post._id)}>Delete</button>}
        {viewDetails && <button onClick={() => viewDetails(post._id)}>View Details</button>}
      </div>
    ))}
  </div>
);
