import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../utils/api";

function UserDashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyAccount = async () => {
      try {
        const data = await api.fetchMyAccount();

        console.log("My account:", data);

        setAccount(data);
      } catch (error) {
        console.error("MY ACCOUNT ERROR:", error);

        setError(
          api.messageFromError(error)
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyAccount();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>User Dashboard</h1>
        <p>Loading your account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>User Dashboard</h1>

        <div className="alert error">
          {error}
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="dashboard-container">
        <h1>User Dashboard</h1>
        <p>No account found.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <h1>User Dashboard</h1>

      <div className="account-card">

        <h2>My Account</h2>

        <p>
          <strong>Account Number:</strong>{" "}
          {account.accountNumber}
        </p>

        <p>
          <strong>Account Holder:</strong>{" "}
          {account.accountHolderName}
        </p>

        <p>
          <strong>Balance:</strong>{" "}
          ₹{Number(account.balance || 0).toFixed(2)}
        </p>

        <p>
          <strong>Account Type:</strong>{" "}
          {account.accountType}
        </p>

        <div className="dashboard-actions">

          <Link
            to={`/accounts/${account.accountId}/deposit`}
          >
            Deposit
          </Link>

          <Link
            to={`/accounts/${account.accountId}/withdraw`}
          >
            Withdraw
          </Link>

          <Link
            to={`/accounts/${account.accountId}/transfer`}
          >
            Transfer
          </Link>

          <Link
            to={`/accounts/${account.accountId}/transactions`}
          >
            Transaction History
          </Link>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;