import React, { useEffect, useState } from "react";
import HomePlaceholder from "./HomePlaceholder";
import FormList from "./FormList";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { getAllForms, deleteForm } from "../api/formService";
import SearchIcon from "../assets/SearchIcon.png";

export default function FormBuilderHome() {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { 
    setFormId, 
    setFormName, 
    setDescription, 
    setVisibility, 
    setFields, 
    setHeaderCard, 
    setActiveTab ,
    setReadOnly
  } = useFormContext();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getForms(search);
    }, 400); 
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCreateForm = () => {
    
    setFormId(null);
    setFormName("");
    setDescription("");
    setVisibility(false);
    setFields([]);
    setHeaderCard({ title: "", description: "" });
    setActiveTab("configuration");
    navigate("/create-form");
    setReadOnly(false)
  };

  const getForms = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllForms(0, 10, searchTerm);
      setForms(response.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteForm(id);
      setForms(forms?.filter((form) => form.id !== id));
      setOpenMenuId(null);
      console.log("Form deleted successfully:", id);
    } catch (err) {
      console.error("Error deleting form:", err);
      setError("Failed to delete form");
      alert("Failed to delete form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && forms.length === 0) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading forms...</div>;
  }

  if (error && forms.length === 0) {
    return <div style={{ padding: "20px", textAlign: "center", color: "red" }}>{error}</div>;
  }

  
  return (
    <div className="formbuilder-home">
      <div className="header">
        <p>Form List</p>
        <div className="search-container">
          <div className="search-input-wrapper">
            <img src={SearchIcon} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="create-btn" onClick={handleCreateForm}>
            Create Form
          </button>
        </div>
      </div>

     
      {forms?.length === 0 ? (
        <HomePlaceholder onCreate={handleCreateForm} />
      ) : (
        <FormList
          forms={forms}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          handleDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
}
