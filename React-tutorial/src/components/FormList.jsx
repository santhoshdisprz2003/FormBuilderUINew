import React, { useState } from "react";
import "../styles/FormList.css";
import { useNavigate } from "react-router-dom";

export default function FormList({
  forms,
  search,
  setSearch,
  openMenuId,
  setOpenMenuId,
  handleCreateForm,
  handleDelete,
  loading,
}) {
  const [deletePopup, setDeletePopup] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // ✅ Filter forms by title
  const filteredForms = forms.filter((form) =>
    (form?.config?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Confirm deletion
  const confirmDelete = async (id) => {
    try {
      setDeleting(true);
      await handleDelete(id);
      setDeletePopup(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Navigate to the view form page
  const handleViewForm = (id) => {
    console.log("Navigating to View Form with ID:", id);

    navigate(`/form-builder/view/${id}`);
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Status text and styles
  const getStatusText = (status) =>
    status === 1 || status === "1" ? "Published" : "Draft";

  const getStatusClass = (status) =>
    status === 1 || status === "1" ? "published" : "draft";

  const isPublished = (status) => status === 1 || status === "1";

  return (
    <div className="container">
      <div className="header">
        <p>Form List</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search forms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="create-btn" onClick={handleCreateForm}>
            Create Form
          </button>
        </div>
      </div>

      {/* ===== CARD GRID ===== */}
      <div className="card-grid">
        {filteredForms.map((form) => {
          // ✅ Debug log for verifying render
          console.log("Rendering card for form:", form.id, form.config?.title);

          return (
            <div key={form.id} className="card">
              {/* ===== CARD HEADER ===== */}
              <div className="card-header">
                <div className="card-title-wrapper">
                  <h3 className="card-title">
                    {form?.config?.title || "Untitled Form"}
                  </h3>
                </div>

                {/* ⋮ Menu */}
                <div className="menu-container">
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === form.id ? null : form.id)
                    }
                  >
                    ⋮
                  </button>

                  {openMenuId === form.id && (
                    <div className="menu">
                      {isPublished(form?.status) ? (
                        <button
                          className="view-btn"
                          onClick={() => handleViewForm(form.id)}
                        >
                          View Form
                        </button>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/form-builder/edit/${form.id}`)}
                        >
                          Edit Form
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => setDeletePopup(form.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== CARD META ===== */}
              <div className="card-meta">
                {isPublished(form?.status) ? (
                  <>
                    <p className="meta-text">
                      Published by: {form?.publishedBy || "admin"}
                    </p>
                    <p className="meta-text">
                      Published Date: {formatDate(form?.publishedAt)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="meta-text">
                      Created by: {form?.createdBy || "admin"}
                    </p>
                    <p className="meta-text">
                      Created Date: {formatDate(form?.createdAt)}
                    </p>
                  </>
                )}
              </div>

              {/* ===== CARD FOOTER ===== */}
              <div className="card-footer">
                <span className={`status-btn ${getStatusClass(form?.status)}`}>
                  {getStatusText(form?.status)}
                </span>
                <button
                  className="viewresponse-btn"
                  onClick={() =>
                    navigate(`/form-builder/view/${form.id}`, {
                      state: { openTab: "responses" }, // 👈 pass tab info here
                    })
                  }

                >
                  View Responses
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== DELETE POPUP ===== */}
      {deletePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h3>Delete Form</h3>
            </div>
            <hr />
            <div className="popup-content">
              <p>
                Are you sure you want to delete this form? <br />
                It will be permanently removed.
              </p>
              <div className="popup-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setDeletePopup(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={() => confirmDelete(deletePopup)}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}