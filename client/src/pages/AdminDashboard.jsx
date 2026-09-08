
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await api.get("/students");
      setStudents(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to load students:",
        error.response?.data || error.message
      );
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await api.get("/courses");
      setCourses(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to load courses:",
        error.response?.data || error.message
      );
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadEnquiries = async () => {
    try {
      setLoadingEnquiries(true);
      const response = await api.get("/enquiries");
      setEnquiries(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to load enquiries:",
        error.response?.data || error.message
      );
      setEnquiries([]);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    loadStudents();
    loadCourses();
    loadEnquiries();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.admissionDate) -
        new Date(a.createdAt || a.admissionDate)
    )
    .slice(0, 5);

  const recentEnquiries = [...enquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const pendingEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.status === "NEW" ||
      enquiry.status === "FOLLOW_UP"
  ).length;

  return (
    <div className="admin-dashboard">

      <aside className="admin-sidebar">

        <div className="sidebar-logo">
          <h2>Infinity Institute</h2>
          <span>Management System</span>
        </div>

        <nav className="sidebar-menu">

          <button
            type="button"
            className="active"
            onClick={() => navigate("/admin")}
          >
            🏠 Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/students")}
          >
            👨‍🎓 Students
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
          >
            📚 Courses
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/enquiries")}
          >
            📋 Enquiries
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/batches")}
          >
            🗂️ Batches
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/fee-structures")}
          >
            💰 Fees
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/payments")}
          >
            💳 Payments
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/assignments")}
          >
            📝 Assignments
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/attendance")}
          >
            📅 Attendance
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/exams")}
          >
            📋 Exams
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/results")}
          >
            📊 Results
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/notices")}
          >
            📢 Notices
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/reports")}
          >
            📈 Reports
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/admissions")}
          >
            🎓 Admissions
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
          >
            ⚙️ Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <div className="admin-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>

          <div className="admin-user">

            <div className="admin-user-avatar">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name || "Admin"}
              </strong>

              <small>
                {user?.role || "ADMIN"}
              </small>
            </div>

          </div>

        </div>

        <div className="stats-grid">

          <div
            className="stat-card"
            onClick={() => navigate("/admin/students")}
            style={{ cursor: "pointer" }}
          >
            <span>👨‍🎓</span>

            <h3>Students</h3>

            <strong>
              {loadingStudents
                ? "..."
                : students.length}
            </strong>

            <p>Total students</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/admin/courses")}
            style={{ cursor: "pointer" }}
          >
            <span>📚</span>

            <h3>Courses</h3>

            <strong>
              {loadingCourses
                ? "..."
                : courses.length}
            </strong>

            <p>Active courses</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/admin/enquiries")}
            style={{ cursor: "pointer" }}
          >
            <span>📋</span>

            <h3>Enquiries</h3>

            <strong>
              {loadingEnquiries
                ? "..."
                : enquiries.length}
            </strong>

            <p>Total enquiries</p>
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/admin/enquiries")}
            style={{ cursor: "pointer" }}
          >
            <span>⏳</span>

            <h3>Pending</h3>

            <strong>
              {loadingEnquiries
                ? "..."
                : pendingEnquiries}
            </strong>

            <p>
              New / follow-up enquiries
            </p>
          </div>

          <div className="stat-card">
            <span>💰</span>

            <h3>Fees</h3>

            <strong>₹0</strong>

            <p>Total collected</p>
          </div>

        </div>

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Frequently used management actions
              </p>
            </div>

          </div>

          <div className="quick-actions">

            <button
              type="button"
              onClick={() => navigate("/admin/students/add")}
            >
              ➕ Add Student
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/students")}
            >
              👨‍🎓 Manage Students
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/courses/add")}
            >
              📚 Add Course
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/enquiries")}
            >
              📋 Manage Enquiries
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/payments")}
            >
              💳 Record Payment
            </button>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent Students</h2>

              <p>
                Recently registered students
              </p>
            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={() => navigate("/admin/students")}
            >
              View All →
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {loadingStudents ? (

                  <tr>
                    <td colSpan="5" className="empty">
                      Loading students...
                    </td>
                  </tr>

                ) : recentStudents.length === 0 ? (

                  <tr>
                    <td colSpan="5" className="empty">
                      No students found
                    </td>
                  </tr>

                ) : (

                  recentStudents.map((student) => (

                    <tr key={student._id}>

                      <td>
                        <strong>
                          {student.studentId}
                        </strong>
                      </td>

                      <td>
                        {student.firstName}{" "}
                        {student.lastName || ""}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>
                        {student.course || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            student.status === "ACTIVE"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {student.status}
                        </span>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent Enquiries</h2>

              <p>
                Latest enquiries received from students
              </p>
            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={() => navigate("/admin/enquiries")}
            >
              View All →
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Enquiry No.</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {loadingEnquiries ? (

                  <tr>
                    <td colSpan="6" className="empty">
                      Loading enquiries...
                    </td>
                  </tr>

                ) : recentEnquiries.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="empty">
                      No enquiries found
                    </td>
                  </tr>

                ) : (

                  recentEnquiries.map((enquiry) => (

                    <tr key={enquiry._id}>

                      <td>
                        <strong>
                          {enquiry.enquiryNumber}
                        </strong>
                      </td>

                      <td>
                        {enquiry.name}
                      </td>

                      <td>
                        {enquiry.phone}
                      </td>

                      <td>
                        {enquiry.courseId?.name || "-"}
                      </td>

                      <td>
                        <span
                          className={`enquiry-status status-${enquiry.status
                            ?.toLowerCase()
                            .replace("_", "-")}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      <td>
                        {enquiry.createdAt
                          ? new Date(
                              enquiry.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent Payments</h2>

              <p>
                Latest fee payments
              </p>
            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={() => navigate("/admin/payments")}
            >
              View All →
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Receipt No.</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td colSpan="5" className="empty">
                    No payments found
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}
