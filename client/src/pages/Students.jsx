import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      student.studentId?.toLowerCase().includes(text) ||
      student.firstName?.toLowerCase().includes(text) ||
      student.lastName?.toLowerCase().includes(text) ||
      student.phone?.toLowerCase().includes(text) ||
      student.email?.toLowerCase().includes(text) ||
      student.course?.toLowerCase().includes(text) ||
      student.batch?.toLowerCase().includes(text)
    );
  });

  return (
    <main className="students-page">

      <div className="students-header">

        <div>
          <p className="eyebrow">
            INFINITY COMPUTER INSTITUTE
          </p>

          <h1>Student Management</h1>

          <p className="muted">
            Manage students, courses, batches and student information.
          </p>
        </div>

        <Link
          to="/admin/students/add"
          className="button"
        >
          + Add Student
        </Link>

      </div>


      <div className="students-toolbar">

        <input
          type="text"
          placeholder="Search by name, ID, phone, course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          className="button secondary-button"
          onClick={loadStudents}
        >
          Refresh
        </button>

      </div>


      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}


      <div className="students-card">

        {loading ? (
          <div className="loading-box">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-box">
            <h3>No students found</h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first student to get started."}
            </p>

            {!search && (
              <Link
                to="/admin/students/add"
                className="button"
              >
                + Add Student
              </Link>
            )}
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="students-table">

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map((student) => (
                  <tr key={student._id}>

                    <td>
                      <strong>
                        {student.studentId}
                      </strong>
                    </td>

                    <td>
                      <div className="student-name">

                        <div className="student-avatar">
                          {student.firstName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {student.firstName}{" "}
                            {student.lastName || ""}
                          </strong>

                          <small>
                            {student.email || "No email"}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      {student.phone}
                    </td>

                    <td>
                      {student.course || "-"}
                    </td>

                    <td>
                      {student.batch || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${student.status?.toLowerCase()}`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/admin/students/${student._id}`}
                        className="view-button"
                      >
                        View
                      </Link>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </main>
  );
}