import { Order } from '../../types'

const STAGES = ['Order Placed', 'Buyer Associated', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']

export default function OrderProgress({ order }: { order: Order }) {
    const current = order.currentStage || 1
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Status</h2>
                <p className="text-sm text-gray-600">Order ID: <span className="font-mono">{order._id}</span></p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
                    <div 
                        className="absolute top-5 left-0 h-1 bg-linear-to-r from-green-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${((current - 1) / (STAGES.length - 1)) * 100}%` }}
                    ></div>
                </div>
                
                <div className="relative flex justify-between">
                    {STAGES.map((s, i) => {
                        const idx = i + 1
                        const status = idx < current ? 'completed' : idx === current ? 'current' : 'pending'
                        return (
                            <div key={s} className="flex flex-col items-center" style={{ width: `${100 / STAGES.length}%` }}>
                                <div 
                                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm border-4 transition-all duration-300 ${
                                        status === 'completed' 
                                            ? 'bg-green-500 border-green-500 text-white scale-100' 
                                            : status === 'current' 
                                            ? 'bg-blue-500 border-blue-500 text-white scale-110 shadow-lg animate-pulse' 
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                                >
                                    {status === 'completed' ? '✓' : idx}
                                </div>
                                <div className={`text-xs mt-2 text-center font-medium max-w-20 ${
                                    status === 'completed' ? 'text-green-700' : 
                                    status === 'current' ? 'text-blue-700' : 
                                    'text-gray-400'
                                }`}>
                                    {s}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Current Stage</p>
                        <p className="font-semibold text-gray-800">{STAGES[current - 1]}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-semibold text-gray-800">{(order.items || []).join(', ')}</p>
                    </div>
                    {order.createdAt && (
                        <div>
                            <p className="text-sm text-gray-600">Order Placed</p>
                            <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    )}
                    {order.updatedAt && (
                        <div>
                            <p className="text-sm text-gray-600">Last Updated</p>
                            <p className="font-semibold text-gray-800">{new Date(order.updatedAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Message */}
            <div className="mt-6 text-center">
                {current === 7 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-semibold text-lg">🎉 Your order has been delivered!</p>
                    </div>
                ) : current >= 5 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 font-semibold">📦 Your order is on the way!</p>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 font-semibold">⏳ Your order is being processed</p>
                    </div>
                )}
            </div>
        </div>
    )
}
