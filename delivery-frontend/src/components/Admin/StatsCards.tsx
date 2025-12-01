import { STAGE_NAMES } from '../../types'

export default function StatsCards({ stats }: any) {
    const formatDeliveryTime = (ms: number | null) => {
        if (!ms) return 'N/A'
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000)
        if (hours > 24) {
            const days = Math.floor(hours / 24)
            return `${days}d ${hours % 24}h`
        }
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    }

    const getStageColor = (stage: number) => {
        if (stage === 7) return 'from-green-500 to-emerald-600'
        if (stage >= 5) return 'from-blue-500 to-indigo-600'
        if (stage >= 3) return 'from-yellow-500 to-orange-600'
        return 'from-gray-500 to-gray-600'
    }

    const totalOrders = stats.totalOrders || 0
    const ordersByStage = stats.ordersByStage || {}
    const avgDeliveryTime = stats.avgDeliveryTime

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Orders</p>
                            <p className="text-4xl font-bold mt-2">{totalOrders}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Avg Delivery Time</p>
                            <p className="text-4xl font-bold mt-2">{formatDeliveryTime(avgDeliveryTime)}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Delivered Orders</p>
                            <p className="text-4xl font-bold mt-2">{ordersByStage[7] || 0}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders by Stage Visualization */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Orders Distribution by Stage</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((stage) => {
                        const count = ordersByStage[stage] || 0
                        const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0
                        return (
                            <div key={stage}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {STAGE_NAMES[stage - 1] || `Stage ${stage}`}
                                    </span>
                                    <span className="text-sm font-bold text-gray-800">{count} orders</span>
                                </div>
                                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-linear-to-r ${getStageColor(stage)} transition-all duration-500 flex items-center justify-end pr-3`}
                                        style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
                                    >
                                        {count > 0 && (
                                            <span className="text-white text-xs font-bold">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
