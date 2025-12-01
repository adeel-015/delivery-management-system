import { Order, STAGE_NAMES } from '../../types'

type Props = { 
    orders: Order[]; 
    onMoveToNextStage: (id: string) => void; 
    onDelete: (id: string) => void;
    onMarkNotDelivered?: (id: string) => void;
}

export default function OrdersTable({ orders, onMoveToNextStage, onDelete, onMarkNotDelivered }: Props) {
    const formatDate = (date?: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleString();
    }

    const getBuyerEmail = (order: Order) => {
        if (typeof order.buyerId === 'object' && order.buyerId) {
            return (order.buyerId as any).email || '-';
        }
        return '-';
    }

    return (
        <div className="overflow-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-indigo-600 to-blue-500 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Buyer Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Buyer Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated At</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-mono text-gray-700">{o._id?.substring(0, 8)}...</td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    o.currentStage === 7 ? 'bg-green-100 text-green-800' :
                                    o.currentStage >= 5 ? 'bg-blue-100 text-blue-800' :
                                    o.currentStage >= 3 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {STAGE_NAMES[o.currentStage - 1] ?? o.currentStage}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{(o.items || []).join(', ')}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{typeof o.buyerId === 'object' ? (o.buyerId as any).name : (o.buyerId ?? '-')}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{getBuyerEmail(o)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(o.updatedAt)}</td>
                            <td className="px-4 py-3 text-sm text-center">
                                <div className="flex gap-2 justify-center">
                                    {o.currentStage < 7 && (
                                        <button 
                                            onClick={() => onMoveToNextStage(o._id!)} 
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                                            title="Move to next stage"
                                        >
                                            Next Stage
                                        </button>
                                    )}
                                    {o.currentStage === 7 && onMarkNotDelivered && (
                                        <button 
                                            onClick={() => onMarkNotDelivered(o._id!)} 
                                            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-medium transition-colors"
                                            title="Mark as not delivered"
                                        >
                                            Not Delivered
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onDelete(o._id!)} 
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors"
                                        title="Delete order"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">No orders found</div>
            )}
        </div>
    )
}
