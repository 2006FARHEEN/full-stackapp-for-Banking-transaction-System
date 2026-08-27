import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import * as api from "../utils/api";

function TransferForm() {

  const { accountId } = useParams();

  const navigate = useNavigate();

  const [accounts, setAccounts] =
    useState([]);

  const [recipient, setRecipient] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadAccounts = async () => {

      try {

        const data =
          await api.fetchAccounts();

        setAccounts(data || []);

      } catch (error) {

        setError(
          api.messageFromError(error)
        );

      }

    };

    loadAccounts();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!recipient) {

      setError(
        "Please select a recipient account."
      );

      return;
    }

    if (Number(amount) <= 0) {

      setError(
        "Amount must be greater than 0."
      );

      return;
    }

    if (
      String(recipient) ===
      String(accountId)
    ) {

      setError(
        "You cannot transfer to the same account."
      );

      return;
    }

    try {

      await api.transfer(
        accountId,
        recipient,
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
            Transfer Money
          </h2>

          <p className="muted">
            Transfer money to another account.
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

          <label htmlFor="recipient">
            Recipient Account
          </label>

          <select
            id="recipient"
            value={recipient}
            onChange={(e) =>
              setRecipient(e.target.value)
            }
          >

            <option value="">
              Select recipient
            </option>

            {accounts
              .filter(
                (account) =>
                  String(account.accountId) !==
                  String(accountId)
              )
              .map((account) => (

                <option
                  key={account.accountId}
                  value={account.accountId}
                >
                  {account.accountHolderName}
                  {" — "}
                  {account.accountNumber}
                </option>

              ))}

          </select>

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
            placeholder="Example: Rent"
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
              Transfer
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default TransferForm;