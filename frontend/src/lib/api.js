import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const listLeads = () => api.get("/leads").then((r) => r.data);
export const getLead = (id) => api.get(`/leads/${id}`).then((r) => r.data);
export const createLead = (payload) => api.post("/leads", payload).then((r) => r.data);
export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}/status`, { status }).then((r) => r.data);
export const deleteLead = (id) => api.delete(`/leads/${id}`).then((r) => r.data);
export const getStats = () => api.get("/stats").then((r) => r.data);
export const addNote = (id, body) =>
  api.post(`/leads/${id}/notes`, { body }).then((r) => r.data);
export const deleteNote = (id, noteId) =>
  api.delete(`/leads/${id}/notes/${noteId}`).then((r) => r.data);
