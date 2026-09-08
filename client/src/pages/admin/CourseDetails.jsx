import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/courses/${id}`);

        setCourse(response.data.data);
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

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-message">{error}</div>

        <button
          className="secondary-button"
          onClick={() => navigate("/admin/courses")}
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Course Details</h1>
          <p>View course information</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/admin/courses")}
        >
          ← Back to Courses
        </button>
      </div>

      <div className="details-card">
        <h2>{course.name}</h2>

        <div className="details-grid">
          <div>
            <strong>Course Code</strong>
            <p>{course.courseCode}</p>
          </div>

          <div>
            <strong>Course Name</strong>
            <p>{course.name}</p>
          </div>

          <div>
            <strong>Duration</strong>
            <p>
              {course.duration?.value
                ? `${course.duration.value} ${course.duration.unit?.toLowerCase()}`
                : "-"}
            </p>
          </div>

          <div>
            <strong>Total Fees</strong>
            <p>₹{course.totalFees || 0}</p>
          </div>

          <div>
            <strong>Status</strong>
            <p>
              {course.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
          </div>

          <div>
            <strong>Created</strong>
            <p>
              {course.createdAt
                ? new Date(course.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <div className="details-section">
          <h3>Description</h3>
          <p>{course.description || "No description available."}</p>
        </div>

        <div className="details-section">
          <h3>Syllabus</h3>

          {course.syllabus?.length > 0 ? (
            <ol>
              {course.syllabus.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ol>
          ) : (
            <p>No syllabus added.</p>
          )}
        </div>

        <div className="details-actions">
          <button
            className="primary-button"
            onClick={() =>
              navigate(`/admin/courses/${course._id}/edit`)
            }
          >
            Edit Course
          </button>

          <button
            className="danger-button"
            onClick={async () => {
              const confirmed = window.confirm(
                `Are you sure you want to delete "${course.name}"?`
              );

              if (!confirmed) return;

              try {
                await api.delete(`/courses/${course._id}`);

                alert("Course deleted successfully");

                navigate("/admin/courses");
              } catch (err) {
                console.error(err);

                alert(
                  err.response?.data?.message ||
                    "Failed to delete course"
                );
              }
            }}
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
}