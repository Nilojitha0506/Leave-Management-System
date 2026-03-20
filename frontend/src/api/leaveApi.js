import axios from "axios";

const API = "http://localhost:8080/api";

export const createLeave = async (data) => {
  const res = await axios.post(`${API}/leaves`, data);
  return res.data;
};

export const getLeaves = async () => {
  const res = await axios.get(`${API}/leaves`);
  return res.data;
};

export const updateLeaveStatus = async (id, status, reject_reason = "") => {
  const res = await axios.put(`${API}/leaves/${id}`, {
    status,
    reject_reason,
  });
  return res.data;
};