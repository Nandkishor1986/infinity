import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/students/${id}`);

      setStudent(response.data.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load student."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);

      alert("Student deleted successfully.");

      navigate("/admin/students");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete student."
      );
    }
  };

  if (loading) {
    return (
      <main className="student-details-page">
        <div className="student-details-card">
          <div className="loading-box">
            Loading student...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="student-details-page">
        <div className="student-details-card">

          <div className="alert error-alert">
            {error}
          </div>

          <button
            className="button"
            onClick={() =>
              navigate("/admin/students")
            }
          >
            ← Back to Students
          </button>

        </div>
      </main>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <main className="student-details-page">

      {/* Header */}

      <div className="student-details-header">

        <div>

          <p className="eyebrow">
            INFINITY COMPUTER INSTITUTE
          </p>

          <h1>
            Student Details
          </h1>

          <p className="muted">
            View student information and admission details.
          </p>

        </div>

        <button
          className="button secondary-button"
          onClick={() =>
            navigate("/admin/students")
          }
        >
          ← Back to Students
        </button>

      </div>


      {/* Student Profile */}

      <div className="student-profile-card">

        <div className="large-student-avatar">

          {student.firstName
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <div className="student-profile-info">

          <h2>
            {student.firstName}{" "}
            {student.lastName || ""}
          </h2>

          <p>
            Student ID:
            <strong>
              {" "}
              {student.studentId}
            </strong>
          </p>

          <span
            className={`status-badge ${
              student.status?.toLowerCase()
            }`}
          >
            {student.status}
          </span>

        </div>

      </div>


      {/* Personal Information */}

      <section className="details-section">

        <h2>
          Personal Information
        </h2>

        <div className="details-grid">

          <DetailItem
            label="First Name"
            value={student.firstName}
          />

          <DetailItem
            label="Last Name"
            value={student.lastName}
          />

          <DetailItem
            label="Date of Birth"
            value={
              student.dateOfBirth
                ? new Date(
                    student.dateOfBirth
                  ).toLocaleDateString()
                : "-"
            }
          />

          <DetailItem
            label="Gender"
            value={student.gender}
          />

          <DetailItem
            label="Phone"
            value={student.phone}
          />

          <DetailItem
            label="Email"
            value={student.email}
          />

          <DetailItem
            label="Address"
            value={student.address}
          />

        </div>

      </section>


      {/* Guardian Information */}

      <section className="details-section">

        <h2>
          Guardian Information
        </h2>

        <div className="details-grid">

          <DetailItem
            label="Guardian Name"
            value={student.guardianName}
          />

          <DetailItem
            label="Guardian Phone"
            value={student.guardianPhone}
          />

        </div>

      </section>


      {/* Course Information */}

      <section className="details-section">

        <h2>
          Course & Batch
        </h2>

        <div className="details-grid">

          <DetailItem
            label="Course"
            value={student.course}
          />

          <DetailItem
            label="Batch"
            value={student.batch}
          />

        </div>

      </section>


      {/* Admission Information */}

      <section className="details-section">

        <h2>
          Admission Information
        </h2>

        <div className="details-grid">

          <DetailItem
            label="Student ID"
            value={student.studentId}
          />

          <DetailItem
            label="Admission Date"
            value={
              student.admissionDate
                ? new Date(
                    student.admissionDate
                  ).toLocaleDateString()
                : "-"
            }
          />

          <DetailItem
            label="Status"
            value={student.status}
          />

          <DetailItem
            label="Created"
            value={
              student.createdAt
                ? new Date(
                    student.createdAt
                  ).toLocaleDateString()
                : "-"
            }
          />

        </div>

      </section>


      {/* Notes */}

      {student.notes && (
        <section className="details-section">

          <h2>
            Notes
          </h2>

          <div className="notes-box">
            {student.notes}
          </div>

        </section>
      )}


      {/* Actions */}

      <div className="student-actions">

        <button
          className="button"
          onClick={() =>
            navigate(
              `/admin/students/${student._id}/edit`
            )
          }
        >
          ✏️ Edit Student
        </button>

        <button
          className="delete-button"
          onClick={handleDelete}
        >
          🗑️ Delete Student
        </button>

      </div>

    </main>
  );
}


/* =========================================
   DETAIL ITEM
========================================= */

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
}