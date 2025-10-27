import axiosInstance from "./axiosInstance";

// GET all forms
export const getAllForms = async (offset = 0, limit = 10) => {
  const res = await axiosInstance.get("/forms", { params: { offset, limit } });
  return res.data;
};

// GET form by ID
export const getFormById = async (id) => {
  const res = await axiosInstance.get(`/forms/${id}`);
  return res.data;
};

// POST create form
export const createFormConfig = async (configDto) => {
  const res = await axiosInstance.post("/forms/formconfig", configDto);
  return res.data;
};

// PUT update form
export const updateForm = async (id, formDto) => {
  const res = await axiosInstance.put(`/forms/${id}`, formDto);
  return res.data;
};

// DELETE form
export const deleteForm = async (id) => {
  const res = await axiosInstance.delete(`/forms/${id}`);
  return res.data;
};

// PUT publish form
export const publishForm = async (id) => {
  const res = await axiosInstance.put(`/forms/${id}/publish`);
  return res.data;
};
