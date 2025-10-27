import axiosInstance from "./axiosInstance";

// =========================
// 📋 FORM CONFIGURATION
// =========================

// 🔹 Create new form configuration
export const createFormConfig = async (configDto) => {
  const res = await axiosInstance.post("/forms/formconfig", configDto);
  return res.data;
};

// 🔹 Update existing form configuration
export const updateFormConfig = async (id, configDto) => {
  const res = await axiosInstance.put(`/forms/formconfig/${id}`, configDto);
  return res.data;
};

// =========================
// 🧩 FORM LAYOUT
// =========================

// 🔹 Create form layout for a form
export const createFormLayout = async (formId, layoutDto) => {
  const res = await axiosInstance.post(`/forms/formlayout/${formId}`, layoutDto);
  return res.data;
};

// 🔹 Update form layout for a form
export const updateFormLayout = async (formId, layoutDto) => {
  const res = await axiosInstance.put(`/forms/formlayout/${formId}`, layoutDto);
  return res.data;
};

// =========================
// 🔍 FETCH / VIEW
// =========================

// 🔹 Get all forms (with pagination)
export const getAllForms = async (offset = 0, limit = 10) => {
  const res = await axiosInstance.get("/forms", { params: { offset, limit } });
  return res.data;
};

// 🔹 Get form by ID (used in ViewForm)
export const getFormById = async (id) => {
  const res = await axiosInstance.get(`/forms/${id}`);
  return res.data;
};

// =========================
// 🚀 PUBLISH / DELETE
// =========================

// 🔹 Publish form
export const publishForm = async (id) => {
  const res = await axiosInstance.put(`/forms/${id}/publish`);
  return res.data;
};

// 🔹 Delete form
export const deleteForm = async (id) => {
  const res = await axiosInstance.delete(`/forms/${id}`);
  return res.data;
};
