import { io } from "socket.io-client";

// Connect to your server's Socket.IO instance
const socket = io("http://localhost:4000"); // Replace 4000 with your backend port

// Join the room (replace ROOM_ID with the actual room ID you want to test)
const ROOM_ID = "replace_with_user_id_or_room_id";
socket.emit("join", ROOM_ID);

// Listen for notifications
socket.on("newNotification", (data) => {
  console.log("New Notification:", data);
});

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
