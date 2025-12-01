import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getBuyers } from '../../services/api';
export default function AssociateBuyerModal({ isOpen, onClose, orderId, onAssociate }) {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isOpen)
            return;
        setLoading(true);
        getBuyers().then((r) => setBuyers(r.data)).catch(console.error).finally(() => setLoading(false));
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-6 rounded w-full max-w-lg", children: [_jsxs("h3", { className: "text-xl mb-4", children: ["Select Buyer for Order ", orderId] }), loading ? _jsx("div", { children: "Loading buyers..." }) : (_jsx("div", { className: "max-h-64 overflow-auto", children: buyers.map((b) => (_jsxs("div", { className: "flex justify-between items-center p-2 border-b", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: b.name }), _jsx("div", { className: "text-sm", children: b.email })] }), _jsx("button", { onClick: () => onAssociate(orderId, b._id), className: "p-2 bg-blue-600 text-white rounded", children: "Select" })] }, b._id))) })), _jsx("div", { className: "mt-4 text-right", children: _jsx("button", { onClick: onClose, className: "p-2 bg-gray-100", children: "Close" }) })] }) }));
}
