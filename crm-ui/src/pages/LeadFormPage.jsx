import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000/api/leads/";

const stages = ["new", "contacted", "qualified", "won", "lost"];

const LeadFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined && id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    stage: "new",
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}${id}/`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error("❌ Failed to load lead", err));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit ? `${API_URL}${id}/` : API_URL;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/");
    } else {
      alert("❌ Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete this lead? This action cannot be undone.")) {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/");
      } else {
        alert("❌ Failed to delete lead");
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">
        <h2 className="mb-4 text-center fw-bold">
          {isEdit ? "✏️ Edit Lead" : "➕ Add New Lead"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Stage:</label>
            <select
              name="stage"
              className="form-select"
              value={formData.stage}
              onChange={handleChange}
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-success btn-lg px-4">
              {isEdit ? "💾 Update" : "🚀 Create"}
            </button>

            {isEdit && (
              <button
                type="button"
                className="btn btn-outline-danger btn-lg px-4"
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormPage;
