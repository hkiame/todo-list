import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // You could add authentication tokens here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const api = {
  // Groups
  getGroups: () => apiClient.get("/groups"),
  createGroup: (groupData) => apiClient.post("/groups", groupData),

  // Todos
  getTodos: () => apiClient.get("/items"),
  createTodo: (todoData) => apiClient.post("/items", todoData),
  updateTodo: (id, todoData) => apiClient.put(`/items/${id}`, todoData),
  deleteTodo: (id) => apiClient.delete(`/items/${id}`),
};

export default apiClient;
