import axiosInstance from "./axiosInstance";

// Submit a response to a form
export const submitResponse = async (formId, responseDto) => {
  const response = await axiosInstance.post(`/forms/${formId}/responses`, responseDto);
  return response.data;
};

// Get responses submitted by logged-in user for a form
export const getResponsesForForm = async (formId) => {
  const response = await axiosInstance.get(`/forms/${formId}/responses`);
  return response.data;
};

// Download a file attached to a response (Admin only)
export const downloadFile = async (responseId, fileId) => {
  const response = await axiosInstance.get(`/responses/download-file/${responseId}/${fileId}`, {
    responseType: "blob" // ensures binary download
  });

  // Create a download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `file_${fileId}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
