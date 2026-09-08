import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function AdmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* =====================================================
     LOAD ADMISSION
  ===================================================== */

  const loadAdmission = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/admissions/${id}`);

      setAdmission(response.data.data);
    } catch (error) {
      console.error(
        "Failed to load admission:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load admission"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmission();
  }, [id]);

  /* =====================================================
     APPROVE
  ===================================================== */

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this admission?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.put(
        `/admissions/${id}/approve`
      );

      toast.success(
        response.data.message ||
          "Admission approved successfully"
      );

      await loadAdmission();
    } catch (error) {
      console.error(
        "Approve admission error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to approve admission"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     REJECT
  ===================================================== */

  const handleReject = async () => {
    const remarks = window.prompt(
      "Enter rejection remarks:"
    );

    if (remarks === null) return;

    try {
      setActionLoading(true);

      const response = await api.put(
        `/admissions/${id}/reject`,
        {
          remarks: remarks.trim()
        }
      );

      toast.success(
        response.data.message ||
          "Admission rejected successfully"
      );

      await loadAdmission();
    } catch (error) {
      console.error(
        "Reject admission error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to reject admission"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = async () => {
    const remarks = window.prompt(
      "Enter cancellation remarks:"
    );

    if (remarks === null) return;

    try {
      setActionLoading(true);

      const response = await api.put(
        `/admissions/${id}/cancel`,
        {
          remarks: remarks.trim()
        }
      );

      toast.success(
        response.data.message ||
          "Admission cancelled successfully"
      );

      await loadAdmission();
    } catch (error) {
      console.error(
        "Cancel admission error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to cancel admission"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this admission?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/admissions/${id}`
      );

      toast.success(
        response.data.message ||
          "Admission deleted successfully"
      );

      navigate("/admin/admissions");
    } catch (error) {
      console.error(
        "Delete admission error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete admission"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "admission-status approved";

      case "REJECTED":
        return "admission-status rejected";

      case "CANCELLED":
        return "admission-status cancelled";

      case "PENDING":
      default:
        return "admission-status pending";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="admission-details-page">
        <div className="details-loading">
          Loading admission details...
        </div>
      </div>
    );
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!admission) {
    return (
      <div className="admission-details-page">
        <div className="details-empty">
          <h2>Admission not found</h2>

          <p>
            The admission record could not be found.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/admin/admissions")
            }
          >
            ← Back to Admissions
          </button>
        </div>
      </div>
    );
  }

  const student = admission.studentId;
  const course = admission.courseId;
  const enquiry = admission.enquiryId;
  const reviewedBy = admission.reviewedBy;

  return (
    <div className="admission-details-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admission-details-header">

        <div>
          <button
            className="back-button"
            onClick={() =>
              navigate("/admin/admissions")
            }
          >
            ← Back to Admissions
          </button>

          <h1>Admission Details</h1>

          <p>
            Application Number:{" "}
            <strong>
              {admission.applicationNumber}
            </strong>
          </p>
        </div>

        <span
          className={getStatusClass(
            admission.status
          )}
        >
          {admission.status}
        </span>

      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="admission-detail-actions">

        {admission.status === "PENDING" && (
          <>
            <button
              className="approve-button"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Processing..."
                : "✓ Approve Admission"}
            </button>

            <button
              className="reject-button"
              onClick={handleReject}
              disabled={actionLoading}
            >
              ✕ Reject
            </button>

            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              Cancel
            </button>
          </>
        )}

        {(admission.status === "APPROVED" ||
          admission.status === "REJECTED") && (
          <button
            className="cancel-button"
            onClick={handleCancel}
            disabled={actionLoading}
          >
            Cancel Admission
          </button>
        )}

        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={actionLoading}
        >
          🗑 Delete
        </button>

      </div>

      {/* =================================================
          APPLICATION INFORMATION
      ================================================= */}

      <section className="admission-detail-card">

        <div className="detail-card-title">
          <h2>Application Information</h2>
        </div>

        <div className="admission-info-grid">

          <div className="info-item">
            <label>Application Number</label>
            <strong>
              {admission.applicationNumber || "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Application Date</label>
            <span>
              {admission.applicationDate
                ? new Date(
                    admission.applicationDate
                  ).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Status</label>
            <span
              className={getStatusClass(
                admission.status
              )}
            >
              {admission.status}
            </span>
          </div>

          <div className="info-item">
            <label>Created</label>
            <span>
              {admission.createdAt
                ? new Date(
                    admission.createdAt
                  ).toLocaleString()
                : "-"}
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          STUDENT INFORMATION
      ================================================= */}

      <section className="admission-detail-card">

        <div className="detail-card-title">
          <h2>Student Information</h2>
        </div>

        <div className="admission-info-grid">

          <div className="info-item">
            <label>Student ID</label>
            <strong>
              {student?.studentId || "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Student Name</label>
            <strong>
              {student
                ? `${student.firstName || ""} ${
                    student.lastName || ""
                  }`.trim()
                : "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Phone</label>
            <span>
              {student?.phone || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Email</label>
            <span>
              {student?.email || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Gender</label>
            <span>
              {student?.gender || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Date of Birth</label>
            <span>
              {student?.dateOfBirth
                ? new Date(
                    student.dateOfBirth
                  ).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Guardian Name</label>
            <span>
              {student?.guardianName || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Guardian Phone</label>
            <span>
              {student?.guardianPhone || "-"}
            </span>
          </div>

          <div className="info-item full-width">
            <label>Address</label>
            <span>
              {student?.address || "-"}
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          COURSE INFORMATION
      ================================================= */}

      <section className="admission-detail-card">

        <div className="detail-card-title">
          <h2>Course Information</h2>
        </div>

        <div className="admission-info-grid">

          <div className="info-item">
            <label>Course Code</label>
            <strong>
              {course?.courseCode || "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Course Name</label>
            <strong>
              {course?.name || "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Duration</label>
            <span>
              {course?.duration?.value
                ? `${course.duration.value} ${
                    course.duration.unit || ""
                  }`
                : "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Total Fees</label>
            <strong>
              {typeof course?.totalFees === "number"
                ? `₹${course.totalFees.toLocaleString(
                    "en-IN"
                  )}`
                : "-"}
            </strong>
          </div>

          <div className="info-item full-width">
            <label>Description</label>
            <span>
              {course?.description || "-"}
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          ENQUIRY INFORMATION
      ================================================= */}

      <section className="admission-detail-card">

        <div className="detail-card-title">
          <h2>Enquiry Information</h2>
        </div>

        <div className="admission-info-grid">

          <div className="info-item">
            <label>Enquiry Number</label>
            <strong>
              {enquiry?.enquiryNumber || "-"}
            </strong>
          </div>

          <div className="info-item">
            <label>Enquiry Name</label>
            <span>
              {enquiry?.name || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Source</label>
            <span>
              {enquiry?.source || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Enquiry Status</label>
            <span>
              {enquiry?.status || "-"}
            </span>
          </div>

          <div className="info-item full-width">
            <label>Message</label>
            <span>
              {enquiry?.message || "-"}
            </span>
          </div>

        </div>

      </section>

      {/* =================================================
          REVIEW INFORMATION
      ================================================= */}

      <section className="admission-detail-card">

        <div className="detail-card-title">
          <h2>Review Information</h2>
        </div>

        <div className="admission-info-grid">

          <div className="info-item">
            <label>Reviewed By</label>
            <span>
              {reviewedBy?.name || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Reviewer Email</label>
            <span>
              {reviewedBy?.email || "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Reviewed At</label>
            <span>
              {admission.reviewedAt
                ? new Date(
                    admission.reviewedAt
                  ).toLocaleString()
                : "-"}
            </span>
          </div>

          <div className="info-item">
            <label>Batch</label>
            <span>
              {admission.batchId?.name || "-"}
            </span>
          </div>

          <div className="info-item full-width">
            <label>Remarks</label>
            <span>
              {admission.remarks || "-"}
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}