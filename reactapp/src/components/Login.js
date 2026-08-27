import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import * as api from "../utils/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.username.trim() ||
      !form.password
    ) {
      setError(
        "Username and password are required."
      );

      return;
    }

    try {
      setLoading(true);

      // Login API
      const data = await api.login(
        form.username,
        form.password
      );

      // =================================================
      // STORE JWT TOKEN
      // =================================================

      localStorage.setItem(
        "token",
        data.token
      );

      // =================================================
      // STORE USERNAME
      // =================================================

      localStorage.setItem(
        "username",
        data.username || form.username
      );

      // =================================================
      // STORE ROLE
      // =================================================

      const role =
        data.role || "USER";

      localStorage.setItem(
        "role",
        role
      );

      // =================================================
      // IMPORTANT
      // Tell App.js that authentication data changed
      // =================================================

      window.dispatchEvent(
        new Event("authChanged")
      );

      // =================================================
      // ROLE-BASED DASHBOARD
      // =================================================
      //
      // Both USER and ADMIN go to /dashboard.
      // App.js checks the stored role and displays
      // the correct dashboard.
      //

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        api.messageFromError(error)
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="brand-mark">
          BT
        </div>

        <h1>
          Banking Portal
        </h1>

        <p className="muted">
          Securely manage your accounts
          and transactions.
        </p>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Username
          </label>

          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            autoComplete="username"
          />

          <label>
            Password
          </label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="primary full"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;