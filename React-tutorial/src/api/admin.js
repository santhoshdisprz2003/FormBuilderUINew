import axiosInstance from "./axiosInstance";

// Fetch all responses for a specific form (Admin only)
export const getAllResponsesForForm = async (formId) => {
  const response = await axiosInstance.get(`/admin/forms/${formId}/responses`);
  return response.data;
};
