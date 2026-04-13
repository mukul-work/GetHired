import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 4000 });

// Attach token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Placements ──────────────────────────────────────────────
export const getPlacements = (params) => api.get("/placements", { params });
export const getPlacementStats = () => api.get("/placements/stats");
export const getYearlyChart = () => api.get("/placements/chart/yearly");
export const getBranchChart = () => api.get("/placements/chart/branch");
export const getCompaniesChart = () => api.get("/placements/chart/companies");
export const getPackageDistChart = () =>
  api.get("/placements/chart/package-dist");
export const getTopPerformers = () => api.get("/placements/top-performers");
export const getFilterOptions = () => api.get("/placements/filters");

// ── Blogs ────────────────────────────────────────────────────
export const getBlogs = (params) => api.get("/blogs", { params });
export const getBlog = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post("/blogs", data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// ── Admin ────────────────────────────────────────────────────
export const adminLogin = (data) => api.post("/admin/login", data);
export const uploadFile = (formData) =>
  api.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default api;
