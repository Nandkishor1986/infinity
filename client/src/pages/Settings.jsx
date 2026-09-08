import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Settings() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/account", {
        name,
        email,
        currentPassword,
        newPassword,
      });

      const updatedUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Account updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="card settings-card">

        <p className="eyebrow">
          INFINITY COMPUTER INSTITUTE
        </p>

        <h1>Account Settings</h1>

        <p className="muted">
          Change your admin name, email and password.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <hr />

          <h3>Change Password</h3>

          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "green" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
    </main>
  );
}