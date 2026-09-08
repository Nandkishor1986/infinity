import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    admissionDate: "",
    course: "",
    batch: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/students", {
        ...form,
        admissionDate: form.admissionDate || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
      });

      setSuccess(
        `Student created successfully. Student ID: ${response.data.data.studentId}`
      );

      setTimeout(() => {
        navigate("/admin/students");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create student."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-student-page">

      <div className="add-student-header">
        <div>
          <p className="eyebrow">
            INFINITY COMPUTER INSTITUTE
          </p>

          <h1>Add New Student</h1>

          <p className="muted">
            Enter student information to create a new student record.
          </p>
        </div>

        <button
          type="button"
          className="button secondary-button"
          onClick={() => navigate("/admin/students")}
        >
          ← Back to Students
        </button>
      </div>


      <form
        className="student-form-card"
        onSubmit={handleSubmit}
      >

        {/* PERSONAL INFORMATION */}

        <section className="form-section">

          <div className="section-heading">
            <h2>Personal Information</h2>
            <p>Basic details of the student.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>First Name *</label>

              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>


            <div className="form-group">
              <label>Last Name</label>

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>


            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

        </section>


        {/* CONTACT INFORMATION */}

        <section className="form-section">

          <div className="section-heading">
            <h2>Contact Information</h2>
            <p>Student contact details.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Phone *</label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>


            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>


            <div className="form-group full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address"
                rows="3"
              />
            </div>

          </div>

        </section>


        {/* GUARDIAN INFORMATION */}

        <section className="form-section">

          <div className="section-heading">
            <h2>Guardian Information</h2>
            <p>Parent or guardian contact details.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Guardian Name</label>

              <input
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                placeholder="Enter guardian name"
              />
            </div>


            <div className="form-group">
              <label>Guardian Phone</label>

              <input
                name="guardianPhone"
                value={form.guardianPhone}
                onChange={handleChange}
                placeholder="Enter guardian phone"
              />
            </div>

          </div>

        </section>


        {/* COURSE INFORMATION */}

        <section className="form-section">

          <div className="section-heading">
            <h2>Course & Admission</h2>
            <p>Course, batch and admission details.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Course</label>

              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. Advanced Python"
              />
            </div>


            <div className="form-group">
              <label>Batch</label>

              <input
                name="batch"
                value={form.batch}
                onChange={handleChange}
                placeholder="e.g. Morning"
              />
            </div>


            <div className="form-group">
              <label>Admission Date</label>

              <input
                type="date"
                name="admissionDate"
                value={form.admissionDate}
                onChange={handleChange}
              />
            </div>


            <div className="form-group full-width">
              <label>Notes</label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows="4"
              />
            </div>

          </div>

        </section>


        {/* MESSAGES */}

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success-alert">
            {success}
          </div>
        )}


        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="button cancel-button"
            onClick={() => navigate("/admin/students")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Student"}
          </button>

        </div>

      </form>

    </main>
  );
}