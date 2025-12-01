import { useEffect, useState } from 'react'
import { getBuyers } from '../../services/api'

export default function AssociateBuyerModal({ isOpen, onClose, orderId, onAssociate }: any) {
    const [buyers, setBuyers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        getBuyers().then((r) => setBuyers(r.data)).catch(console.error).finally(() => setLoading(false))
    }, [isOpen])

    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-lg">
                <h3 className="text-xl mb-4">Select Buyer for Order {orderId}</h3>
                {loading ? <div>Loading buyers...</div> : (
                    <div className="max-h-64 overflow-auto">
                        {buyers.map((b) => (
                            <div key={b._id} className="flex justify-between items-center p-2 border-b">
                                <div><div className="font-medium">{b.name}</div><div className="text-sm">{b.email}</div></div>
                                <button onClick={() => onAssociate(orderId, b._id)} className="p-2 bg-blue-600 text-white rounded">Select</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 text-right"><button onClick={onClose} className="p-2 bg-gray-100">Close</button></div>
            </div>
        </div>
    )
}
