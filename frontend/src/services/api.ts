import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://adarsh-shukla.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to log request details and attach auth token
api.interceptors.request.use(
  (config) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log("Request URL", fullUrl);

    // Attach authorization token if present
    const token = localStorage.getItem('a3_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log responses and normalize error objects
api.interceptors.response.use(
  (response) => {
    console.log("Response", response);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(error.response);

      if (error.response) {
        // Extract server error details
        const status = error.response.status;
        const data = error.response.data;
        const serverMsg = data?.message || data?.error || '';
        
        let normalizedMsg = serverMsg || `Request failed with status code ${status}`;
        
        // Custom overrides for specific status codes if needed
        if (status === 429) {
          normalizedMsg = serverMsg || "Too many submissions. Please try again after 15 minutes.";
        } else if (status === 500) {
          normalizedMsg = serverMsg || "Internal Server Error";
        }
        
        error.message = normalizedMsg;
      } else if (error.request) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          error.message = "Axios timeout. Please check your internet connection or try again later.";
        } else {
          error.message = "Network Error. Unable to connect to the server.";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
