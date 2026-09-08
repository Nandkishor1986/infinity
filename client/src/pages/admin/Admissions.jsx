import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function Admissions() {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoading, setActionLoading] = useState("");

  // ==========================================
  // LOAD ADMISSIONS
  // ==========================================
  const loadAdmissions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admissions");

      setAdmissions(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load admissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissions();
  }, []);

  // ==========================================
  // FILTER ADMISSIONS
  // ==========================================
  const filteredAdmissions = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return admissions.filter((admission) => {
      const student = admission.studentId;
      const course = admission.courseId;

      const matchesSearch =
        !searchText ||
        admission.applicationNumber
          ?.toLowerCase()
          .includes(searchText) ||
        student?.studentId
          ?.toLowerCase()
          .includes(searchText) ||
        `${student?.firstName || ""} ${
          student?.lastName || ""
        }`
          .toLowerCase()
          .includes(searchText) ||
        course?.name
          ?.toLowerCase()
          .includes(searchText) ||
        course?.courseCode
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        admission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [admissions, search, statusFilter]);

  // ==========================================
  // APPROVE
  // ==========================================
  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this admission?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      const response = await api.put(
        `/admissions/${id}/approve`
      );

      toast.success(
        response.data.message ||
          "Admission approved successfully"
      );

      await loadAdmissions();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve admission"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // REJECT
  // ==========================================
  const handleReject = async (id) => {
    const remarks = window.prompt(
      "Enter rejection remarks:"
    );

    if (remarks === null) return;

    try {
      setActionLoading(id);

      const response = await api.put(
        `/admissions/${id}/reject`,
        {
          remarks: remarks.trim(),
        }
      );

      toast.success(
        response.data.message ||
          "Admission rejected successfully"
      );

      await loadAdmissions();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reject admission"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================
  const handleCancel = async (id) => {
    const remarks = window.prompt(
      "Enter cancellation remarks:"
    );

    if (remarks === null) return;

    try {
      setActionLoading(id);

      const response = await api.put(
        `/admissions/${id}/cancel`,
        {
          remarks: remarks.trim(),
        }
      );

      toast.success(
        response.data.message ||
          "Admission cancelled successfully"
      );

      await loadAdmissions();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to cancel admission"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this admission?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      const response = await api.delete(
        `/admissions/${id}`
      );

      toast.success(
        response.data.message ||
          "Admission deleted successfully"
      );

      await loadAdmissions();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete admission"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "admission-status pending";

      case "APPROVED":
        return "admission-status approved";

      case "REJECTED":
        return "admission-status rejected";

      case "CANCELLED":
        return "admission-status cancelled";

      default:
        return "admission-status";
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================
  const counts = {
    all: admissions.length,

    pending: admissions.filter(
      (item) => item.status === "PENDING"
    ).length,

    approved: admissions.filter(
      (item) => item.status === "APPROVED"
    ).length,

    rejected: admissions.filter(
      (item) => item.status === "REJECTED"
    ).length,

    cancelled: admissions.filter(
      (item) => item.status === "CANCELLED"
    ).length,
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="admin-page">
        <div className="page-card">
          <p>Loading admissions...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Admissions</h1>
          <p>
            Manage student admission applications
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadAdmissions}
        >
          ↻ Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="admission-summary">
        <div className="admission-summary-card">
          <span>Total</span>
          <strong>{counts.all}</strong>
        </div>

        <div className="admission-summary-card">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </div>

        <div className="admission-summary-card">
          <span>Approved</span>
          <strong>{counts.approved}</strong>
        </div>

        <div className="admission-summary-card">
          <span>Rejected</span>
          <strong>{counts.rejected}</strong>
        </div>

        <div className="admission-summary-card">
          <span>Cancelled</span>
          <strong>{counts.cancelled}</strong>
        </div>
      </div>

      {/* FILTERS */}
      <div className="page-card admission-filter-card">
        <div className="admission-filters">
          <input
            type="text"
            placeholder="Search application, student or course..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="page-card">
        <div className="section-title">
          <h2>
            Admission Applications
          </h2>

          <span>
            {filteredAdmissions.length} result
            {filteredAdmissions.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {filteredAdmissions.length === 0 ? (
          <div className="empty-state">
            <h3>No admissions found</h3>
            <p>
              No admission applications match your
              current filters.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmissions.map(
                  (admission) => {
                    const student =
                      admission.studentId;

                    const course =
                      admission.courseId;

                    const isActionLoading =
                      actionLoading ===
                      admission._id;

                    return (
                      <tr
                        key={admission._id}
                      >
                        <td>
                          <strong>
                            {
                              admission.applicationNumber
                            }
                          </strong>
                        </td>

                        <td>
                          <div>
                            <strong>
                              {
                                student?.firstName
                              }{" "}
                              {
                                student?.lastName ||
                                  ""
                              }
                            </strong>

                            <small>
                              {
                                student?.studentId
                              }
                            </small>
                          </div>
                        </td>

                        <td>
                          <div>
                            <strong>
                              {course?.name ||
                                "N/A"}
                            </strong>

                            <small>
                              {
                                course?.courseCode
                              }
                            </small>
                          </div>
                        </td>

                        <td>
                          {admission.applicationDate
                            ? new Date(
                                admission.applicationDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              admission.status
                            )}
                          >
                            {admission.status}
                          </span>
                        </td>

                        <td>
                          <div className="admission-actions">
                            <button
                              className="table-action view"
                              onClick={() =>
                                navigate(
                                  `/admin/admissions/${admission._id}`
                                )
                              }
                            >
                              View
                            </button>

                            {admission.status ===
                              "PENDING" && (
                              <>
                                <button
                                  className="table-action approve"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleApprove(
                                      admission._id
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  className="table-action reject"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleReject(
                                      admission._id
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {admission.status ===
                              "APPROVED" && (
                              <button
                                className="table-action cancel"
                                disabled={
                                  isActionLoading
                                }
                                onClick={() =>
                                  handleCancel(
                                    admission._id
                                  )
                                }
                              >
                                Cancel
                              </button>
                            )}

                            {(admission.status ===
                              "REJECTED" ||
                              admission.status ===
                                "CANCELLED") && (
                              <button
                                className="table-action delete"
                                disabled={
                                  isActionLoading
                                }
                                onClick={() =>
                                  handleDelete(
                                    admission._id
                                  )
                                }
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}