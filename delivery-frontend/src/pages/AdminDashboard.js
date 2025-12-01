import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getOrders, getStats, associateBuyer, assignSeller, getSellers, deleteOrderAdmin } from '../services/api';
import useSocket from '../hooks/useSocket';
import StatsCards from '../components/Admin/StatsCards';
import OrdersTable from '../components/Admin/OrdersTable';
import { useAuth } from '../context/AuthContext';
import AssociateBuyerModal from '../components/Admin/AssociateBuyerModal';
import OrderDetailsModal from '../components/Admin/OrderDetailsModal';
export default function AdminDashboard() {
    const { socket } = useSocket();
    const auth = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [associateOpen, setAssociateOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const fetchAll = async () => {
        try {
            const [oRes, sRes] = await Promise.all([getOrders(), getStats()]);
            setOrders(oRes.data);
            setStats(sRes.data);
        }
        catch (err) {
            console.error(err);
        }
    };
    useEffect(() => { fetchAll(); }, []);
    useEffect(() => {
        if (!socket)
            return;
        const upd = () => fetchAll();
        socket.on('order_updated', upd);
        socket.on('order_created', upd);
        socket.on('order_deleted', upd);
        socket.on('buyer_associated', upd);
        socket.on('seller_assigned', upd);
        return () => {
            socket.off('order_updated');
            socket.off('order_created');
            socket.off('order_deleted');
            socket.off('buyer_associated');
            socket.off('seller_assigned');
        };
    }, [socket]);
    const handleAssociateClick = (orderId) => {
        setSelectedOrderId(orderId);
        setAssociateOpen(true);
    };
    const handleViewDetailsClick = (orderId) => {
        setSelectedOrderId(orderId);
        setDetailsOpen(true);
    };
    const handleAssociate = async (orderId, buyerId) => {
        try {
            await associateBuyer(orderId, buyerId);
            await fetchAll();
            setAssociateOpen(false);
            setSelectedOrderId(null);
        }
        catch (err) {
            console.error(err);
            alert('Failed to associate buyer');
        }
    };
    const handleAssignSeller = async (orderId) => {
        try {
            const res = await getSellers();
            const sellers = res.data;
            if (!sellers || sellers.length === 0) {
                alert('No sellers available to assign');
                return;
            }
            // Directly show list without asking for ID first
            const list = sellers.map((s, i) => `${i + 1}) ${s.name} <${s.email}>`).join('\n');
            const choice = prompt(`Select seller to assign to order ${orderId}:\n\n${list}\n\nEnter the number:`);
            if (!choice)
                return;
            const idx = parseInt(choice, 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= sellers.length) {
                alert('Invalid selection');
                return;
            }
            const sellerId = sellers[idx]._id;
            await assignSeller(orderId, sellerId);
            await fetchAll();
            alert('Seller assigned successfully!');
        }
        catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Failed to assign seller');
        }
    };
    const handleDelete = async (orderId) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.'))
            return;
        try {
            await deleteOrderAdmin(orderId);
            await fetchAll();
            alert('Order deleted successfully');
        }
        catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Failed to delete order');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6", children: [_jsxs("header", { className: "flex justify-between items-center mb-6 bg-white rounded-lg shadow-md px-6 py-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Admin Dashboard" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage orders, buyers, and sellers" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-gray-700 font-medium", children: auth.user?.name }), _jsx("button", { onClick: () => auth.logout(), className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors", children: "Logout" })] })] }), stats && _jsx(StatsCards, { stats: stats }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-4 mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "All Orders" }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["Total: ", orders.length, " orders"] })] }), _jsx(OrdersTable, { orders: orders, onAssociateBuyer: handleAssociateClick, onViewDetails: handleViewDetailsClick, onAssignSeller: handleAssignSeller, onDelete: handleDelete })] }), _jsx(AssociateBuyerModal, { isOpen: associateOpen, onClose: () => setAssociateOpen(false), orderId: selectedOrderId, onAssociate: (orderId, buyerId) => handleAssociate(orderId, buyerId) }), _jsx(OrderDetailsModal, { isOpen: detailsOpen, onClose: () => setDetailsOpen(false), orderId: selectedOrderId })] }));
}
