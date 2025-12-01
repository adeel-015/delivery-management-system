import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    try {
      const token = socket.handshake.query?.token as string | undefined;
      if (token) {
        const payload: any = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );
        const userId = payload.userId;
        const role = payload.role;
        socket.join(`user-${userId}`);
        if (role === "admin") socket.join("admin-room");
        if (role === "seller") socket.join("seller-room");
      }
    } catch (err) {
      // ignore, allow unauthenticated sockets
    }

    socket.on("disconnect", () => {
      // cleanup if needed
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function emitToRooms(event: string, data: any, rooms: string[]) {
  if (!io) return;
  rooms.forEach((r) => io!.to(r).emit(event, data));
}
