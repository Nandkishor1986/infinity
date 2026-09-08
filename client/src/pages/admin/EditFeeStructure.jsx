
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function EditFeeStructure() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    name: "",
    totalAmount: "",
    isActive: true,
  });

  const [installments, setInstallments] = useState([]);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setLoadingCourses(true);

      const [feeResponse, courseResponse] =
        await Promise.all([
          api.get(`/fee-structures/${id}`),
          api.get("/courses"),
        ]);

      const fee =
        feeResponse.data.feeStructure;

      setCourses(
        courseResponse.data.data || []
      );

      if (!fee) {
        toast.error("Fee structure not found");
        navigate("/admin/fee-structures");
        return;
      }

      setForm({
        courseId: fee.courseId?._id || fee.courseId || "",
        name: fee.name || "",
        totalAmount:
          fee.totalAmount !== undefined
            ? String(fee.totalAmount)
            : "",
        isActive: Boolean(fee.isActive),
      });

      setInstallments(
        fee.installments?.length
          ? fee.installments.map((installment) => ({
              _id: installment._id,
              name: installment.name || "",
              amount:
                installment.amount !== undefined
                  ? String(installment.amount)
                  : "",
              dueAfterDays:
                installment.dueAfterDays !== undefined
                  ? String(
                      installment.dueAfterDays
                    )
                  : "0",
            }))
          : [
              {
                name: "",
                amount: "",
                dueAfterDays: "0",
              },
            ]
      );
    } catch (error) {
      console.error(
        "Failed to load fee structure:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load fee structure"
      );
    } finally {
      setLoading(false);
      setLoadingCourses(false);
    }
  }

  // ==========================================
  // BASIC FORM
  // ==========================================

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // ==========================================
  // INSTALLMENTS
  // ==========================================

  function handleInstallmentChange(
    index,
    field,
    value
  ) {
    setInstallments((previous) =>
      previous.map(
        (installment, installmentIndex) =>
          installmentIndex === index
            ? {
                ...installment,
                [field]: value,
              }
            : installment
      )
    );
  }

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

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const installmentTotal = useMemo(() => {
    return installments.reduce(
      (total, installment) =>
        total +
        Number(installment.amount || 0),
      0
    );
  }, [installments]);

  const totalAmount = Number(
    form.totalAmount || 0
  );

  const remainingAmount =
    totalAmount - installmentTotal;

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  // ==========================================
  // SAVE
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!form.name.trim()) {
      toast.error(
        "Please enter fee structure name"
      );
      return;
    }

    if (
      form.totalAmount === "" ||
      Number(form.totalAmount) < 0
    ) {
      toast.error(
        "Please enter a valid total amount"
      );
      return;
    }

    if (installments.length === 0) {
      toast.error(
        "At least one installment is required"
      );
      return;
    }

    for (
      let i = 0;
      i < installments.length;
      i++
    ) {
      const installment =
        installments[i];

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
        Number(
          installment.dueAfterDays
        ) < 0
      ) {
        toast.error(
          `Enter valid due days for installment ${
            i + 1
          }`
        );
        return;
      }
    }

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
        totalAmount: Number(
          form.totalAmount
        ),

        installments:
          installments.map(
            (installment) => ({
              name: installment.name.trim(),
              amount: Number(
                installment.amount
              ),
              dueAfterDays: Number(
                installment.dueAfterDays
              ),
            })
          ),

        isActive: form.isActive,
      };

      await api.put(
        `/fee-structures/${id}`,
        payload
      );

      toast.success(
        "Fee structure updated successfully"
      );

      navigate(
        `/admin/fee-structures/${id}`
      );
    } catch (error) {
      console.error(
        "Failed to update fee structure:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update fee structure"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate(
      `/admin/fee-structures/${id}`
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-fee-page">
        <div className="edit-fee-loading">
          Loading fee structure...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="edit-fee-page">

      {/* HEADER */}
      <div className="edit-fee-header">

        <div>
          <button
            type="button"
            className="edit-fee-back-button"
            onClick={handleCancel}
          >
            ← Back
          </button>

          <h1>
            Edit Fee Structure
          </h1>

          <p>
            Update course fees and
            installment plan
          </p>
        </div>

      </div>

      <form
        className="edit-fee-form"
        onSubmit={handleSubmit}
      >

        {/* ==============================
            BASIC INFORMATION
        ============================== */}

        <section className="edit-fee-card">

          <div className="edit-fee-card-header">
            <h2>
              Basic Information
            </h2>

            <p>
              Update the course and
              total fee information.
            </p>
          </div>

          <div className="edit-fee-grid">

            {/* COURSE */}

            <div className="edit-fee-group">

              <label>
                Course <span>*</span>
              </label>

              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                disabled={
                  loadingCourses
                }
              >

                <option value="">
                  {loadingCourses
                    ? "Loading courses..."
                    : "Select Course"}
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.courseCode} -{" "}
                      {course.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* NAME */}

            <div className="edit-fee-group">

              <label>
                Fee Structure Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Web Development Full Course"
              />

            </div>

            {/* TOTAL */}

            <div className="edit-fee-group">

              <label>
                Total Amount{" "}
                <span>*</span>
              </label>

              <div className="edit-amount-wrapper">

                <span>₹</span>

                <input
                  type="number"
                  name="totalAmount"
                  value={
                    form.totalAmount
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="1"
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="edit-fee-group">

              <label>
                Status
              </label>

              <label className="edit-fee-switch">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                />

                <span className="edit-fee-switch-slider"></span>

                <span>
                  {form.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </label>

            </div>

          </div>

        </section>

        {/* ==============================
            INSTALLMENTS
        ============================== */}

        <section className="edit-fee-card">

          <div className="edit-installment-header">

            <div>
              <h2>
                Installments
              </h2>

              <p>
                Update the payment
                schedule.
              </p>
            </div>

            <button
              type="button"
              className="edit-add-installment-button"
              onClick={
                addInstallment
              }
            >
              + Add Installment
            </button>

          </div>

          <div className="edit-installment-list">

            {installments.map(
              (
                installment,
                index
              ) => (

                <div
                  className="edit-installment-row"
                  key={
                    installment._id ||
                    index
                  }
                >

                  <div className="edit-installment-number">
                    {index + 1}
                  </div>

                  {/* NAME */}

                  <div className="edit-fee-group">

                    <label>
                      Installment Name{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      value={
                        installment.name
                      }
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

                  <div className="edit-fee-group">

                    <label>
                      Amount{" "}
                      <span>*</span>
                    </label>

                    <div className="edit-amount-wrapper">

                      <span>₹</span>

                      <input
                        type="number"
                        value={
                          installment.amount
                        }
                        onChange={(e) =>
                          handleInstallmentChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        min="0"
                        step="1"
                      />

                    </div>

                  </div>

                  {/* DUE DAYS */}

                  <div className="edit-fee-group">

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
                    />

                    <small>
                      Days after admission
                    </small>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="edit-remove-installment-button"
                    onClick={() =>
                      removeInstallment(
                        index
                      )
                    }
                    title="Remove installment"
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

          {/* SUMMARY */}

          <div className="edit-installment-summary">

            <div>
              <span>
                Total Course Fee
              </span>

              <strong>
                {formatAmount(
                  totalAmount
                )}
              </strong>
            </div>

            <div>
              <span>
                Installment Total
              </span>

              <strong>
                {formatAmount(
                  installmentTotal
                )}
              </strong>
            </div>

            <div
              className={
                remainingAmount < 0
                  ? "edit-amount-negative"
                  : remainingAmount === 0
                  ? "edit-amount-complete"
                  : ""
              }
            >
              <span>
                Remaining
              </span>

              <strong>
                {formatAmount(
                  remainingAmount
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* ==============================
            ACTIONS
        ============================== */}

        <div className="edit-fee-actions">

          <button
            type="button"
            className="edit-fee-cancel-button"
            onClick={
              handleCancel
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-fee-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}
