import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../utils/api";

function CreateAccountForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountNumber: "",
    accountHolderName: "",
    ownerUsername: "",
    balance: "",
    accountType: "Savings",
  });

  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = [];

    if (!/^\d{10}$/.test(form.accountNumber)) {
      errors.push(
        "Account number must be exactly 10 digits."
      );
    }

    if (!form.accountHolderName.trim()) {
      errors.push(
        "Account holder name is required."
      );
    }

    if (!form.ownerUsername.trim()) {
      errors.push(
        "Owner username is required."
      );
    }

    if (
      form.balance === "" ||
      Number(form.balance) < 500
    ) {
      errors.push(
        "Initial balance must be at least 500."
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validation = validate();

    setErrors(validation);

    if (validation.length > 0) {
      return;
    }

    try {
      await api.createAccount({
        accountNumber: form.accountNumber,
        accountHolderName: form.accountHolderName,
        ownerUsername: form.ownerUsername,
        balance: Number(form.balance),
        accountType: form.accountType,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("CREATE ACCOUNT ERROR:", error);

      setApiError(
        api.messageFromError(error)
      );
    }
  };

  return (
    <main className="page narrow">

      <div className="page-heading">
        <div>
          <span className="eyebrow">
            ACCOUNT
          </span>

          <h2>
            Create New Account
          </h2>
        </div>
      </div>

      <div className="form-card">

        {errors.map((error) => (
          <div
            className="field-error"
            key={error}
          >
            {error}
          </div>
        ))}

        {apiError && (
          <div className="alert error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ACCOUNT NUMBER */}

          <label>
            Account Number
          </label>

          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            maxLength="10"
            placeholder="10 digit account number"
          />

          {/* ACCOUNT HOLDER */}

          <label>
            Account Holder Name
          </label>

          <input
            name="accountHolderName"
            value={form.accountHolderName}
            onChange={handleChange}
            placeholder="Full name"
          />

          {/* OWNER USERNAME */}

          <label>
            Owner Username
          </label>

          <input
            name="ownerUsername"
            value={form.ownerUsername}
            onChange={handleChange}
            placeholder="Username of the account owner"
          />

          {/* BALANCE */}

          <label>
            Initial Balance
          </label>

          <input
            name="balance"
            type="number"
            min="500"
            step="0.01"
            value={form.balance}
            onChange={handleChange}
            placeholder="Minimum 500"
          />

          {/* ACCOUNT TYPE */}

          <label>
            Account Type
          </label>

          <select
            name="accountType"
            value={form.accountType}
            onChange={handleChange}
          >
            <option value="Savings">
              Savings
            </option>

            <option value="Checking">
              Checking
            </option>
          </select>

          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
            >
              Create Account
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default CreateAccountForm;