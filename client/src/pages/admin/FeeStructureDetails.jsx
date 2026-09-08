
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function FeeStructureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feeStructure, setFeeStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFeeStructure();
  }, [id]);

  async function loadFeeStructure() {
    try {
      setLoading(true);

      const response = await api.get(`/fee-structures/${id}`);

      setFeeStructure(response.data.feeStructure);
    } catch (error) {
      console.error("Failed to load fee structure:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load fee structure"
      );
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  function calculateInstallmentTotal() {
    return (
      feeStructure?.installments?.reduce(
        (total, installment) =>
          total + Number(installment.amount || 0),
        0
      ) || 0
    );
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this fee structure?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(`/fee-structures/${id}`);

      toast.success("Fee structure deleted successfully");

      navigate("/admin/fee-structures");
    } catch (error) {
      console.error("Failed to delete fee structure:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete fee structure"
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="fee-details-page">
        <div className="fee-details-loading">
          Loading fee structure...
        </div>
      </div>
    );
  }

  if (!feeStructure) {
    return (
      <div className="fee-details-page">
        <div className="fee-details-empty">
          <h2>Fee Structure Not Found</h2>

          <button
            type="button"
            className="fee-back-button"
            onClick={() => navigate("/admin/fee-structures")}
          >
            ← Back to Fee Structures
          </button>
        </div>
      </div>
    );
  }

  const installmentTotal = calculateInstallmentTotal();
  const remainingAmount =
    Number(feeStructure.totalAmount || 0) - installmentTotal;

  return (
    <div className="fee-details-page">
      {/* Header */}
      <div className="fee-details-header">
        <div>
          <button
            type="button"
            className="fee-back-button"
            onClick={() => navigate("/admin/fee-structures")}
          >
            ← Back
          </button>

          <h1>{feeStructure.name}</h1>

          <p>
            Fee structure details and installment plan
          </p>
        </div>

        <div className="fee-details-header-actions">
          <button
            type="button"
            className="fee-edit-button"
            onClick={() =>
              navigate(`/admin/fee-structures/${id}/edit`)
            }
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            className="fee-delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            🗑️ {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <section className="fee-details-card">
        <div className="fee-details-card-header">
          <h2>Basic Information</h2>
        </div>

        <div className="fee-details-info-grid">
          <div className="fee-details-info-item">
            <span>Fee Structure Name</span>
            <strong>{feeStructure.name}</strong>
          </div>

          <div className="fee-details-info-item">
            <span>Course</span>
            <strong>
              {feeStructure.courseId?.courseCode || "-"}
              {" - "}
              {feeStructure.courseId?.name || "-"}
            </strong>
          </div>

          <div className="fee-details-info-item">
            <span>Total Course Fee</span>
            <strong className="fee-main-amount">
              {formatAmount(feeStructure.totalAmount)}
            </strong>
          </div>

          <div className="fee-details-info-item">
            <span>Status</span>

            <strong>
              <span
                className={
                  feeStructure.isActive
                    ? "fee-detail-status-active"
                    : "fee-detail-status-inactive"
                }
              >
                {feeStructure.isActive
                  ? "ACTIVE"
                  : "INACTIVE"}
              </span>
            </strong>
          </div>

          <div className="fee-details-info-item">
            <span>Created</span>
            <strong>
              {feeStructure.createdAt
                ? new Date(
                    feeStructure.createdAt
                  ).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

          <div className="fee-details-info-item">
            <span>Last Updated</span>
            <strong>
              {feeStructure.updatedAt
                ? new Date(
                    feeStructure.updatedAt
                  ).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>
        </div>
      </section>

      {/* Installment Summary */}
      <section className="fee-details-summary-grid">
        <div className="fee-details-summary-card">
          <span>Total Course Fee</span>
          <strong>
            {formatAmount(feeStructure.totalAmount)}
          </strong>
        </div>

        <div className="fee-details-summary-card">
          <span>Installment Total</span>
          <strong>
            {formatAmount(installmentTotal)}
          </strong>
        </div>

        <div className="fee-details-summary-card">
          <span>Remaining</span>
          <strong
            className={
              remainingAmount === 0
                ? "fee-amount-complete"
                : remainingAmount < 0
                ? "fee-amount-negative"
                : ""
            }
          >
            {formatAmount(remainingAmount)}
          </strong>
        </div>

        <div className="fee-details-summary-card">
          <span>Installments</span>
          <strong>
            {feeStructure.installments?.length || 0}
          </strong>
        </div>
      </section>

      {/* Installments */}
      <section className="fee-details-card">
        <div className="fee-details-card-header">
          <div>
            <h2>Installment Plan</h2>

            <p>
              Payment schedule for this course
            </p>
          </div>
        </div>

        {feeStructure.installments?.length > 0 ? (
          <div className="fee-installment-table-container">
            <table className="fee-installment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Installment</th>
                  <th>Amount</th>
                  <th>Due After</th>
                </tr>
              </thead>

              <tbody>
                {feeStructure.installments.map(
                  (installment, index) => (
                    <tr key={installment._id || index}>
                      <td>
                        <span className="installment-index">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {installment.name}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {formatAmount(
                            installment.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        {installment.dueAfterDays === 0
                          ? "Immediately"
                          : `${installment.dueAfterDays} days`}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="2">
                    <strong>
                      Installment Total
                    </strong>
                  </td>

                  <td>
                    <strong>
                      {formatAmount(installmentTotal)}
                    </strong>
                  </td>

                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="fee-no-installments">
            No installments configured.
          </div>
        )}
      </section>
    </div>
  );
}

