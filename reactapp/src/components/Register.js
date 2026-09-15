import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import * as api from "../utils/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    adminKey: "",
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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
    setSuccess("");

    if (
      !form.username.trim() ||
      !form.email.trim()
    ) {
      setError(
        "Username and email are required."
      );

      return;
    }

    if (form.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    try {

      setLoading(true);

      const result =
        await api.register(form);

      setSuccess(
        result ||
        "Registration successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setError(
        api.messageFromError(error)
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="auth-page">

      <div className="auth-card wide">

        <div className="brand-mark">
          BT
        </div>

        <h1>
          Register 
        </h1>

        <p className="muted">
          Register for the banking
          transaction portal.
        </p>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success">
            {success}
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
          />

          <label>
            Email
          </label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <label>
            Password
          </label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <label>
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >

            <option value="USER">
              User
            </option>

            <option value="ADMIN">
              Admin
            </option>

          </select>

          {form.role === "ADMIN" && (

            <>
              <label>
                Admin Key
              </label>

              <input
                name="adminKey"
                value={form.adminKey}
                onChange={handleChange}
                placeholder="Admin registration key"
              />
            </>

          )}

          <button
            className="primary full"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>

        </form>

        <p className="auth-footer">

          Already registered?{" "}

          <Link to="/login">
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;