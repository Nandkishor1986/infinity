import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AddCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseCode: "",
    name: "",
    description: "",
    durationValue: "",
    durationUnit: "MONTHS",
    totalFees: "",
    syllabus: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.courseCode.trim()) {
      setError("Course code is required");
      return;
    }

    if (!formData.name.trim()) {
      setError("Course name is required");
      return;
    }

    try {
      setLoading(true);

      const syllabusArray = formData.syllabus
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await api.post("/courses", {
        courseCode: formData.courseCode.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: {
          value: Number(formData.durationValue),
          unit: formData.durationUnit,
        },
        totalFees: Number(formData.totalFees) || 0,
        syllabus: syllabusArray,
        isActive: formData.isActive,
      });

      setSuccess(
        `Course "${response.data.data.name}" created successfully`
      );

      setTimeout(() => {
        navigate("/admin/courses");
      }, 1200);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Add Course</h1>
          <p>Create a new institute course</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/admin/courses")}
        >
          ← Back to Courses
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* FORM */}

      <form
        className="course-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <div className="form-section">

          <h2>Basic Information</h2>

          <div className="form-grid">

            <div className="form-group">

              <label>
                Course Code *
              </label>

              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="Example: PY-ADV"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Course Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Advanced Python"
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              rows="4"
            />

          </div>

        </div>

        {/* DURATION & FEES */}

        <div className="form-section">

          <h2>Duration & Fees</h2>

          <div className="form-grid three-columns">

            <div className="form-group">

              <label>
                Duration
              </label>

              <input
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                min="1"
                placeholder="6"
              />

            </div>

            <div className="form-group">

              <label>
                Duration Unit
              </label>

              <select
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleChange}
              >
                <option value="DAYS">
                  Days
                </option>

                <option value="MONTHS">
                  Months
                </option>

                <option value="YEARS">
                  Years
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Total Fees (₹)
              </label>

              <input
                type="number"
                name="totalFees"
                value={formData.totalFees}
                onChange={handleChange}
                min="0"
                placeholder="15000"
              />

            </div>

          </div>

        </div>

        {/* SYLLABUS */}

        <div className="form-section">

          <h2>Syllabus</h2>

          <div className="form-group">

            <label>
              Syllabus Topics
            </label>

            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              placeholder={`Enter one topic per line

Example:
Python Basics
OOP
File Handling
Database
NumPy
Pandas
Projects`}
              rows="8"
            />

            <small>
              Enter each syllabus topic on a new line.
            </small>

          </div>

        </div>

        {/* STATUS */}

        <div className="form-section">

          <h2>Course Status</h2>

          <label className="checkbox-label">

            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />

            <span>
              Course is Active
            </span>

          </label>

        </div>

        {/* BUTTONS */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/admin/courses")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Course..."
              : "Create Course"}
          </button>

        </div>

      </form>

    </div>
  );
}