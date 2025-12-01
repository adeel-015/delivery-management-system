import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function CreateOrderModal({ isOpen, onClose, onSubmit }) {
    const [items, setItems] = useState(['']);
    if (!isOpen)
        return null;
    const updateItem = (idx, value) => setItems(items.map((it, i) => (i === idx ? value : it)));
    const addItem = () => setItems([...items, '']);
    const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
    const submit = (e) => {
        e.preventDefault();
        const cleaned = items.map((i) => i.trim()).filter(Boolean);
        if (cleaned.length === 0)
            return alert('Add at least one item');
        onSubmit(cleaned);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-6 rounded w-full max-w-lg", children: [_jsx("h3", { className: "text-xl mb-4", children: "Create Order" }), _jsxs("form", { onSubmit: submit, children: [items.map((it, idx) => (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { className: "flex-1 p-2 border", value: it, onChange: (e) => updateItem(idx, e.target.value) }), _jsx("button", { type: "button", onClick: () => removeItem(idx), className: "text-red-600", children: "Remove" })] }, idx))), _jsxs("div", { className: "flex justify-between mt-4", children: [_jsx("button", { type: "button", onClick: addItem, className: "p-2 bg-gray-200", children: "Add Item" }), _jsxs("div", { children: [_jsx("button", { type: "button", onClick: onClose, className: "mr-2 p-2 bg-gray-100", children: "Cancel" }), _jsx("button", { type: "submit", className: "p-2 bg-blue-600 text-white", children: "Make an Order" })] })] })] })] }) }));
}
