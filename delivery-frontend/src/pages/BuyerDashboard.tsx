import { useEffect, useState } from 'react'
import { getOrders, createOrder } from '../services/api'
import useSocket from '../hooks/useSocket'
import CreateOrderModal from '../components/Buyer/CreateOrderModal'
import OrderProgress from '../components/Buyer/OrderProgress'
import { useAuth } from '../context/AuthContext'

export default function BuyerDashboard() {
    const { socket } = useSocket()
    const auth = useAuth()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const fetch = async () => {
        setLoading(true)
        try {
            const res = await getOrders()
            setOrder(res.data[0] || null)
        } catch (err) {
            console.error(err)
        } finally { setLoading(false) }
    }

    useEffect(() => { fetch() }, [])

    useEffect(() => {
        if (!socket) return
        socket.on('order_updated', (data: any) => { 
            setOrder(data)
        })
        socket.on('order_deleted', () => {
            setOrder(null)
        })
        socket.on('buyer_associated', (data: any) => {
            // Check if this order is for current user
            if (data.buyerId === auth.user?.id || (typeof data.buyerId === 'object' && data.buyerId._id === auth.user?.id)) {
                setOrder(data)
            }
        })
        return () => { 
            socket.off('order_updated')
            socket.off('order_deleted')
            socket.off('buyer_associated')
        }
    }, [socket, auth.user])

    const handleCreate = async (items: string[]) => {
        try {
            const res = await createOrder(items)
            setOrder(res.data)
            setShowModal(false)
        } catch (err: any) { 
            alert(err?.response?.data?.message || 'Failed to create order') 
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 p-6">
            <header className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md px-6 py-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
                    <p className="text-gray-600 text-sm mt-1">Track your order in real-time</p>
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
            
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : order ? (
                <OrderProgress order={order} />
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Order</h2>
                    <p className="text-gray-600 mb-6">You don't have any active orders at the moment.</p>
                    <button 
                                className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg" 
                        onClick={() => setShowModal(true)}
                    >
                        Create New Order
                    </button>
                </div>
            )}
            
            <CreateOrderModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
        </div>
    )
}
