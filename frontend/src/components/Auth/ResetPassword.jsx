import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/user/reset-password/${id}/${token}`, { password });
      if (res.data.Status === 'Success') {
        setMessage('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.data.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h4 className="text-lg font-semibold mb-4">Reset Password</h4>
        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
