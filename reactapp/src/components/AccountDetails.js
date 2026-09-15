import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as api from "../utils/api";
import "./AccountDetails.css";
const AccountDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user
  const getLoggedInUser = () => {
    try {
      const currentUser = localStorage.getItem("currentUser");

      if (currentUser) {
        return JSON.parse(currentUser);
      }
    } catch (err) {
      console.error("Error reading currentUser:", err);
    }

    return {
      role: localStorage.getItem("role"),
      accountId: localStorage.getItem("accountId"),
      userId: localStorage.getItem("userId"),
    };
  };

  const currentUser = getLoggedInUser();

  const role = String(currentUser?.role || "").toUpperCase();

  const isAdmin = role === "ADMIN";

  const isOwner =
    role === "USER" &&
    String(currentUser?.accountId || "") === String(accountId);

  // Only USER who owns the account can transact
  const canTransact = isOwner;

  useEffect(() => {
    const loadAccountDetails = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Loading account:", accountId);
        console.log("Current role:", role);

        // =========================
        // FETCH ACCOUNT
        // =========================

        const accountResponse =
          await api.fetchAccount(accountId);

        console.log(
          "Account API response:",
          accountResponse
        );

        // Support both:
        // response.data
        // OR
        // direct object
        const accountData =
          accountResponse?.data || accountResponse;

        if (!accountData) {
          throw new Error("Account data not found");
        }

        setAccount(accountData);

        // =========================
        // FETCH TRANSACTION HISTORY
        // =========================

        try {
          const transactionResponse =
            await api.fetchTransactionHistory(accountId);

          console.log(
            "Transaction API response:",
            transactionResponse
          );

          const transactionData =
            transactionResponse?.data ||
            transactionResponse ||
            [];

          setTransactions(
            Array.isArray(transactionData)
              ? transactionData
              : []
          );
        } catch (transactionError) {
          console.error(
            "Transaction history error:",
            transactionError
          );

          // Account details should still display
          // even if transaction history fails.
          setTransactions([]);
        }

      } catch (err) {
        console.error(
          "Account details error:",
          err
        );

        console.error(
          "Response:",
          err?.response
        );

        console.error(
          "Response data:",
          err?.response?.data
        );

        let errorMessage =
          "Unable to load account details.";

        if (err?.response?.data?.message) {
          errorMessage =
            err.response.data.message;
        } else if (
          typeof err?.response?.data === "string"
        ) {
          errorMessage =
            err.response.data;
        } else if (err?.message) {
          errorMessage =
            err.message;
        }

        setError(errorMessage);

      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadAccountDetails();
    } else {
      setError("Account ID is missing.");
      setLoading(false);
    }

  }, [accountId, role]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString();
    } catch (err) {
      return date;
    }
  };

  // =========================
  // FORMAT AMOUNT
  // =========================

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="account-details-page">
        <div className="account-details-container">

          <h1>Account Details</h1>

          <p>
            Loading account details...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="account-details-page">
        <div className="account-details-container">

          <h1>Account Details</h1>

          <div className="error-message">
            {error}
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // NO ACCOUNT
  // =========================

  if (!account) {
    return (
      <div className="account-details-page">
        <div className="account-details-container">

          <h1>Account Details</h1>

          <p>
            Account not found.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="account-details-page">

      <div className="account-details-container">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="account-details-header">

          <div>

            <h1>
              Account Details
            </h1>

            

          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>

        </div>

        {/* ========================= */}
        {/* ACCOUNT INFORMATION */}
        {/* ========================= */}

        <div className="account-card">

          <h2>
            Account Information
          </h2>

          <div className="account-info-grid">

            <div className="info-item">

              <span className="info-label">
                Account ID
              </span>

              <span className="info-value">
                {account.accountId || accountId}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Account Number
              </span>

              <span className="info-value">
                {account.accountNumber || "-"}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Account Holder
              </span>

              <span className="info-value">
                {account.accountHolderName || "-"}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Account Type
              </span>

              <span className="info-value">
                {account.accountType || "-"}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Current Balance
              </span>

              <span className="info-value balance">
                {formatAmount(account.balance)}
              </span>

            </div>

            <div className="info-item">

              <span className="info-label">
                Created Date
              </span>

              <span className="info-value">
                {formatDate(account.createdDate)}
              </span>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* USER ACTIONS */}
        {/* ========================= */}

        {canTransact && (

          <div className="quick-actions">

            <h2>
              Account Actions
            </h2>

            <p className="action-description">
              You can manage transactions for
              your account.
            </p>

            <div className="action-buttons">

              <Link
                to={`/accounts/${accountId}/deposit`}
                className="action-button deposit-button"
              >
                <span className="action-icon">
                  ＋
                </span>

                <span>
                  <strong>
                    Deposit
                  </strong>

                  <small>
                    Add money to your account
                  </small>
                </span>

              </Link>

              <Link
                to={`/accounts/${accountId}/withdraw`}
                className="action-button withdraw-button"
              >
                <span className="action-icon">
                  −
                </span>

                <span>
                  <strong>
                    Withdraw
                  </strong>

                  <small>
                    Withdraw money from your account
                  </small>
                </span>

              </Link>

              <Link
                to={`/accounts/${accountId}/transfer`}
                className="action-button transfer-button"
              >
                <span className="action-icon">
                  ⇄
                </span>

                <span>
                  <strong>
                    Transfer
                  </strong>

                  <small>
                    Transfer money to another account
                  </small>
                </span>

              </Link>

            </div>

          </div>

        )}

        {/* ========================= */}
        {/* ADMIN NOTICE */}
        {/* ========================= */}

       

        {/* ========================= */}
        {/* ACCESS RESTRICTED */}
        {/* ========================= */}

        

        {/* ========================= */}
        {/* TRANSACTION HISTORY */}
        {/* ========================= */}

        <div className="transaction-section">

          <div className="transaction-header">

            <div>

              <h2>
                Transaction History
              </h2>

              <p>
                Previous transactions for
                this account
              </p>

            </div>

            {canTransact && (

              <Link
                to={`/accounts/${accountId}/transactions`}
                className="view-all-button"
              >
                View All
              </Link>

            )}

          </div>

          {transactions.length === 0 ? (

            <div className="no-transactions">

              <p>
                No transactions found.
              </p>

            </div>

          ) : (

            <div className="transaction-table-container">

              <table className="transaction-table">

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Recipient Account
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {transactions.map(
                    (transaction) => (

                      <tr
                        key={
                          transaction.transactionId
                        }
                      >

                        <td>
                          {formatDate(
                            transaction.transactionDate
                          )}
                        </td>

                        <td>

                          <span
                            className={`transaction-type ${String(
                              transaction.transactionType ||
                                ""
                            ).toLowerCase()}`}
                          >
                            {transaction.transactionType ||
                              "-"}
                          </span>

                        </td>

                        <td>
                          {formatAmount(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          {transaction.description ||
                            "-"}
                        </td>

                        <td>
                          {transaction.recipientAccountId ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default AccountDetails;