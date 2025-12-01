import { useEffect, useState } from 'react'
import { getOrderDetails } from '../../services/api'

export default function OrderDetailsModal({ isOpen, orderId, onClose }: any) {
    const [details, setDetails] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        getOrderDetails(orderId).then((r) => setDetails(r.data)).catch(console.error).finally(() => setLoading(false))
    }, [isOpen, orderId])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString()
    }

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
        if (hours > 0) return `${hours}h ${minutes % 60}m`
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`
        return `${seconds}s`
    }

    if (!isOpen) return null
    
    const order = details?.order
    const stageTimes = details?.stageTimes || []
    const history = details?.history || []

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-6 py-4">
                    <h3 className="text-2xl font-bold">Order Details</h3>
                    <p className="text-purple-100 text-sm mt-1">Order ID: {orderId}</p>
                </div>
                
                <div className="overflow-auto p-6 flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : order ? (
                        <div className="space-y-6">
                            {/* Order Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono text-sm font-medium">{order._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Current Stage</p>
                                        <p className="font-medium">{order.currentStage} - {order.stageName || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Items</p>
                                        <p className="font-medium">{order.items?.join(', ') || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className={`font-medium ${order.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                                            {order.isDeleted ? 'Deleted' : 'Active'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Created At</p>
                                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">{formatDate(order.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buyer & Seller Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Buyer Information</h4>
                                    {order.buyerId ? (
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-blue-700">Name</p>
                                                <p className="font-medium">{order.buyerId.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-700">Email</p>
                                                <p className="font-medium">{order.buyerId.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-700">ID</p>
                                                <p className="font-mono text-xs">{order.buyerId._id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-blue-800 italic">No buyer associated</p>
                                    )}
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-green-900 mb-3">Seller Information</h4>
                                    {order.sellerId ? (
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-green-700">Name</p>
                                                <p className="font-medium">{order.sellerId.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">Email</p>
                                                <p className="font-medium">{order.sellerId.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">ID</p>
                                                <p className="font-mono text-xs">{order.sellerId._id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-green-800 italic">No seller assigned</p>
                                    )}
                                </div>
                            </div>

                            {/* Stage Durations */}
                            {stageTimes.length > 0 && (
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-yellow-900 mb-3">Stage Durations</h4>
                                    <div className="space-y-2">
                                        {stageTimes.map((st: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center bg-white rounded px-3 py-2">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {st.from} → {st.to}
                                                </span>
                                                <span className="text-sm font-bold text-yellow-700">
                                                    {formatDuration(st.durationMs)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order History */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-purple-900 mb-3">Order History</h4>
                                <div className="space-y-3">
                                    {history.map((h: any, idx: number) => (
                                        <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-purple-900">{h.stage}</span>
                                                <span className="text-xs text-gray-500">{formatDate(h.timestamp)}</span>
                                            </div>
                                            {h.actorName && (
                                                <p className="text-sm text-gray-600">
                                                    By: <span className="font-medium">{h.actorName}</span>
                                                    {h.action && ` - ${h.action}`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">No details available</div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
