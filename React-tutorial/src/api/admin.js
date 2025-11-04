import axiosInstance from "./axiosInstance";

// Fetch responses for a specific form with pagination & search support
export const getAllResponsesForForm = async (formId, pageNumber = 1, pageSize = 6, search = "") => {
  try {
    const params = {
      pageNumber,
      pageSize,
    };

    // Include search only if provided
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    const response = await axiosInstance.get(`/admin/forms/${formId}/responses`, { params });

    // Expected backend structure:
    // {
    //   totalCount, totalPages, pageNumber, pageSize, items: [...]
    // }
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated responses:", error);
    throw error;
  }
};
