import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = "https://kplc-server.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPermits = async () => {
  try {
    const response = await api.get("/permits");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch permits" };
  }
};

export const getPermitById = async (id) => {
  try {
    const response = await api.get(`/permits/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch permit" };
  }
};

export const updatePermitStatus = async (id, permitData) => {
  try {
    const response = await api.put(`/permits/${id}`, permitData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update permit" };
  }
};

//update approval form by id
export const updateApprovalForm = async (id, formData) => {
  try {
    const response = await api.put(`/permits/approval/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update approval form" };
  }
};

export const deletePermit = async (id) => {
  try {
    const response = await api.delete(`/permits/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete permit" };
  }
};

export const getUsers = async (email, password) => {
  try {
    const response = await api.get("/users", {
      params: {
        email,
        id_number: password,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export default api;
