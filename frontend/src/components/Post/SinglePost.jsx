// SinglePost.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`post/post/my/${id}`);
        console.log("Fetched post data:", data.post); // Debug log
        setPost(data.post);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [id]);

  const fetchFileContent = async () => {
    try {
      const response = await api.get(`/post/downloadfile/${id}`, {
        responseType: 'text',
      });
      console.log(response.data); // Check if file content is retrieved
      setFileContent(response.data);
    } catch (error) {
      console.error("Failed to fetch file content", error);
    }
  };
  
  const downloadFile = async () => {
    try {
      const response = await api.get(`/post/downloadfile/${id}`, { responseType: 'blob' });
  
      // Extract filename from response headers (if available)
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.trim();
  
      // Use the filename from the backend API if it's available
      const finalFilename = filename || post.fileurl.split('/').pop();
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;   
   // Use the extracted or default filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download file", error);
    }
  };
  return loading ? (
    <div className="text-center mt-20 text-xl">Loading...</div>
  ) : (
    <div className="max-w-lg mx-auto my-8 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h2>
      <p className="mb-4 text-gray-600">{post.description}</p>
      {/* {post.codesnippet && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800">Code Snippet:</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{post.codesnippet}</pre>
        </div>
      )} */}
      {fileContent ? (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-800">Code Snippet:</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{fileContent}</pre>
        </div>
      ) : (
        <div className='flex'>
          <button 
            onClick={fetchFileContent} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
            Show the code
          </button>

          <button onClick={() => downloadFile()}  className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200'>Download File</button>
        </div>
        
      )}
    </div>
  );
}

export default SinglePost;
