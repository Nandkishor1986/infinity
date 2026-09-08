console.log("PAYMENT PAGE LOADED");
import React, { useEffect, useState } from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// ========================================
// PUBLIC / AUTH PAGES
// ========================================

import Login from "./pages/Login";

// ========================================
// ADMIN PAGES
// ========================================

import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings.jsx";

// ========================================
// STUDENT PAGES
// ========================================

import Students from "./pages/Students.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import EditStudent from "./pages/EditStudent.jsx";

// ========================================
// COURSE PAGES
// ========================================

import Courses from "./pages/admin/Courses";
import AddCourse from "./pages/admin/AddCourse";
import CourseDetails from "./pages/admin/CourseDetails";
import EditCourse from "./pages/admin/EditCourse";

// ========================================
// ENQUIRY PAGES
// ========================================

import Enquiries from "./pages/admin/Enquiries.jsx";
import EnquiryDetails from "./pages/admin/EnquiryDetails.jsx";

// ========================================
// ADMISSION PAGES
// ========================================

import Admissions from "./pages/admin/Admissions.jsx";
import AdmissionDetails from "./pages/admin/AdmissionDetails.jsx";

// ========================================
// FEE STRUCTURE PAGES
// ========================================

import FeeStructures from "./pages/admin/FeeStructures.jsx";
import AddFeeStructure from "./pages/admin/AddFeeStructure.jsx";
import FeeStructureDetails from "./pages/admin/FeeStructureDetails.jsx";
import EditFeeStructure from "./pages/admin/EditFeeStructure.jsx";

// ========================================
// PAYMENT PAGE
// ========================================

import PaymentPage from "./pages/PaymentPage";

// ========================================
// COURSE ICON
// ========================================

function getCourseIcon(courseName = "") {
  const name = courseName.toLowerCase();

  if (name.includes("python")) return "🐍";
  if (name.includes("web")) return "🌐";
  if (name.includes("data")) return "📊";
  if (name.includes("machine")) return "🤖";
  if (name.includes("ai")) return "🤖";
  if (name.includes("cyber")) return "🛡️";
  if (name.includes("security")) return "🛡️";
  if (name.includes("sql")) return "🗄️";
  if (name.includes("database")) return "🗄️";
  if (name.includes("java")) return "☕";
  if (name.includes("cloud")) return "☁️";
  if (name.includes("graphic")) return "🎨";

  return "💻";
}

// ========================================
// PROTECTED ROUTE
// ========================================

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ========================================
// HOME PAGE
// ========================================

function Home() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    courseId: "",
    message: "",
  });

  const [submittingEnquiry, setSubmittingEnquiry] =
    useState(false);

  const [enquirySuccess, setEnquirySuccess] =
    useState("");

  const [enquiryError, setEnquiryError] =
    useState("");

  // ========================================
  // LOAD PUBLIC COURSES
  // ========================================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        setCourseError("");

        const response = await fetch(
          "http://localhost:5000/api/v1/courses/public"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load courses"
          );
        }

        setCourses(data.data || []);
      } catch (error) {
        console.error(
          "Failed to load public courses:",
          error
        );

        setCourseError(
          error.message || "Failed to load courses"
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // ========================================
  // ENQUIRY INPUT CHANGE
  // ========================================

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;

    setEnquiryForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // ENQUIRY SUBMIT
  // ========================================

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    setEnquirySuccess("");
    setEnquiryError("");

    // ======================================
    // VALIDATION
    // ======================================

    if (!enquiryForm.name.trim()) {
      setEnquiryError("Please enter your name.");
      return;
    }

    if (!enquiryForm.phone.trim()) {
      setEnquiryError(
        "Please enter your mobile number."
      );
      return;
    }

    if (enquiryForm.phone.trim().length < 10) {
      setEnquiryError(
        "Please enter a valid mobile number."
      );
      return;
    }

    // ======================================
    // SEND TO BACKEND
    // ======================================

    try {
      setSubmittingEnquiry(true);

      const response = await fetch(
        "http://localhost:5000/api/v1/enquiries/public",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: enquiryForm.name.trim(),

            phone: enquiryForm.phone.trim(),

            email:
              enquiryForm.email.trim() || undefined,

            courseId:
              enquiryForm.courseId || undefined,

            message:
              enquiryForm.message.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit enquiry"
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      setEnquirySuccess(
        `Enquiry submitted successfully. Your enquiry number is ${data.data.enquiryNumber}.`
      );

      // ======================================
      // CLEAR FORM
      // ======================================

      setEnquiryForm({
        name: "",
        phone: "",
        email: "",
        courseId: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Enquiry submission error:",
        error
      );

      setEnquiryError(
        error.message ||
          "Failed to submit enquiry. Please try again."
      );
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  // ========================================
  // HOME UI
  // ========================================

  return (
    <div className="home-page">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="navbar">
        <div className="nav-container">

          <a
            href="/"
            className="logo"
          >
            <div className="logo-icon">
              ICI
            </div>

            <div>
              <strong>
                Infinity
              </strong>

              <span>
                Computer Institute
              </span>
            </div>
          </a>

          <div className="nav-links">
            <a href="#home">
              Home
            </a>

            <a href="#courses">
              Courses
            </a>

            <a href="#about">
              About
            </a>

            <a href="#why-us">
              Why Us
            </a>

            <a href="#testimonials">
              Testimonials
            </a>

            <a href="#contact">
              Contact
            </a>
          </div>

          <a
            href="/login"
            className="nav-login"
          >
            Admin Login
          </a>

        </div>
      </nav>

      {/* ========================================
          HERO
      ======================================== */}

      <section
        id="home"
        className="hero"
      >
        <div className="hero-content">

          <div className="hero-text">

            <p className="hero-badge">
              🚀 Learn • Build • Grow
            </p>

            <h1>
              Build Your
              <span>
                {" "}Digital Future
              </span>
            </h1>

            <p>
              Learn practical computer skills,
              programming, web development,
              data science and modern
              technologies with Infinity
              Computer Institute.
            </p>

            <div className="hero-buttons">

              <a
                href="#courses"
                className="primary-button"
              >
                Explore Courses →
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                Contact Us
              </a>

            </div>

            <div className="hero-points">

              <span>
                ✓ Practical Training
              </span>

              <span>
                ✓ Expert Guidance
              </span>

              <span>
                ✓ Career Focused
              </span>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-slide">

              <div className="hero-slide-icon">
                🎓
              </div>

              <p className="hero-slide-label">
                ADMISSIONS OPEN
              </p>

              <h2>
                Start Your
                <br />
                Digital Journey
              </h2>

              <p>
                Learn practical computer skills
                and build career-ready technology
                skills.
              </p>

              <a
                href="#contact"
                className="hero-slide-button"
              >
                Enquire Now →
              </a>

            </div>

            <div className="carousel-dots">
              <span className="active"></span>
              <span></span>
              <span></span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================
          STATS
      ======================================== */}

      <section className="stats-section">

        <div className="stats-container">

          <div className="stat">
            <strong>
              10+
            </strong>

            <span>
              Years Experience
            </span>
          </div>

          <div className="stat">
            <strong>
              1000+
            </strong>

            <span>
              Students Trained
            </span>
          </div>

          <div className="stat">
            <strong>
              {loadingCourses
                ? "..."
                : `${courses.length}+`}
            </strong>

            <span>
              Professional Courses
            </span>
          </div>

          <div className="stat">
            <strong>
              95%
            </strong>

            <span>
              Student Satisfaction
            </span>
          </div>

        </div>

      </section>

      {/* ========================================
          COURSES
      ======================================== */}

      <section
        id="courses"
        className="section"
      >

        <div className="section-heading">

          <p>
            OUR PROGRAMS
          </p>

          <h2>
            Learn Skills That Matter
          </h2>

          <span>
            Practical courses designed for
            students, professionals and
            career seekers.
          </span>

        </div>

        <div className="course-grid">

          {loadingCourses && (
            <div className="courses-loading">
              Loading courses...
            </div>
          )}

          {!loadingCourses &&
            courseError && (
              <div className="courses-error">
                {courseError}
              </div>
            )}

          {!loadingCourses &&
            !courseError &&
            courses.length === 0 && (
              <div className="courses-empty">
                No courses available
                at the moment.
              </div>
            )}

          {!loadingCourses &&
            !courseError &&
            courses.length > 0 &&
            courses.map((course) => (
              <div
                className="course-card"
                key={course._id}
              >

                <div className="course-icon">
                  {getCourseIcon(course.name)}
                </div>

                <h3>
                  {course.name}
                </h3>

                <p>
                  {course.description ||
                    "Learn practical skills with our professional training program."}
                </p>

                <div className="course-info">

                  {course.duration?.value && (
                    <span>
                      ⏱️{" "}
                      {course.duration.value}{" "}
                      {course.duration.unit?.toLowerCase()}
                    </span>
                  )}

                  {course.totalFees !==
                    undefined && (
                    <span>
                      💰 ₹
                      {course.totalFees}
                    </span>
                  )}

                </div>

                <a href="#contact">
                  Learn More →
                </a>

              </div>
            ))}

        </div>

      </section>

      {/* ========================================
          ABOUT
      ======================================== */}

      <section
        id="about"
        className="about-section"
      >

        <div className="about-container">

          <div className="about-box">

            <div className="about-number">
              01
            </div>

            <h3>
              Learn Practically
            </h3>

            <p>
              Our training focuses on practical
              learning, exercises and real-world
              projects.
            </p>

          </div>

          <div className="about-content">

            <p className="section-label">
              ABOUT INFINITY
            </p>

            <h2>
              Education That Connects
              <span>
                {" "}Knowledge With Practice
              </span>
            </h2>

            <p>
              Infinity Computer Institute
              provides technology-focused
              education designed to help
              students develop useful computer
              skills and prepare for modern
              careers.
            </p>

            <p>
              From basic computer education
              to programming, web development,
              databases, data science, AI and
              cybersecurity, our goal is to make
              technology easier to understand
              through practical learning.
            </p>

            <a
              href="#contact"
              className="primary-button"
            >
              Know More About Us →
            </a>

          </div>

        </div>

      </section>

      {/* ========================================
          WHY US
      ======================================== */}

      <section
        id="why-us"
        className="section"
      >

        <div className="section-heading">

          <p>
            WHY CHOOSE US
          </p>

          <h2>
            Why Students Choose Infinity
          </h2>

        </div>

        <div className="features-grid">

          <div className="feature">
            <div>
              🎯
            </div>

            <h3>
              Career Focused
            </h3>

            <p>
              Courses designed around
              practical and industry-relevant
              skills.
            </p>
          </div>

          <div className="feature">
            <div>
              💻
            </div>

            <h3>
              Hands-on Training
            </h3>

            <p>
              Learn by writing code, solving
              problems and building projects.
            </p>
          </div>

          <div className="feature">
            <div>
              👨‍🏫
            </div>

            <h3>
              Expert Guidance
            </h3>

            <p>
              Get guidance throughout your
              learning journey.
            </p>
          </div>

          <div className="feature">
            <div>
              🏆
            </div>

            <h3>
              Certification
            </h3>

            <p>
              Receive certificates after
              successful completion of eligible
              courses.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================
          TESTIMONIALS
      ======================================== */}

      <section
        id="testimonials"
        className="testimonial-section"
      >

        <div className="section-heading">

          <p>
            STUDENT STORIES
          </p>

          <h2>
            What Our Students Say
          </h2>

        </div>

        <div className="testimonial-grid">

          <div className="testimonial-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "The practical approach helped me
              understand programming much better.
              I really enjoyed working on projects."
            </p>

            <div className="student">

              <div className="avatar">
                A
              </div>

              <div>
                <strong>
                  Student
                </strong>

                <span>
                  Python Course
                </span>
              </div>

            </div>

          </div>

          <div className="testimonial-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "The classes are easy to understand
              and the practical exercises made
              learning technology much more
              interesting."
            </p>

            <div className="student">

              <div className="avatar">
                R
              </div>

              <div>
                <strong>
                  Student
                </strong>

                <span>
                  Web Development
                </span>
              </div>

            </div>

          </div>

          <div className="testimonial-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "I liked the project-based learning
              and guidance provided during the
              course."
            </p>

            <div className="student">

              <div className="avatar">
                S
              </div>

              <div>
                <strong>
                  Student
                </strong>

                <span>
                  Data Science
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          CONTACT / ENQUIRY
      ======================================== */}

      <section
        id="contact"
        className="contact-section"
      >

        <div className="contact-container">

          {/* CONTACT INFORMATION */}

          <div className="contact-info">

            <p className="section-label">
              CONTACT US
            </p>

            <h2>
              Let's Start Your
              <span>
                {" "}Learning Journey
              </span>
            </h2>

            <p>
              Have questions about courses,
              admissions or batches? Contact
              Infinity Computer Institute.
            </p>

            <div className="contact-item">

              <div>
                📍
              </div>

              <div>
                <strong>
                  Address
                </strong>

                <span>
                  Infinity Computer Institute
                </span>
              </div>

            </div>

            <div className="contact-item">

              <div>
                📞
              </div>

              <div>
                <strong>
                  Phone
                </strong>

                <span>
                  Contact Institute
                </span>
              </div>

            </div>

            <div className="contact-item">

              <div>
                ✉️
              </div>

              <div>
                <strong>
                  Email
                </strong>

                <span>
                  info@infinitycomputer.in
                </span>
              </div>

            </div>

          </div>

          {/* ENQUIRY FORM */}

          <form
            className="contact-form"
            onSubmit={handleEnquirySubmit}
          >

            <h3>
              Send an Enquiry
            </h3>

            {enquirySuccess && (
              <div className="enquiry-success">
                {enquirySuccess}
              </div>
            )}

            {enquiryError && (
              <div className="enquiry-error">
                {enquiryError}
              </div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={enquiryForm.name}
              onChange={handleEnquiryChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={enquiryForm.phone}
              onChange={handleEnquiryChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={enquiryForm.email}
              onChange={handleEnquiryChange}
            />

            <select
              name="courseId"
              value={enquiryForm.courseId}
              onChange={handleEnquiryChange}
            >

              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.name}
                </option>
              ))}

            </select>

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={enquiryForm.message}
              onChange={handleEnquiryChange}
            />

            <button
              type="submit"
              disabled={submittingEnquiry}
            >
              {submittingEnquiry
                ? "Sending..."
                : "Send Enquiry →"}
            </button>

          </form>

        </div>

      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="logo">

              <div className="logo-icon">
                ICI
              </div>

              <div>
                <strong>
                  Infinity
                </strong>

                <span>
                  Computer Institute
                </span>
              </div>

            </div>

            <p>
              Empowering students with practical
              technology skills for the digital future.
            </p>

          </div>

          <div className="footer-column">

            <h4>
              Quick Links
            </h4>

            <a href="#home">
              Home
            </a>

            <a href="#courses">
              Courses
            </a>

            <a href="#about">
              About
            </a>

            <a href="#contact">
              Contact
            </a>

          </div>

          <div className="footer-column">

            <h4>
              Courses
            </h4>

            {courses.length > 0 ? (

              courses
                .slice(0, 4)
                .map((course) => (
                  <a
                    href="#courses"
                    key={course._id}
                  >
                    {course.name}
                  </a>
                ))

            ) : (

              <>
                <a href="#courses">
                  Courses
                </a>

                <a href="#courses">
                  View Programs
                </a>
              </>

            )}

          </div>

          <div className="footer-column">

            <h4>
              Contact
            </h4>

            <span>
              📍 Infinity Computer Institute
            </span>

            <span>
              📞 Contact Institute
            </span>

            <span>
              ✉️ info@infinitycomputer.in
            </span>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Infinity Computer Institute.
            All rights reserved.
          </span>

          <span>
            Built for the future of learning.
          </span>

        </div>

      </footer>

    </div>
  );
}

// ========================================
// APP ROUTES
// ========================================

export default function App() {
  return (
    <Routes>

      {/* =================================
          HOME
      ================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =================================
          LOGIN
      ================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =================================
          ADMIN DASHBOARD
      ================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =================================
          SETTINGS
      ================================= */}

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =================================
          STUDENTS
      ================================= */}

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/add"
        element={
          <ProtectedRoute>
            <AddStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/:id"
        element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/:id/edit"
        element={
          <ProtectedRoute>
            <EditStudent />
          </ProtectedRoute>
        }
      />

      {/* =================================
          COURSES
      ================================= */}

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/add"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/:id/edit"
        element={
          <ProtectedRoute>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      {/* =================================
          ENQUIRIES
      ================================= */}

      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute>
            <Enquiries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enquiries/:id"
        element={
          <ProtectedRoute>
            <EnquiryDetails />
          </ProtectedRoute>
        }
      />

      {/* =================================
          ADMISSIONS
      ================================= */}

      <Route
        path="/admin/admissions"
        element={
          <ProtectedRoute>
            <Admissions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/admissions/:id"
        element={
          <ProtectedRoute>
            <AdmissionDetails />
          </ProtectedRoute>
        }
      />

      {/* =================================
          FEE STRUCTURES
      ================================= */}

      <Route
        path="/admin/fee-structures"
        element={
          <ProtectedRoute>
            <FeeStructures />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fee-structures/add"
        element={
          <ProtectedRoute>
            <AddFeeStructure />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fee-structures/:id"
        element={
          <ProtectedRoute>
            <FeeStructureDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fee-structures/:id/edit"
        element={
          <ProtectedRoute>
            <EditFeeStructure />
          </ProtectedRoute>
        }
      />

      {/* =================================
          PAYMENTS
      ================================= */}

      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* =================================
          404
      ================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}
