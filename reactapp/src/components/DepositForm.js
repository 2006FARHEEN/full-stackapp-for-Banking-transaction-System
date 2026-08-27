import React, { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import * as api from "../utils/api";

function DepositForm() {

  const { accountId } = useParams();

  const navigate = useNavigate();

  const [amount, setAmount] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (Number(amount) <= 0) {

      setError(
        "Amount must be greater than 0."
      );

      return;
    }

    try {

      await api.deposit(
        accountId,
        amount,
        description
      );

      navigate(
        `/accounts/${accountId}`
      );

    } catch (error) {

      setError(
        api.messageFromError(error)
      );

    }
  };

  return (

    <main className="page narrow">

      <div className="page-heading">

        <div>

          <span className="eyebrow">
            TRANSACTION
          </span>

          <h2>
            Deposit Money
          </h2>

          <p className="muted">
            Add money to your account.
          </p>

        </div>

      </div>

      <div className="form-card">

        {error && (

          <div className="alert error">
            {error}
          </div>

        )}

        <form onSubmit={handleSubmit}>

          <label htmlFor="amount">
            Amount
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter amount"
          />

          <label htmlFor="description">
            Description
          </label>

          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Example: Salary"
          />

          <div className="form-actions">

            <button
              type="button"
              className="secondary"
              onClick={() =>
                navigate(
                  `/accounts/${accountId}`
                )
              }
            >
              Cancel
            </button>

            <button className="primary">
              Deposit
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default DepositForm;