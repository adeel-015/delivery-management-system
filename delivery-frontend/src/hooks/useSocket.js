import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
export default function useSocket() {
    const { token } = useAuth();
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if (!token)
            return;
        const base = import.meta.env?.VITE_API_URL || "http://localhost:5001";
        const socket = io(base, { query: { token } });
        socketRef.current = socket;
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token]);
    return { socket: socketRef.current, connected };
}
