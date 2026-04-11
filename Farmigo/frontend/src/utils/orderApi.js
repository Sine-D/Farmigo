import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return req;
});

// Create order
export const createOrder = (orderData) => API.post("/makeOrder", orderData);

// Buyer orders
export const getBuyerOrders = () => API.get("/makeOrder/buyer");

// Farmer orders
export const getFarmerOrders = () => API.get("/makeOrder/farmer");

// Cancel order
export const cancelOrder = (id) => API.put(`/makeOrder/cancel/${id}`);

// Update delivery
export const updateDeliveryStatus = (id, data) =>
  API.put(`/makeOrder/delivery/${id}`, data);

// Update payment
export const updatePaymentStatus = (id, data) =>
  API.put(`/makeOrder/payment/${id}`, data);

// Delete order
export const deleteOrder = (id) => API.delete(`/makeOrder/${id}`);

// Send Email
export const sendOrderEmail = (data) =>
  API.post("/makeOrder/send-email", data);

// Generate Invoice (optional backend)
export const generateInvoice = (id) =>
  API.get(`/makeOrder/invoice/${id}`, {
    responseType: "blob",
  });