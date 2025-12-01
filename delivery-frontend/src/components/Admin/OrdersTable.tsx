import { Order, STAGE_NAMES } from '../../types'

type Props = {
    orders: Order[]
    onAssociateBuyer?: (orderId: string) => void
    onViewDetails?: (orderId: string) => void
    onAssignSeller?: (orderId: string) => void
    onDelete?: (orderId: string) => void
}

export default function OrdersTable({ orders, onAssociateBuyer, onViewDetails, onAssignSeller, onDelete }: Props) {
    const formatDate = (date?: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleString();
    }

    const getUserInfo = (userRef: any, field: 'name' | 'email' | 'id') => {
        if (!userRef) return '-';
        if (typeof userRef === 'object') {
            if (field === 'id') return userRef._id || '-';
            return userRef[field] || '-';
        }
        return field === 'id' ? userRef : '-';
    }

    return (
        <div className="overflow-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
                    <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Order ID</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stage</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Items</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Buyer Name</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Buyer ID</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Buyer Email</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Seller Name</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Seller ID</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Seller Email</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated At</th>
                        <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {(orders || []).map((o) => (
                        <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-sm font-mono text-gray-700">{o._id?.substring(0, 8)}...</td>
                            <td className="px-3 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    o.currentStage === 7 ? 'bg-green-100 text-green-800' :
                                    o.currentStage >= 5 ? 'bg-blue-100 text-blue-800' :
                                    o.currentStage >= 3 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {STAGE_NAMES[o.currentStage - 1] ?? o.currentStage}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-600">{(o.items || []).join(', ')}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{getUserInfo(o.buyerId, 'name')}</td>
                            <td className="px-3 py-3 text-sm font-mono text-gray-500">{getUserInfo(o.buyerId, 'id')}</td>
                            <td className="px-3 py-3 text-sm text-gray-600">{getUserInfo(o.buyerId, 'email')}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{getUserInfo(o.sellerId, 'name')}</td>
                            <td className="px-3 py-3 text-sm font-mono text-gray-500">{getUserInfo(o.sellerId, 'id')}</td>
                            <td className="px-3 py-3 text-sm text-gray-600">{getUserInfo(o.sellerId, 'email')}</td>
                            <td className="px-3 py-3 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                            <td className="px-3 py-3 text-sm text-gray-500">{formatDate(o.updatedAt)}</td>
                            <td className="px-3 py-3 text-sm">
                                <div className="flex gap-1 justify-center flex-wrap">
                                    <button 
                                        onClick={() => onAssociateBuyer?.(o._id!)} 
                                        className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
                                        title="Associate buyer"
                                    >
                                        Associate
                                    </button>
                                    <button 
                                        onClick={() => onAssignSeller?.(o._id!)} 
                                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors"
                                        title="Assign seller"
                                    >
                                        Assign Seller
                                    </button>
                                    <button 
                                        onClick={() => onViewDetails?.(o._id!)} 
                                        className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors"
                                        title="View details"
                                    >
                                        Details
                                    </button>
                                    {onDelete && (
                                        <button 
                                            onClick={() => onDelete(o._id!)} 
                                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                                            title="Delete order"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!orders || orders.length === 0) && (
                <div className="text-center py-8 text-gray-500">No orders found</div>
            )}
        </div>
    )
}
