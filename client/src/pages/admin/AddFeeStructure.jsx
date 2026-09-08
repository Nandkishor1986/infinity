import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function AddFeeStructure() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    name: "",
    totalAmount: "",
    isActive: true,
  });

  const [installments, setInstallments] = useState([
    {
      name: "",
      amount: "",
      dueAfterDays: "0",
    },
  ]);

  // =========================================
  // LOAD COURSES
  // =========================================

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoadingCourses(true);

      const response = await api.get("/courses");

      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Failed to load courses:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load courses"
      );
    } finally {
      setLoadingCourses(false);
    }
  }

  // =========================================
  // FORM CHANGE
  // =========================================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =========================================
  // INSTALLMENT CHANGE
  // =========================================

  function handleInstallmentChange(index, field, value) {
    setInstallments((previous) =>
      previous.map((installment, installmentIndex) =>
        installmentIndex === index
          ? {
              ...installment,
              [field]: value,
            }
          : installment
      )
    );
  }

  // =========================================
  // ADD INSTALLMENT
  // =========================================

  function addInstallment() {
    setInstallments((previous) => [
      ...previous,
      {
        name: "",
        amount: "",
        dueAfterDays: "0",
      },
    ]);
  }

  // =========================================
  // REMOVE INSTALLMENT
  // =========================================

  function removeInstallment(index) {
    if (installments.length === 1) {
      toast.warning(
        "At least one installment is required"
      );
      return;
    }

    setInstallments((previous) =>
      previous.filter(
        (_, installmentIndex) =>
          installmentIndex !== index
      )
    );
  }

  // =========================================
  // INSTALLMENT TOTAL
  // =========================================

  const installmentTotal = useMemo(() => {
    return installments.reduce(
      (total, installment) =>
        total + Number(installment.amount || 0),
      0
    );
  }, [installments]);

  const totalAmount = Number(form.totalAmount || 0);

  const remainingAmount =
    totalAmount - installmentTotal;

  // =========================================
  // FORMAT CURRENCY
  // =========================================

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  // =========================================
  // SUBMIT
  // =========================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Course validation
    if (!form.courseId) {
      toast.error("Please select a course");
      return;
    }

    // Name validation
    if (!form.name.trim()) {
      toast.error("Please enter fee structure name");
      return;
    }

    // Total amount validation
    if (
      form.totalAmount === "" ||
      Number(form.totalAmount) < 0
    ) {
      toast.error("Please enter a valid total amount");
      return;
    }

    // Installment validation
    for (let i = 0; i < installments.length; i++) {
      const installment = installments[i];

      if (!installment.name.trim()) {
        toast.error(
          `Enter name for installment ${i + 1}`
        );
        return;
      }

      if (
        installment.amount === "" ||
        Number(installment.amount) < 0
      ) {
        toast.error(
          `Enter a valid amount for installment ${
            i + 1
          }`
        );
        return;
      }

      if (
        installment.dueAfterDays === "" ||
        Number(installment.dueAfterDays) < 0
      ) {
        toast.error(
          `Enter valid due days for installment ${
            i + 1
          }`
        );
        return;
      }
    }

    // Prevent installments exceeding total
    if (installmentTotal > totalAmount) {
      toast.error(
        "Installment total cannot be greater than total amount"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        courseId: form.courseId,
        name: form.name.trim(),
        totalAmount: Number(form.totalAmount),
        installments: installments.map(
          (installment) => ({
            name: installment.name.trim(),
            amount: Number(installment.amount),
            dueAfterDays: Number(
              installment.dueAfterDays
            ),
          })
        ),
        isActive: form.isActive,
      };

      await api.post("/fee-structures", payload);

      toast.success(
        "Fee structure created successfully"
      );

      navigate("/admin/fee-structures");
    } catch (error) {
      console.error(
        "Failed to create fee structure:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create fee structure"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================
  // CANCEL
  // =========================================

  function handleCancel() {
    navigate("/admin/fee-structures");
  }

  return (
    <div className="add-fee-page">
      {/* HEADER */}

      <div className="add-fee-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={handleCancel}
          >
            ← Back
          </button>

          <h1>Add Fee Structure</h1>

          <p>
            Create a course fee and installment plan
          </p>
        </div>
      </div>

      <form
        className="add-fee-form"
        onSubmit={handleSubmit}
      >
        {/* =====================================
            BASIC INFORMATION
        ===================================== */}

        <section className="fee-form-card">
          <div className="fee-form-card-header">
            <h2>Basic Information</h2>
            <p>
              Select the course and define the total
              course fee.
            </p>
          </div>

          <div className="fee-form-grid">
            {/* COURSE */}

            <div className="fee-form-group">
              <label>
                Course <span>*</span>
              </label>

              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                disabled={loadingCourses}
              >
                <option value="">
                  {loadingCourses
                    ? "Loading courses..."
                    : "Select Course"}
                </option>

                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.courseCode} -{" "}
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FEE NAME */}

            <div className="fee-form-group">
              <label>
                Fee Structure Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Web Development Full Course"
              />
            </div>

            {/* TOTAL AMOUNT */}

            <div className="fee-form-group">
              <label>
                Total Amount <span>*</span>
              </label>

              <div className="amount-input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="34996"
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="fee-form-group fee-status-field">
              <label>Status</label>

              <label className="fee-switch">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />

                <span className="fee-switch-slider"></span>

                <span>
                  {form.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* =====================================
            INSTALLMENTS
        ===================================== */}

        <section className="fee-form-card">
          <div className="fee-form-card-header installment-header">
            <div>
              <h2>Installments</h2>

              <p>
                Define how students will pay the course
                fee.
              </p>
            </div>

            <button
              type="button"
              className="add-installment-button"
              onClick={addInstallment}
            >
              + Add Installment
            </button>
          </div>

          <div className="installment-list">
            {installments.map(
              (installment, index) => (
                <div
                  className="installment-row"
                  key={index}
                >
                  <div className="installment-number">
                    {index + 1}
                  </div>

                  {/* NAME */}

                  <div className="fee-form-group">
                    <label>
                      Installment Name{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      value={installment.name}
                      onChange={(e) =>
                        handleInstallmentChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Admission Fee"
                    />
                  </div>

                  {/* AMOUNT */}

                  <div className="fee-form-group">
                    <label>
                      Amount <span>*</span>
                    </label>

                    <div className="amount-input-wrapper">
                      <span>₹</span>

                      <input
                        type="number"
                        value={installment.amount}
                        onChange={(e) =>
                          handleInstallmentChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        min="0"
                        step="1"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* DUE DAYS */}

                  <div className="fee-form-group">
                    <label>
                      Due After Days{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="number"
                      value={
                        installment.dueAfterDays
                      }
                      onChange={(e) =>
                        handleInstallmentChange(
                          index,
                          "dueAfterDays",
                          e.target.value
                        )
                      }
                      min="0"
                      step="1"
                      placeholder="30"
                    />

                    <small>
                      Days after admission
                    </small>
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-installment-button"
                    onClick={() =>
                      removeInstallment(index)
                    }
                    title="Remove installment"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>

          {/* INSTALLMENT SUMMARY */}

          <div className="installment-summary">
            <div>
              <span>Total Course Fee</span>

              <strong>
                {formatAmount(totalAmount)}
              </strong>
            </div>

            <div>
              <span>Installment Total</span>

              <strong>
                {formatAmount(installmentTotal)}
              </strong>
            </div>

            <div
              className={
                remainingAmount < 0
                  ? "amount-negative"
                  : remainingAmount === 0
                  ? "amount-complete"
                  : ""
              }
            >
              <span>Remaining</span>

              <strong>
                {formatAmount(remainingAmount)}
              </strong>
            </div>
          </div>
        </section>

        {/* =====================================
            ACTIONS
        ===================================== */}

        <div className="fee-form-actions">
          <button
            type="button"
            className="fee-cancel-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="fee-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Fee Structure"}
          </button>
        </div>
      </form>
    </div>
  );
}