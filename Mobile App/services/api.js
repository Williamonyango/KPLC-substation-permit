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

export const submitPermit = async (permitData) => {
  try {
    const response = await api.post("/permits", permitData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to submit permit" };
  }
};

export const updatePermit = async (permit_number, permitData) => {
  try {
    const response = await api.put(
      `/permits/clearance/${permit_number}`,
      permitData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update permit" };
  }
};

export const getHighestPermitNumber = async () => {
  try {
    const permits = await getPermits();

    if (!Array.isArray(permits) || permits.length === 0) {
      throw new Error("No permits found");
    }

    const highestPermit = permits.reduce((max, permit) => {
      const num = Number(permit.permit_number);
      return num > max ? num : max;
    }, 0);

    return highestPermit;
  } catch (error) {
    throw (
      error.response?.data || {
        error: "Failed to determine highest permit number",
      }
    );
  }
};

//get all users
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
// get permits by Id_number
export const getPermitsById = async (Id_number) => {
  try {
    const response = await api.get(`/permits/id_number/${Id_number}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching permits:", error);
    throw error;
  }
};

export const checkPermitStatus = async (permit_number) => {
  try {
    const permits = await getPermits();

    // Convert permit_number to string for comparison since it might be stored as string in the database
    const permit = permits.find(
      (p) => String(p.permit_number) === String(permit_number)
    );

    if (!permit) {
      throw new Error(`Permit ${permit_number} not found`);
    }

    return permit;
  } catch (error) {
    console.error("Error checking permit status:", error);
    throw error;
  }
};

export default api;
