import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  // Load existing course
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/courses/${id}`);
        const course = response.data.data;

        setFormData({
          courseCode: course.courseCode || "",
          name: course.name || "",
          description: course.description || "",
          durationValue: course.duration?.value || "",
          durationUnit: course.duration?.unit || "MONTHS",
          totalFees: course.totalFees ?? "",
          syllabus: Array.isArray(course.syllabus)
            ? course.syllabus.join("\n")
            : "",
          isActive: course.isActive ?? true,
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.courseCode.trim()) {
      setError("Course code is required");
      return;
    }

    if (!formData.name.trim()) {
      setError("Course name is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        courseCode: formData.courseCode
          .trim()
          .toUpperCase(),

        name: formData.name.trim(),

        description: formData.description.trim(),

        duration: {
          value: Number(formData.durationValue),
          unit: formData.durationUnit,
        },

        totalFees:
          Number(formData.totalFees) || 0,

        syllabus: formData.syllabus
          .split("\n")
          .map((topic) => topic.trim())
          .filter(Boolean),

        isActive: formData.isActive,
      };

      await api.put(`/courses/${id}`, payload);

      alert("Course updated successfully");

      navigate(`/admin/courses/${id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">
          Loading course...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page edit-course-page">

      <div className="page-header">
        <div>
          <h1>Edit Course</h1>
          <p>Update course information</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate(`/admin/courses/${id}`)
          }
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        className="course-form"
        onSubmit={handleSubmit}
      >

        {/* Basic Information */}

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
                placeholder="Example: PYTHON-01"
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
                placeholder="Example: Python Programming"
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
              rows="4"
              placeholder="Enter course description..."
            />
          </div>
        </div>

        {/* Duration and Fees */}

        <div className="form-section">
          <h2>Duration & Fees</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Duration
              </label>

              <input
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                min="0"
                placeholder="Example: 6"
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
                Total Fees
              </label>

              <input
                type="number"
                name="totalFees"
                value={formData.totalFees}
                onChange={handleChange}
                min="0"
                placeholder="Example: 15000"
              />
            </div>

          </div>
        </div>

        {/* Syllabus */}

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
              rows="8"
              placeholder={`Enter one topic per line
Example:
Introduction to Python
Variables and Data Types
Conditional Statements
Loops
Functions
OOP`}
            />

            <small>
              Enter one syllabus topic per line.
            </small>
          </div>
        </div>

        {/* Status */}

        <div className="form-section">

          <h2>Course Status</h2>

          <label className="checkbox-row">

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

        {/* Buttons */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(`/admin/courses/${id}`)
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Update Course"}
          </button>

        </div>

      </form>
    </div>
  );
}