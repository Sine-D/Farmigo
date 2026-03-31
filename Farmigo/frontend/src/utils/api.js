const API_BASE_URL = "http://localhost:5001/api";

const getToken = () => localStorage.getItem("token");

const buildHeaders = (isJson = true) => {
  const headers = {};
  const token = getToken();

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: buildHeaders(false),
  });

  return handleResponse(response);
};

export const apiPost = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};

export const apiPut = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};

export const apiDelete = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: buildHeaders(false),
  });

  return handleResponse(response);
};