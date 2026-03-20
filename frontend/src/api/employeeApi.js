import axios from "axios";

const API = process.env.REACT_APP_API_URL + "/employees";

export const getEmployees = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};