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

  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear previous validation errors
    setErrors([]);
    setApiError("");
  };

  // =========================================
  // VALIDATION
  // =========================================

  const validate = () => {
    const errors = [];

    // -----------------------------------------
    // ACCOUNT NUMBER
    // -----------------------------------------

    if (!form.accountNumber.trim()) {
      errors.push(
        "Account number is required."
      );
    } else if (!/^\d{10}$/.test(form.accountNumber)) {
      errors.push(
        "Account number must be exactly 10 digits."
      );
    }

    // -----------------------------------------
    // ACCOUNT HOLDER NAME
    // -----------------------------------------

    if (!form.accountHolderName.trim()) {
      errors.push(
        "Account holder name is required."
      );
    } else if (
      !/^[A-Za-z ]+$/.test(
        form.accountHolderName.trim()
      )
    ) {
      errors.push(
        "Account holder name must contain only alphabets and spaces."
      );
    }

    // -----------------------------------------
    // OWNER USERNAME
    // -----------------------------------------

   if (!form.ownerUsername.trim()) {
  errors.push(
    "Owner username is required."
  );
} else if (
  !/^[A-Za-z]+$/.test(
    form.ownerUsername.trim()
  )
) {
  errors.push(
    "Owner username must contain only alphabets."
  );
}
    // -----------------------------------------
    // BALANCE
    // -----------------------------------------

    if (form.balance === "") {
      errors.push(
        "Initial balance is required."
      );
    } else if (Number(form.balance) < 500) {
      errors.push(
        "Initial balance must be at least 500."
      );
    }

    // -----------------------------------------
    // ACCOUNT TYPE
    // -----------------------------------------

    if (
      form.accountType !== "Savings" &&
      form.accountType !== "Checking"
    ) {
      errors.push(
        "Please select a valid account type."
      );
    }

    return errors;
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validate();

    setErrors(validationErrors);

    // Stop if validation fails
    if (validationErrors.length > 0) {
      return;
    }

    try {
      await api.createAccount({
        accountNumber:
          form.accountNumber.trim(),

        accountHolderName:
          form.accountHolderName.trim(),

        ownerUsername:
          form.ownerUsername.trim(),

        balance: Number(form.balance),

        accountType:
          form.accountType,
      });

      // Account created successfully
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "CREATE ACCOUNT ERROR:",
        error
      );

      setApiError(
        api.messageFromError(error)
      );
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="page narrow">

      {/* =====================================
          PAGE HEADING
          ===================================== */}

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

      {/* =====================================
          FORM CARD
          ===================================== */}

      <div className="form-card">

        {/* VALIDATION ERRORS */}

        {errors.length > 0 && (
          <div className="validation-errors">

            {errors.map((error, index) => (
              <div
                className="field-error"
                key={index}
              >
                {error}
              </div>
            ))}

          </div>
        )}

        {/* API ERROR */}

        {apiError && (
          <div className="alert error">
            {apiError}
          </div>
        )}

        {/* ===================================
            FORM
            =================================== */}

        <form onSubmit={handleSubmit}>

          {/* =================================
              ACCOUNT NUMBER
              ================================= */}

          <label htmlFor="accountNumber">
            Account Number
          </label>

          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            value={form.accountNumber}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            placeholder="10 digit account number"
          />

          {/* =================================
              ACCOUNT HOLDER NAME
              ================================= */}

          <label htmlFor="accountHolderName">
            Account Holder Name
          </label>

          <input
            id="accountHolderName"
            name="accountHolderName"
            type="text"
            value={form.accountHolderName}
            onChange={handleChange}
            placeholder="Full name"
          />

          {/* =================================
              OWNER USERNAME
              ================================= */}

          <label htmlFor="ownerUsername">
            Owner Username
          </label>

          <input
            id="ownerUsername"
            name="ownerUsername"
            type="text"
            value={form.ownerUsername}
            onChange={handleChange}
            placeholder="Username of the account owner"
          />
          

          {/* =================================
              INITIAL BALANCE
              ================================= */}

          <label htmlFor="balance">
            Initial Balance
          </label>

          <input
            id="balance"
            name="balance"
            type="number"
            min="500"
            step="0.01"
            value={form.balance}
            onChange={handleChange}
            placeholder="Minimum 500"
          />

          {/* =================================
              ACCOUNT TYPE
              ================================= */}

          <label htmlFor="accountType">
            Account Type
          </label>

          <select
            id="accountType"
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

          {/* =================================
              BUTTONS
              ================================= */}

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