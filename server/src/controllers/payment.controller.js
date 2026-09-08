import crypto from "crypto";
import razorpay from "../config/razorpay.js";

import Payment from "../models/Payment.js";
import StudentFee from "../models/StudentFee.js";
import Student from "../models/Student.js";

function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `ICI-REC-${year}-${random}`;
}

// Create Razorpay TEST order
export async function createPaymentOrder(req, res, next) {
  try {
    const { studentFeeId, amount, notes } = req.body;

    if (!studentFeeId || !amount) {
      return res.status(400).json({
        success: false,
        message: "studentFeeId and amount are required",
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const studentFee = await StudentFee.findById(studentFeeId);

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee not found",
      });
    }

    if (studentFee.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cannot make payment for cancelled fee",
      });
    }

    if (paymentAmount > studentFee.balanceAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot exceed balance amount of ₹${studentFee.balanceAmount}`,
      });
    }

    const student = await Student.findById(studentFee.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const receiptNumber = generateReceiptNumber();

    // Razorpay amount is in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(paymentAmount * 100),
      currency: "INR",
      receipt: receiptNumber,
      notes: {
        studentFeeId: studentFee._id.toString(),
        studentId: student._id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Razorpay test order created successfully",

      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      paymentInfo: {
        studentFeeId: studentFee._id,
        studentId: student._id,
        amount: paymentAmount,
        receiptNumber,
        notes: notes || "",
      },
    });
  } catch (error) {
    next(error);
  }
}


// Verify Razorpay payment
export async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentFeeId,
      amount,
      notes,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !studentFeeId ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is required",
      });
    }

    // Create signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature",
      });
    }

    const studentFee = await StudentFee.findById(
      studentFeeId
    );

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Student fee not found",
      });
    }

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (paymentAmount > studentFee.balanceAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds current balance",
      });
    }

    const student = await Student.findById(
      studentFee.studentId
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prevent duplicate Razorpay payment
    const existingPayment = await Payment.findOne({
      transactionId: razorpay_payment_id,
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already recorded",
        payment: existingPayment,
      });
    }

    const receiptNumber = generateReceiptNumber();

    // Create payment record using YOUR Payment model
    const payment = await Payment.create({
      receiptNumber,
      studentFeeId: studentFee._id,
      studentId: student._id,
      amount: paymentAmount,
      paymentMethod: "ONLINE",
      transactionId: razorpay_payment_id,
      paymentDate: new Date(),
      receivedBy: req.user.id,
      notes: notes || "Razorpay test payment",
    });

    // Update StudentFee
    const newPaidAmount =
      studentFee.paidAmount + paymentAmount;

    const newBalanceAmount = Math.max(
      0,
      studentFee.finalAmount - newPaidAmount
    );

    let newStatus = "PARTIAL";

    if (newBalanceAmount === 0) {
      newStatus = "PAID";
    } else if (
      studentFee.dueDate &&
      new Date() > new Date(studentFee.dueDate)
    ) {
      newStatus = "OVERDUE";
    }

    studentFee.paidAmount = newPaidAmount;
    studentFee.balanceAmount = newBalanceAmount;
    studentFee.status = newStatus;

    await studentFee.save();

    res.json({
      success: true,
      message: "Razorpay test payment verified successfully",

      payment,

      feeSummary: {
        finalAmount: studentFee.finalAmount,
        paidAmount: studentFee.paidAmount,
        balanceAmount: studentFee.balanceAmount,
        status: studentFee.status,
      },
    });
  } catch (error) {
    next(error);
  }
}


// List payments
export async function listPayments(req, res, next) {
  try {
    const filter = {};

    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }

    if (req.query.studentFeeId) {
      filter.studentFeeId = req.query.studentFeeId;
    }

    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    const payments = await Payment.find(filter)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate("studentFeeId")
      .populate(
        "receivedBy",
        "name email role"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
}


// Get single payment
export async function getPayment(req, res, next) {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate(
        "studentId",
        "studentId firstName lastName phone email"
      )
      .populate("studentFeeId")
      .populate(
        "receivedBy",
        "name email role"
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
}