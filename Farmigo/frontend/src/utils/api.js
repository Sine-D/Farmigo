import api from "../services/api";

export const apiGet = async (endpoint) => {
  const response = await api.get(endpoint);
  return response.data?.data || response.data;
};

export const apiPost = async (endpoint, body) => {
  const response = await api.post(endpoint, body);
  return response.data?.data || response.data;
};

export const apiPut = async (endpoint, body) => {
  const response = await api.put(endpoint, body);
  return response.data?.data || response.data;
};

export const apiDelete = async (endpoint) => {
  const response = await api.delete(endpoint);
  return response.data?.data || response.data;
};

export default api;