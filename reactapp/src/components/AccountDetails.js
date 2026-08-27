import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import * as api from "../utils/api";
import TransactionHistory from "./TransactionHistory";

const money = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

function AccountDetails() {

  const { accountId } = useParams();

  const [account, setAccount] =
    useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadData = async () => {

      try {

        const accountData =
          await api.fetchAccount(accountId);

        const transactionData =
          await api.fetchTransactionHistory(
            accountId
          );

        setAccount(accountData);

        setTransactions(
          transactionData || []
        );

      } catch (error) {

        setError(
          api.messageFromError(error)
        );

      } finally {

        setLoading(false);

      }
    };

    loadData();

  }, [accountId]);

  if (loading) {

    return (

      <main className="page">

        <div className="loading">
          Loading account...
        </div>

      </main>
    );
  }

  if (error) {

    return (

      <main className="page">

        <div className="alert error">
          {error}
        </div>

        <Link
          className="secondary button-link"
          to="/dashboard"
        >
          ← Back to Accounts
        </Link>

      </main>
    );
  }

  return (

    <main className="page">

      <div className="page-heading">

        <div>

          <span className="eyebrow">
            ACCOUNT DETAILS
          </span>

          <h2>
            {account.accountHolderName}
          </h2>

        </div>

        <Link
          className="secondary button-link"
          to="/dashboard"
        >
          ← Back to Accounts
        </Link>

      </div>

      {/* ACCOUNT INFORMATION */}

      <section className="detail-card">

        <div>

          <div className="detail-label">
            Account Number
          </div>

          <strong>
            {account.accountNumber}
          </strong>

        </div>

        <div>

          <div className="detail-label">
            Account Type
          </div>

          <strong>
            {account.accountType}
          </strong>

        </div>

        <div>

          <div className="detail-label">
            Balance
          </div>

          <strong className="detail-balance">
            {money(account.balance)}
          </strong>

        </div>

        <div>

          <div className="detail-label">
            Created Date
          </div>

          <strong>
            {account.createdDate
              ? new Date(
                  account.createdDate
                ).toLocaleDateString()
              : "—"}
          </strong>

        </div>

      </section>

      {/* TRANSACTION BUTTONS */}

      <div className="action-row">

        <Link
          className="primary button-link"
          to={`/accounts/${accountId}/deposit`}
        >
          + Deposit
        </Link>

        <Link
          className="secondary button-link"
          to={`/accounts/${accountId}/withdraw`}
        >
          − Withdraw
        </Link>

        <Link
          className="secondary button-link"
          to={`/accounts/${accountId}/transfer`}
        >
          ⇄ Transfer
        </Link>

      </div>

      {/* TRANSACTION HISTORY */}

      <div className="section-title">

        <h3>
          Transaction History
        </h3>

      </div>

      <TransactionHistory
        transactions={transactions}
      />

    </main>
  );
}

export default AccountDetails;