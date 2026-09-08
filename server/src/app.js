import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import accountRoutes from "./routes/account.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

import admissionRoutes from "./routes/admission.routes.js";
import feeStructureRoutes from "./routes/feeStructure.routes.js";
import studentFeeRoutes from "./routes/studentFee.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import batchRoutes from "./routes/batch.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// HEALTH CHECK
// ================================

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Infinity Institute API is running",
  });
});

// ================================
// TEST BODY
// ================================
// You can remove this later.

app.post("/api/v1/test-body", (req, res) => {
  console.log("TEST BODY:", req.body);

  res.json({
    success: true,
    receivedBody: req.body,
  });
});

// ================================
// API ROUTES
// ================================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/account", accountRoutes);

app.use("/api/v1/students", studentRoutes);

app.use("/api/v1/students", studentRoutes);

app.use("/api/v1/courses", courseRoutes);

app.use("/api/v1/enquiries", enquiryRoutes);

app.use("/api/v1/admissions", admissionRoutes);

app.use("/api/v1/fee-structures", feeStructureRoutes);

app.use("/api/v1/student-fees", studentFeeRoutes);

app.use("/api/v1/enrollments", enrollmentRoutes);

app.use("/api/v1/batches", batchRoutes);

app.use("/api/v1/payments", paymentRoutes);

// ================================
// ERROR HANDLER
// ================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;