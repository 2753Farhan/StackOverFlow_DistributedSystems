import React, { useEffect, useState } from 'react';
import { BellIcon, XCircleIcon } from '@heroicons/react/24/solid';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.notifications);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    
    <div className="max-w-lg mx-auto mt-8">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications available</p>
      ) : (
        notifications.map((notification) => (
          <Link
                to={`/post/others/${notification.post._id}`}
              >
                <div
            key={notification._id}
            className="flex items-start p-4 mb-4 bg-white shadow rounded-lg border border-gray-200"
          >
            <BellIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div className="flex-grow">
              <div className="flex justify-between">
                <p className="text-gray-700 font-semibold">
                  {notification.type === 'new_post' ? 'New Post' : 'Notification'}
                </p>
                {/* <span
                  className={`text-xs px-2 py-1 rounded ${
                    notification.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {notification.read ? 'Read' : 'Unread'}
                </span> */}
              </div>
              <p className="text-sm text-gray-600">From: {notification.sender.name}</p>
              <p className="text-sm text-gray-600">Post Title: {notification.post.title}</p>
              <p className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteNotification(notification._id)}
              className="ml-3 text-gray-400 hover:text-red-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

              </Link>
                  ))
      )}
    </div>
  );
}

export default Notifications;
