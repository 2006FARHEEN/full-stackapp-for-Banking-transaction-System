import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../utils/api";

function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await api.fetchAccounts();

        console.log("Admin accounts:", data);

        setAccounts(data || []);
      } catch (error) {
        console.error("ADMIN ACCOUNTS ERROR:", error);

        setError(
          api.messageFromError(error)
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <p>Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        <div className="alert error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <h1>Admin Dashboard</h1>

      <div className="admin-actions">

        <Link
          className="primary button-link"
          to="/accounts/new"
        >
          + Create Account
        </Link>

      </div>

      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <div className="account-list">

          {accounts.map((account) => (

            <div
              className="account-card"
              key={account.accountId}
            >

              <h2>
                {account.accountHolderName}
              </h2>

              <p>
                <strong>Account Number:</strong>{" "}
                {account.accountNumber}
              </p>

              <p>
                <strong>Balance:</strong>{" "}
                ₹{Number(account.balance || 0).toFixed(2)}
              </p>

              <p>
                <strong>Account Type:</strong>{" "}
                {account.accountType}
              </p>

              <p>
                <strong>Owner:</strong>{" "}
                {account.ownerUsername}
              </p>

              <div className="dashboard-actions">

                <Link
                  to={`/accounts/${account.accountId}`}
                >
                  Account Details
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;