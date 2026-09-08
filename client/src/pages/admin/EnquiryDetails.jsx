import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function EnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "WEBSITE",
    status: "NEW",
    followUpDate: "",
    message: "",
    notes: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // --------------------------------
  // LOAD ENQUIRY
  // --------------------------------
  useEffect(() => {
    loadEnquiry();
  }, [id]);

  async function loadEnquiry() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/enquiries/${id}`);

      const data = response.data.data;

      setEnquiry(data);

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        source: data.source || "WEBSITE",
        status: data.status || "NEW",
        followUpDate: data.followUpDate
          ? new Date(data.followUpDate).toISOString().slice(0, 16)
          : "",
        message: data.message || "",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load enquiry"
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // FORM CHANGE
  // --------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // --------------------------------
  // SAVE
  // --------------------------------
  async function handleSave(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const response = await api.put(`/enquiries/${id}`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        source: form.source,
        status: form.status,
        followUpDate: form.followUpDate || undefined,
        message: form.message.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });

      setEnquiry(response.data.data);

     toast.success("Enquiry updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

     toast.error(
  err.response?.data?.message ||
    "Failed to update enquiry"
);
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------
  // DELETE
  // --------------------------------
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/enquiries/${id}`);

      navigate("/admin/enquiries");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete enquiry"
      );
    }
  }

  // --------------------------------
  // LOADING
  // --------------------------------
  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Enquiry Details</h1>
        </div>

        <div className="content-card">
          <p>Loading enquiry...</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR / NOT FOUND
  // --------------------------------
  if (!enquiry) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Enquiry Details</h1>
        </div>

        <div className="content-card">
          <div className="enquiry-error">
            {error || "Enquiry not found"}
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/admin/enquiries")}
          >
            ← Back to Enquiries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="page-header">
        <div>
          <h1>Enquiry Details</h1>

          <p>
            Manage enquiry information, status and follow-up.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/admin/enquiries")}
        >
          ← Back to Enquiries
        </button>
      </div>

      {/* ============================= */}
      {/* MESSAGES */}
      {/* ============================= */}

      {success && (
        <div className="enquiry-success">
          {success}
        </div>
      )}

      {error && (
        <div className="enquiry-error">
          {error}
        </div>
      )}

      {/* ============================= */}
      {/* ENQUIRY HEADER CARD */}
      {/* ============================= */}

      <div className="content-card enquiry-summary">

        <div>
          <span className="summary-label">
            Enquiry Number
          </span>

          <strong className="summary-number">
            {enquiry.enquiryNumber || "N/A"}
          </strong>
        </div>

        <div>
          <span className="summary-label">
            Created
          </span>

          <strong>
            {enquiry.createdAt
              ? new Date(
                  enquiry.createdAt
                ).toLocaleString()
              : "N/A"}
          </strong>
        </div>

        <div>
          <span className="summary-label">
            Current Status
          </span>

          <span
            className={`enquiry-status status-${(
              enquiry.status || ""
            ).toLowerCase()}`}
          >
            {enquiry.status}
          </span>
        </div>

      </div>

      {/* ============================= */}
      {/* EDIT FORM */}
      {/* ============================= */}

      <form
        className="content-card"
        onSubmit={handleSave}
      >

        <div className="section-title">
          <h2>Enquiry Information</h2>
        </div>

        <div className="form-grid">

          {/* NAME */}

          <div className="form-group">
            <label>
              Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter name"
            />
          </div>

          {/* PHONE */}

          <div className="form-group">
            <label>
              Phone <span>*</span>
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          {/* SOURCE */}

          <div className="form-group">
            <label>Source</label>

            <select
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              <option value="WEBSITE">
                Website
              </option>

              <option value="WALK_IN">
                Walk In
              </option>

              <option value="PHONE">
                Phone
              </option>

              <option value="WHATSAPP">
                WhatsApp
              </option>

              <option value="REFERRAL">
                Referral
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="NEW">
                New
              </option>

              <option value="CONTACTED">
                Contacted
              </option>

              <option value="FOLLOW_UP">
                Follow Up
              </option>

              <option value="CONVERTED">
                Converted
              </option>

              <option value="NOT_INTERESTED">
                Not Interested
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>
          </div>

          {/* FOLLOW UP */}

          <div className="form-group">
            <label>
              Follow-up Date
            </label>

            <input
              type="datetime-local"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* MESSAGE */}

        <div className="form-group full-width">
          <label>
            Enquiry Message
          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Enquiry message..."
          />
        </div>

        {/* NOTES */}

        <div className="form-group full-width">
          <label>
            Internal Notes
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="5"
            placeholder="Add internal notes about this enquiry..."
          />
        </div>

        {/* BUTTONS */}

        <div className="form-actions">

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/admin/enquiries")
            }
          >
            Cancel
          </button>

        </div>

      </form>

      {/* ============================= */}
      {/* DANGER ZONE */}
      {/* ============================= */}

      <div className="content-card danger-zone">

        <div>
          <h2>Danger Zone</h2>

          <p>
            Permanently delete this enquiry.
            This action cannot be undone.
          </p>
        </div>

        <button
          type="button"
          className="danger-button"
          onClick={handleDelete}
        >
          🗑 Delete Enquiry
        </button>

      </div>

    </div>
  );
}