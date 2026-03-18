import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function getIO(server?: HTTPServer): Server {

  if (!io) {

    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {

      console.log("User connected:", socket.id);

      socket.on("joinConversation", (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on(
        "sendMessage",
        ({
          conversationId,
          message
        }: {
          conversationId: string;
          message: unknown;
        }) => {

          socket.to(conversationId).emit("newMessage", message);

        }
      );

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });

    });

  }

  return io;
}