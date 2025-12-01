import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: any) => api.post("/auth/login", data);

export const createOrder = (items: string[]) => api.post("/orders", { items });
export const getOrders = () => api.get("/orders");
export const associateBuyer = (orderId: string, buyerId: string) =>
  api.put(`/orders/${orderId}/associate`, { buyerId });
export const assignSeller = (orderId: string, sellerId: string) =>
  api.put(`/orders/${orderId}/assign-seller`, { sellerId });
export const moveToNextStage = (orderId: string) =>
  api.put(`/orders/${orderId}/next-stage`);
export const deleteOrder = (orderId: string) =>
  api.delete(`/orders/${orderId}`);
export const deleteOrderAdmin = (orderId: string) =>
  api.delete(`/orders/${orderId}/admin`);
export const getOrderDetails = (orderId: string) =>
  api.get(`/orders/${orderId}/details`);
export const getStats = () => api.get("/orders/stats/all");
export const getBuyers = () => api.get("/orders/admin/buyers");
export const getSellers = () => api.get("/orders/admin/sellers");

export default api;
