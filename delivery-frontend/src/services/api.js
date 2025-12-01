import axios from "axios";
const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use((res) => res, (err) => {
    if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    return Promise.reject(err);
});
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const createOrder = (items) => api.post("/orders", { items });
export const getOrders = () => api.get("/orders");
export const associateBuyer = (orderId, buyerId) => api.put(`/orders/${orderId}/associate`, { buyerId });
export const assignSeller = (orderId, sellerId) => api.put(`/orders/${orderId}/assign-seller`, { sellerId });
export const moveToNextStage = (orderId) => api.put(`/orders/${orderId}/next-stage`);
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);
export const deleteOrderAdmin = (orderId) => api.delete(`/orders/${orderId}/admin`);
export const getOrderDetails = (orderId) => api.get(`/orders/${orderId}/details`);
export const getStats = () => api.get("/orders/stats/all");
export const getBuyers = () => api.get("/orders/admin/buyers");
export const getSellers = () => api.get("/orders/admin/sellers");
export default api;
