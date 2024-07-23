import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to the WebSocket server!");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the WebSocket server.");
});

socket.on("connect_error", (err) => {
  console.log("Connection error: ", err);
});
export default socket;
