import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    status: "ACTIVE",
    notes: "",
  });

  // =========================
  // LOAD STUDENT
  // =========================

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/students/${id}`);

      const student = response.data.data;

      setForm({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
        email: student.email || "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.substring(0, 10)
          : "",
        gender: student.gender || "",
        address: student.address || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        admissionDate: student.admissionDate
          ? student.admissionDate.substring(0, 10)
          : "",
        course: student.course || "",
        batch: student.batch || "",
        status: student.status || "ACTIVE",
        notes: student.notes || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load student."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE STUDENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/students/${id}`,
        form
      );

      setMessage(
        response.data.message ||
          "Student updated successfully."
      );

      setTimeout(() => {
        navigate(`/admin/students/${id}`);
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update student."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="add-student-page">
        <div className="student-form-card">
          <div className="loading-box">
            Loading student...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="add-student-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="add-student-header">

        <div>
          <p className="eyebrow">
            INFINITY COMPUTER INSTITUTE
          </p>

          <h1>
            Edit Student
          </h1>

          <p className="muted">
            Update student information.
          </p>
        </div>

        <button
          type="button"
          className="button secondary-button"
          onClick={() =>
            navigate(`/admin/students/${id}`)
          }
        >
          ← Back
        </button>

      </div>


      {/* =========================
          FORM
      ========================= */}

      <div className="student-form-card">

        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFORMATION */}

          <section className="form-section">

            <h2>
              Personal Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  First Name *
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />

              </div>


              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />

              </div>


              <div className="form-group">

                <label>
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>


              <div className="form-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            <div className="form-group">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />

            </div>

          </section>


          {/* GUARDIAN */}

          <section className="form-section">

            <h2>
              Guardian Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Guardian Name
                </label>

                <input
                  type="text"
                  name="guardianName"
                  value={form.guardianName}
                  onChange={handleChange}
                  placeholder="Enter guardian name"
                />

              </div>


              <div className="form-group">

                <label>
                  Guardian Phone
                </label>

                <input
                  type="tel"
                  name="guardianPhone"
                  value={form.guardianPhone}
                  onChange={handleChange}
                  placeholder="Enter guardian phone"
                />

              </div>

            </div>

          </section>


          {/* COURSE */}

          <section className="form-section">

            <h2>
              Course & Batch
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Course
                </label>

                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Enter course"
                />

              </div>


              <div className="form-group">

                <label>
                  Batch
                </label>

                <input
                  type="text"
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  placeholder="Enter batch"
                />

              </div>

            </div>

          </section>


          {/* ADMISSION */}

          <section className="form-section">

            <h2>
              Admission Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Admission Date
                </label>

                <input
                  type="date"
                  name="admissionDate"
                  value={form.admissionDate}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* NOTES */}

          <section className="form-section">

            <h2>
              Notes
            </h2>

            <div className="form-group">

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Enter additional notes"
                rows="4"
              />

            </div>

          </section>


          {/* MESSAGES */}

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          {message && (
            <div className="alert success-alert">
              {message}
            </div>
          )}


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="button secondary-button"
              onClick={() =>
                navigate(`/admin/students/${id}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "💾 Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}