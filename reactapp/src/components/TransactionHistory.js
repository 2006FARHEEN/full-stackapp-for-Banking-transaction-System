import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../utils/api";

const money = (value) => {
  return `$${Math.abs(
    Number(value || 0)
  ).toFixed(2)}`;
};

function TransactionHistory() {
  const { accountId } = useParams();

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Loading transactions for account:",
          accountId
        );

        const data =
          await api.fetchTransactionHistory(
            accountId
          );

        console.log(
          "Transaction history response:",
          data
        );

        setTransactions(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "TRANSACTION HISTORY ERROR:",
          error
        );

        setError(
          api.messageFromError(error)
        );
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadTransactions();
    } else {
      setLoading(false);
      setError("Account ID is missing.");
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="dashboard-container">
        
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Transaction History</h1>

        <div className="alert error">
          {error}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="dashboard-container">
        <h1>Transaction History</h1>

        <div className="empty-state compact">
          <h3>No Transactions</h3>

          <p>
            Your transaction history will
            appear here.
          </p>
        </div>
      </div>
    );
  }

  const sortedTransactions =
    [...transactions].sort(
      (a, b) =>
        new Date(b.transactionDate) -
        new Date(a.transactionDate)
    );

  return (
    <div className="dashboard-container">

      <h1>Transaction History</h1>

      <div className="table-card">

        <div className="table-scroll">

          <table>

            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Recipient</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>

              {sortedTransactions.map(
                (transaction) => {

                  const type =
                    transaction.transactionType;

                  const isOutgoing =
                    type === "WITHDRAWAL" ||
                    type === "TRANSFER";

                  return (
                    <tr
                      key={
                        transaction.transactionId
                      }
                    >

                      <td>
                        {transaction.transactionDate
                          ? new Date(
                              transaction.transactionDate
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={`tx-badge ${
                            type
                              ? type.toLowerCase()
                              : ""
                          }`}
                        >
                          {type || "—"}
                        </span>
                      </td>

                      <td>
                        {transaction.description ||
                          "—"}
                      </td>

                      <td>
                        {transaction.recipientAccountId ||
                          "—"}
                      </td>

                      <td
                        className={
                          isOutgoing
                            ? "amount-out"
                            : "amount-in"
                        }
                      >
                        {isOutgoing
                          ? `-${money(
                              transaction.amount
                            )}`
                          : `+${money(
                              transaction.amount
                            )}`}
                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default TransactionHistory;