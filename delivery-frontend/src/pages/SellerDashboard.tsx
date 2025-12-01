import { useEffect, useState } from 'react'
import { getOrders, moveToNextStage, deleteOrder } from '../services/api'
import useSocket from '../hooks/useSocket'
import OrdersTable from '../components/Seller/OrdersTable'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function SellerDashboard() {
    const { socket } = useSocket()
    const auth = useAuth()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetch = async () => {
        setLoading(true)
        try {
            const res = await getOrders()
            setOrders(res.data)
        } catch (err) { console.error(err) } finally { setLoading(false) }
    }

    useEffect(() => { fetch() }, [])

    useEffect(() => {
        if (!socket) return
        const upd = (data: any) => { fetch() }
        socket.on('order_updated', upd)
        socket.on('order_created', upd)
        socket.on('order_deleted', upd)
        socket.on('seller_assigned', upd)
        return () => { 
            socket.off('order_updated')
            socket.off('order_created')
            socket.off('order_deleted')
            socket.off('seller_assigned')
        }
    }, [socket])

    const handleNext = async (id: string) => { 
        try { 
            await moveToNextStage(id)
            fetch()
        } catch (err) { 
            alert('Failed to advance stage')
        } 
    }

    const handleDelete = async (id: string) => { 
        if (!confirm('Delete this order? This action cannot be undone.')) return
        try { 
            await deleteOrder(id)
            fetch()
        } catch (err) { 
            alert('Failed to delete order')
        } 
    }

    const handleMarkNotDelivered = async (id: string) => {
        if (!confirm('Mark this order as not delivered? This will move it back to "Out for Delivery" stage.')) return
        try {
            const token = localStorage.getItem('token')
            await axios.put(`/api/orders/${id}/not-delivered`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert('Order marked as not delivered')
            fetch()
        } catch (err: any) {
            console.error(err)
            alert(err?.response?.data?.message || 'Failed to mark as not delivered')
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-6">
            <header className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md px-6 py-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                    <p className="text-gray-600 text-sm mt-1">Manage your assigned orders</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">{auth.user?.name}</span>
                    <button 
                        onClick={() => auth.logout()} 
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>
            
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
                <p className="text-gray-600 text-sm">Total: {orders.length} orders</p>
            </div>
            
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <OrdersTable 
                    orders={orders} 
                    onMoveToNextStage={handleNext} 
                    onDelete={handleDelete}
                    onMarkNotDelivered={handleMarkNotDelivered}
                />
            )}
        </div>
    )
}
