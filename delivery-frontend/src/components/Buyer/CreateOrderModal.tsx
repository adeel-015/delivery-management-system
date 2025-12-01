import React, { useState } from 'react'

type Props = { isOpen: boolean; onClose: () => void; onSubmit: (items: string[]) => void }

export default function CreateOrderModal({ isOpen, onClose, onSubmit }: Props) {
    const [items, setItems] = useState<string[]>([''])

    if (!isOpen) return null

    const updateItem = (idx: number, value: string) => setItems(items.map((it, i) => (i === idx ? value : it)))
    const addItem = () => setItems([...items, ''])
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx))

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        const cleaned = items.map((i) => i.trim()).filter(Boolean)
        if (cleaned.length === 0) return alert('Add at least one item')
        onSubmit(cleaned)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-lg">
                <h3 className="text-xl mb-4">Create Order</h3>
                <form onSubmit={submit}>
                    {items.map((it, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input className="flex-1 p-2 border" value={it} onChange={(e) => updateItem(idx, e.target.value)} />
                            <button type="button" onClick={() => removeItem(idx)} className="text-red-600">Remove</button>
                        </div>
                    ))}
                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={addItem} className="p-2 bg-gray-200">Add Item</button>
                        <div>
                            <button type="button" onClick={onClose} className="mr-2 p-2 bg-gray-100">Cancel</button>
                            <button type="submit" className="p-2 bg-blue-600 text-white">Make an Order</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
