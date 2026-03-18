import http from "http";
import { Server } from "socket.io";

const server = http.createServer();

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://kuned.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("registerUser", (userId: string) => {

  onlineUsers.set(userId, socket.id);

  io.emit("userOnline", { userId });

});

  socket.on("joinConversation", (conversationId: string) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", ({ conversationId, message, receiverId }) => {

  const receiverSocket = onlineUsers.get(receiverId);

  if (receiverSocket) {

    io.to(receiverSocket).emit("newMessage", message);

    socket.emit("messageDelivered", {
      messageId: message._id
    });

  } else {

    socket.to(conversationId).emit("newMessage", message);

  }

});





  socket.on("messagesSeen", ({ conversationId }) => {

    io.to(conversationId).emit("messagesSeen", { conversationId });

  });

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

});

server.listen(4000, () => {
  console.log("Socket server running on port 4000");
});