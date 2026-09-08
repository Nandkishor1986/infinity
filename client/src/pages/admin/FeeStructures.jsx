
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function FeeStructures() {
  const navigate = useNavigate();

  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ==============================
  // LOAD FEE STRUCTURES
  // ==============================
  async function loadFeeStructures() {
    try {
      setLoading(true);

      const response = await api.get("/fee-structures");

      setFeeStructures(response.data.feeStructures || []);
    } catch (error) {
      console.error("Failed to load fee structures:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load fee structures"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeeStructures();
  }, []);

  // ==============================
  // DELETE
  // ==============================
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this fee structure?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/fee-structures/${id}`);

      toast.success(
        "Fee structure deleted successfully"
      );

      loadFeeStructures();
    } catch (error) {
      console.error("Failed to delete fee structure:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete fee structure"
      );
    }
  }

  // ==============================
  // SEARCH + FILTER
  // ==============================
  const filteredFeeStructures = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return feeStructures.filter((fee) => {
      const course = fee.courseId;

      const matchesSearch =
        !keyword ||
        fee.name?.toLowerCase().includes(keyword) ||
        course?.name?.toLowerCase().includes(keyword) ||
        course?.courseCode?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && fee.isActive) ||
        (statusFilter === "INACTIVE" && !fee.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [feeStructures, search, statusFilter]);

  // ==============================
  // SUMMARY
  // ==============================
  const totalStructures = feeStructures.length;

  const activeStructures = feeStructures.filter(
    (fee) => fee.isActive
  ).length;

  const inactiveStructures = feeStructures.filter(
    (fee) => !fee.isActive
  ).length;

  // ==============================
  // FORMAT CURRENCY
  // ==============================
  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  // ==============================
  // PAGE
  // ==============================
  return (
    <div className="fee-structures-page">

      {/* ================= HEADER ================= */}
      <div className="fee-structures-header">
        <div>
          <h1>Fee Structures</h1>

          <p>
            Manage course fees and installment plans
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate("/admin/fee-structures/add")
          }
        >
          + Add Fee Structure
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="fee-summary-grid">

        <div className="fee-summary-card">
          <span>Total Structures</span>
          <strong>{totalStructures}</strong>
        </div>

        <div className="fee-summary-card">
          <span>Active</span>
          <strong>{activeStructures}</strong>
        </div>

        <div className="fee-summary-card">
          <span>Inactive</span>
          <strong>{inactiveStructures}</strong>
        </div>

      </div>

      {/* ================= FILTERS ================= */}
      <div className="fee-filter-bar">

        <input
          type="text"
          placeholder="Search by fee name, course name or code..."
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
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

      </div>

      {/* ================= TABLE ================= */}
      <div className="fee-table-container">

        {loading ? (

          <div className="fee-loading">
            Loading fee structures...
          </div>

        ) : filteredFeeStructures.length === 0 ? (

          <div className="fee-empty">

            <h3>
              No fee structures found
            </h3>

            <p>
              Create your first fee structure
              to get started.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/admin/fee-structures/add"
                )
              }
            >
              + Add Fee Structure
            </button>

          </div>

        ) : (

          <table className="fee-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Fee Structure</th>
                <th>Course</th>
                <th>Total Amount</th>
                <th>Installments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredFeeStructures.map(
                (fee, index) => {

                  const course = fee.courseId;

                  return (
                    <tr key={fee._id}>

                      {/* NUMBER */}
                      <td>
                        {index + 1}
                      </td>

                      {/* FEE NAME */}
                      <td>
                        <strong>
                          {fee.name}
                        </strong>
                      </td>

                      {/* COURSE */}
                      <td>

                        <div>
                          <strong>
                            {course?.courseCode || "-"}
                          </strong>

                          <small>
                            {course?.name ||
                              "Course not found"}
                          </small>
                        </div>

                      </td>

                      {/* TOTAL */}
                      <td>
                        <strong>
                          {formatAmount(
                            fee.totalAmount
                          )}
                        </strong>
                      </td>

                      {/* INSTALLMENTS */}
                      <td>
                        {fee.installments?.length || 0}
                      </td>

                      {/* STATUS */}
                      <td>

                        <span
                          className={
                            fee.isActive
                              ? "fee-status-active"
                              : "fee-status-inactive"
                          }
                        >
                          {fee.isActive
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td>

                        <div className="fee-action-buttons">

                          {/* VIEW */}
                          <button
                            type="button"
                            className="action-view"
                            onClick={() =>
                              navigate(
                                `/admin/fee-structures/${fee._id}`
                              )
                            }
                          >
                            View
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            className="action-edit"
                            onClick={() =>
                              navigate(
                                `/admin/fee-structures/${fee._id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="action-delete"
                            onClick={() =>
                              handleDelete(fee._id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}
