import React, { useEffect, useState } from "react";
import HomePlaceholder from "./HomePlaceholder";
import FormList from "./FormList";
import { useNavigate } from "react-router-dom";

import { getAllForms, deleteForm } from "../api/formService";

export default function FormBuilderHome() {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Debounce timer for search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getForms(search);
    }, 400); 
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCreateForm = () => {
    navigate("/create-form");
  };

  const getForms = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllForms(0, 10, searchTerm);
      console.log('Forms data:', response.data);
      console.log('First form:', response.data[0]);
      setForms(response.data);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the delete API
      await deleteForm(id);
      
      // Remove the deleted form from state
      setForms(forms?.filter((form) => form.id !== id));
      setOpenMenuId(null);
      
      console.log('Form deleted successfully:', id);
    } catch (err) {
      console.error('Error deleting form:', err);
      setError('Failed to delete form');
      alert('Failed to delete form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && forms.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading forms...</div>;
  }

  if (error && forms.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return forms?.length === 0 ? (
    <HomePlaceholder onCreate={handleCreateForm} />
  ) : (
    <FormList
      forms={forms}
      search={search}
      setSearch={setSearch}
      openMenuId={openMenuId}
      setOpenMenuId={setOpenMenuId}
      handleCreateForm={handleCreateForm}
      handleDelete={handleDelete}
      loading={loading}
    />
  );
}
