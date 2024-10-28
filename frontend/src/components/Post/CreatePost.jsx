import React, { useState } from 'react';
import api from '../utils/api';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState('file');
  const [file, setFile] = useState(null);
  const [codesnippet, setCodesnippet] = useState('');
  const [snippetFileType, setSnippetFileType] = useState('js');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Reset success message on form submit

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('uploadType', uploadType);

    if (uploadType === 'file' && file) {
      formData.append('file', file);
    } else if (uploadType === 'snippet') {
      formData.append('codesnippet', codesnippet);
      formData.append('snippetFileType', snippetFileType);
    }

    try {
      await api.post('/post/post', formData);
      // Clear the input fields
      setTitle('');
      setDescription('');
      setFile(null);
      setCodesnippet('');
      setSnippetFileType('js');
      // Set success message
      setSuccessMessage("Your post was successfully created!");
    } catch (error) {
      setError("Error creating post");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-medium mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>} {/* Display success message */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 border rounded h-32 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        <select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="file">File</option>
          <option value="snippet">Snippet</option>
        </select>

        {uploadType === 'file' ? (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        ) : (
          <div className="flex flex-col space-y-2">
            <select
              value={snippetFileType}
              onChange={(e) => setSnippetFileType(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              {['js', 'py', 'java', 'cpp', 'txt', 'html', 'css', 'json'].map((ext) => (
                <option key={ext} value={ext}>{ext.toUpperCase()}</option>
              ))}
            </select>
            <textarea
              value={codesnippet}
              onChange={(e) => setCodesnippet(e.target.value)}
              placeholder="Enter your code here"
              className="w-full p-2 border rounded h-32 font-mono focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        )}

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;