import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your backend URL if needed

socket.on("connect", () => {
  console.log("Connected to Socket.IO server with ID:", socket.id);
});

// Listen for notifications
socket.on("receiveNotification", (notification) => {
  console.log("New Notification:", notification);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
