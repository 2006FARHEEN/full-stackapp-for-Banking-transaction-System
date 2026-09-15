// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import * as api from "../utils/api";

// function AdminDashboard() {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadAccounts = async () => {
//       try {
//         const data = await api.fetchAccounts();

//         console.log("Admin accounts:", data);

//         setAccounts(data || []);
//       } catch (error) {
//         console.error("ADMIN ACCOUNTS ERROR:", error);

//         setError(
//           api.messageFromError(error)
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAccounts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="dashboard-container">
//         <h1>Admin Dashboard</h1>
//         <p>Loading accounts...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard-container">
//         <h1>Admin Dashboard</h1>

//         <div className="alert error">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">

//       <h1>Admin Dashboard</h1>

//       <div className="admin-actions">

//         <Link
//           className="primary button-link"
//           to="/accounts/new"
//         >
//           + Create Account
//         </Link>

//       </div>

//       {accounts.length === 0 ? (
//         <p>No accounts found.</p>
//       ) : (
//         <div className="account-list">

//           {accounts.map((account) => (

//             <div
//               className="account-card"
//               key={account.accountId}
//             >

//               <h2>
//                 {account.accountHolderName}
//               </h2>

//               <p>
//                 <strong>Account Number:</strong>{" "}
//                 {account.accountNumber}
//               </p>

//               <p>
//                 <strong>Balance:</strong>{" "}
//                 ₹{Number(account.balance || 0).toFixed(2)}
//               </p>

//               <p>
//                 <strong>Account Type:</strong>{" "}
//                 {account.accountType}
//               </p>

//               <p>
//                 <strong>Owner:</strong>{" "}
//                 {account.ownerUsername}
//               </p>

//               <div className="dashboard-actions">

//                 <Link
//                   to={`/accounts/${account.accountId}`}
//                 >
//                   Account Details
//                 </Link>

//               </div>

//             </div>

//           ))}

//         </div>
//       )}

//     </div>
//   );
// }

// export default AdminDashboard;
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
        setError(api.messageFromError(error));
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="bank-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>

          <h2>Loading accounts...</h2>

          <p>
            Please wait while we fetch account information.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- ERROR ---------- */

  if (error) {
    return (
      <div className="bank-dashboard">

        <div className="dashboard-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load accounts
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }


  /* ---------- STATISTICS ---------- */

  const totalBalance = accounts.reduce(
    (total, account) => {
      return total + Number(account.balance || 0);
    },
    0
  );

  const accountTypes = new Set(
    accounts.map(
      (account) => account.accountType
    )
  ).size;


  return (
    <div className="bank-dashboard admin-bank-dashboard">

      {/* HEADER */}

      <div className="bank-dashboard-header admin-header">

        <div>

          <p className="dashboard-eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard ⚡
          </h1>

          <p className="dashboard-subtitle">
            Manage customer accounts and banking operations.
          </p>

        </div>


        <Link
          to="/accounts/new"
          className="create-account-button"
        >
          + Create Account
        </Link>

      </div>


      {/* STATISTICS */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>
            <p>
              Total Accounts
            </p>

            <h2>
              {accounts.length}
            </h2>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏦
          </div>

          <div>
            <p>
              Account Types
            </p>

            <h2>
              {accountTypes}
            </h2>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ₹
          </div>

          <div>
            <p>
              Total Balance
            </p>

            <h2>
              ₹{totalBalance.toFixed(2)}
            </h2>
          </div>

        </div>

      </div>


      {/* CUSTOMER ACCOUNTS */}

      <div className="admin-accounts-header">

        <div>

          <p className="dashboard-eyebrow">
            ACCOUNT MANAGEMENT
          </p>

          <h2>
            Customer Accounts
          </h2>

        </div>

        <span className="accounts-count">
          {accounts.length} Accounts
        </span>

      </div>


      {/* NO ACCOUNTS */}

      {accounts.length === 0 ? (

        <div className="dashboard-empty">

          <div className="empty-icon">
            🏦
          </div>

          <h2>
            No Accounts Found
          </h2>

          <p>
            Create a customer account to get started.
          </p>

          <Link
            to="/accounts/new"
            className="create-account-button"
          >
            + Create Account
          </Link>

        </div>

      ) : (

        /* ACCOUNT CARDS */

        <div className="admin-accounts-grid">

          {accounts.map((account) => (

            <div
              className="admin-account-card"
              key={account.accountId}
            >

              {/* CUSTOMER */}

              <div className="admin-customer">

                <div className="customer-avatar">

                  {account.accountHolderName
                    ? account.accountHolderName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

                <div>

                  <h3>
                    {account.accountHolderName}
                  </h3>

                  <span>
                    {account.accountType}
                  </span>

                </div>

              </div>


              {/* BALANCE */}

              <div className="admin-balance-box">

                <span>
                  Current Balance
                </span>

                <strong>
                  ₹{Number(
                    account.balance || 0
                  ).toFixed(2)}
                </strong>

              </div>


              {/* INFORMATION */}

              <div className="admin-info-grid">

                <div>

                  <span>
                    Account Number
                  </span>

                  <strong>
                    {account.accountNumber}
                  </strong>

                </div>

                <div>

                  <span>
                    Owner
                  </span>

                  <strong>
                    {account.ownerUsername}
                  </strong>

                </div>

              </div>


              {/* DETAILS */}

              <Link
                to={`/accounts/${account.accountId}`}
                className="view-account-button"
              >
                Account Details
                <span>→</span>
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;