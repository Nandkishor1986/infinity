import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");

      setCourses(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const text = `
      ${course.courseCode}
      ${course.name}
      ${course.description || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>Course Management</h1>
          <p>Manage institute courses</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/admin/courses/add")}
        >
          + Add Course
        </button>

      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by course code or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="loading">
          Loading courses...
        </div>
      ) : (

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Total Fees</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCourses.length === 0 ? (

                <tr>
                  <td colSpan="6" className="empty">
                    No courses found
                  </td>
                </tr>

              ) : (

                filteredCourses.map((course) => (

                  <tr key={course._id}>

                    <td>
                      <strong>
                        {course.courseCode}
                      </strong>
                    </td>

                    <td>
                      {course.name}
                    </td>

                    <td>
                      {course.duration?.value
                        ? `${course.duration.value} ${
                            course.duration.unit
                              ?.toLowerCase()
                          }`
                        : "-"}
                    </td>

                    <td>
                      ₹{course.totalFees || 0}
                    </td>

                    <td>

                      <span
                        className={
                          course.isActive
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {course.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>

                    </td>

                    <td>

                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(
                            `/admin/courses/${course._id}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}