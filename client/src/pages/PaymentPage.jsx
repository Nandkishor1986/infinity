
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentApi";

const STUDENT_FEE_ID = "6a9ed7ace59157d4afe636bf";

const STUDENT = {
  name: "Rahul Patil",
  studentId: "ICI-STU-2026-32729",
  email: "rahul@gmail.com",
  phone: "9876543210",
};

const FEE = {
  finalAmount: 33000,
  paidAmount: 5000,
  balanceAmount: 28000,
};

export default function PaymentPage() {
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    const paymentAmount = Number(amount);

    // Validation
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (paymentAmount > FEE.balanceAmount) {
      toast.error(
        `Payment cannot exceed the balance of ₹${FEE.balanceAmount.toLocaleString("en-IN")}`
      );
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      // ============================================
      // 1. CREATE RAZORPAY ORDER
      // ============================================

      const orderResponse = await createPaymentOrder(
        STUDENT_FEE_ID,
        paymentAmount,
        token
      );

      const { razorpay, paymentInfo } = orderResponse;

      // ============================================
      // 2. OPEN RAZORPAY CHECKOUT
      // ============================================

      if (!window.Razorpay) {
        toast.error("Razorpay Checkout failed to load");
        return;
      }

      const options = {
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,

        name: "Infinity Computer Institute",
        description: "Course Fee Payment",

        order_id: razorpay.orderId,

        // ==========================================
        // 3. PAYMENT SUCCESS
        // ==========================================

        handler: async function (response) {
          try {
            const verifyResponse = await verifyPayment(
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                studentFeeId:
                  paymentInfo.studentFeeId,

                amount:
                  paymentInfo.amount,

                notes:
                  paymentInfo.notes,
              },
              token
            );

            if (verifyResponse.success) {
              toast.success("Payment successful!");

              console.log(
                "Payment verified:",
                verifyResponse
              );

              // Later we will refresh the StudentFee
              // and show the updated balance.
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            toast.error(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        // ==========================================
        // CUSTOMER INFORMATION
        // ==========================================

        prefill: {
          name: STUDENT.name,
          email: STUDENT.email,
          contact: STUDENT.phone,
        },

        // ==========================================
        // RAZORPAY THEME
        // ==========================================

        theme: {
          color: "#2563eb",
        },

        // ==========================================
        // CHECKOUT CLOSED
        // ==========================================

        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpayCheckout =
        new window.Razorpay(options);

      // ============================================
      // PAYMENT FAILED
      // ============================================

      razorpayCheckout.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response
          );

          toast.error(
            response.error?.description ||
              "Payment failed"
          );
        }
      );

      razorpayCheckout.open();
    } catch (error) {
      console.error(
        "Payment order error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create payment order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="payment-header">
          <h1>Course Fee Payment</h1>
          <p>
            Infinity Computer Institute
          </p>
        </div>

        {/* ========================================
            STUDENT
        ======================================== */}

        <div className="student-card">
          <div className="student-info">

            <div className="student-avatar">
              RP
            </div>

            <div>
              <h2>{STUDENT.name}</h2>

              <p>
                Student ID: {STUDENT.studentId}
              </p>
            </div>

          </div>
        </div>

        {/* ========================================
            FEE SUMMARY
        ======================================== */}

        <div className="fee-card">

          <h3>Fee Summary</h3>

          <div className="fee-row">
            <span>Course</span>

            <span className="fee-value">
              Web Development
            </span>
          </div>

          <div className="fee-row">
            <span>Final Fee</span>

            <span className="fee-value">
              ₹{FEE.finalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="fee-row">
            <span>Already Paid</span>

            <span className="fee-value">
              ₹{FEE.paidAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="fee-row balance-row">
            <span>
              Remaining Balance
            </span>

            <span className="balance-value">
              ₹{FEE.balanceAmount.toLocaleString("en-IN")}
            </span>
          </div>

        </div>

        {/* ========================================
            PAYMENT
        ======================================== */}

        <div className="payment-card">

          <h3>Make Payment</h3>

          <label className="payment-label">
            Payment Amount
          </label>

          <input
            className="payment-input"
            type="number"
            min="1"
            max={FEE.balanceAmount}
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter amount"
          />

          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Pay ₹${Number(amount || 0).toLocaleString("en-IN")}`}
          </button>

          {/* TEST MODE */}

          <div className="test-mode">
            <span className="test-dot"></span>
            Razorpay TEST MODE
          </div>

        </div>

      </div>
    </div>
  );
}
