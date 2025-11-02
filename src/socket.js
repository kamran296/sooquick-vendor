// socket.js
import { io } from "socket.io-client";
import { addNotification } from "./redux/slices/notificationSlice";
import { toast } from "react-toastify";

let socket;

export const connectSocket = (token) => {
  socket = io("http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("Connected to socket:", socket.id);
  });

  // Listen for notifications
  socket.on("newNotification", (notification) => {
    console.log("notification", notification);
    toast.success(`📩 ${notification.title}`);
    store.dispatch(addNotification(notification));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });

  return socket;
};

export const getSocket = () => socket;
