import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getOrders, moveToNextStage, deleteOrder } from '../services/api';
import useSocket from '../hooks/useSocket';
import OrdersTable from '../components/Seller/OrdersTable';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
export default function SellerDashboard() {
    const { socket } = useSocket();
    const auth = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetch = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            setOrders(res.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetch(); }, []);
    useEffect(() => {
        if (!socket)
            return;
        const upd = (data) => { fetch(); };
        socket.on('order_updated', upd);
        socket.on('order_created', upd);
        socket.on('order_deleted', upd);
        socket.on('seller_assigned', upd);
        return () => {
            socket.off('order_updated');
            socket.off('order_created');
            socket.off('order_deleted');
            socket.off('seller_assigned');
        };
    }, [socket]);
    const handleNext = async (id) => {
        try {
            await moveToNextStage(id);
            fetch();
        }
        catch (err) {
            alert('Failed to advance stage');
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Delete this order? This action cannot be undone.'))
            return;
        try {
            await deleteOrder(id);
            fetch();
        }
        catch (err) {
            alert('Failed to delete order');
        }
    };
    const handleMarkNotDelivered = async (id) => {
        if (!confirm('Mark this order as not delivered? This will move it back to "Out for Delivery" stage.'))
            return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/orders/${id}/not-delivered`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Order marked as not delivered');
            fetch();
        }
        catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Failed to mark as not delivered');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-6", children: [_jsxs("header", { className: "flex justify-between items-center mb-6 bg-white rounded-lg shadow-md px-6 py-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Seller Dashboard" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage your assigned orders" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-gray-700 font-medium", children: auth.user?.name }), _jsx("button", { onClick: () => auth.logout(), className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors", children: "Logout" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-4 mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "My Orders" }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["Total: ", orders.length, " orders"] })] }), loading ? (_jsx("div", { className: "flex items-center justify-center py-12 bg-white rounded-lg shadow-md", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) })) : (_jsx(OrdersTable, { orders: orders, onMoveToNextStage: handleNext, onDelete: handleDelete, onMarkNotDelivered: handleMarkNotDelivered }))] }));
}
