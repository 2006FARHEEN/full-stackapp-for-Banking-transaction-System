// // import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import * as api from "../utils/api";

// function UserDashboard() {
//   const [account, setAccount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadMyAccount = async () => {
//       try {
//         const data = await api.fetchMyAccount();

//         console.log("My account:", data);

//         setAccount(data);
//       } catch (error) {
//         console.error("MY ACCOUNT ERROR:", error);
//         setError(api.messageFromError(error));
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMyAccount();
//   }, []);

//   /* ---------- LOADING ---------- */

//   if (loading) {
//     return (
//       <div className="bank-dashboard">
//         <div className="dashboard-loading">
//           <div className="spinner"></div>
//           <h2>Loading your account...</h2>
//           <p>Please wait while we fetch your account details.</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- ERROR ---------- */

//   if (error) {
//     return (
//       <div className="bank-dashboard">
//         <div className="dashboard-error">
//           <div className="error-icon">!</div>

//           <h2>Unable to load account</h2>

//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- NO ACCOUNT ---------- */

//   if (!account) {
//     return (
//       <div className="bank-dashboard">
//         <div className="dashboard-empty">
//           <div className="empty-icon">🏦</div>

//           <h2>No Account Found</h2>

//           <p>
//             No bank account is associated with your profile.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------- MAIN DASHBOARD ---------- */

//   return (
//     <div className="bank-dashboard">

//       {/* HEADER */}

//       <div className="bank-dashboard-header">

//         <div>
//           <p className="dashboard-eyebrow">
//             PERSONAL BANKING
//           </p>

//           <h1>Welcome back! 👋</h1>

//           <p className="dashboard-subtitle">
//             Manage your account and transactions easily.
//           </p>
//         </div>

//       </div>


//       {/* ACCOUNT SUMMARY */}

//       <div className="user-main-card">

//         <div className="user-card-header">

//           <div>
//             <p className="card-eyebrow">
//               MY ACCOUNT
//             </p>

//             <h2>
//               {account.accountHolderName}
//             </h2>

//             <p className="account-number-text">
//               Account No: {account.accountNumber}
//             </p>
//           </div>

//           <span className="account-type-badge">
//             {account.accountType}
//           </span>

//         </div>


//         {/* BALANCE */}

//         <div className="balance-box">

//           <p>
//             Available Balance
//           </p>

//           <h2>
//             ₹{Number(account.balance || 0).toFixed(2)}
//           </h2>

//         </div>


//         {/* DETAILS */}

//         <div className="user-details-grid">

//           <div className="user-detail">
//             <span>Account Holder</span>
//             <strong>
//               {account.accountHolderName}
//             </strong>
//           </div>

//           <div className="user-detail">
//             <span>Account Number</span>
//             <strong>
//               {account.accountNumber}
//             </strong>
//           </div>

//           <div className="user-detail">
//             <span>Account Type</span>
//             <strong>
//               {account.accountType}
//             </strong>
//           </div>

//         </div>

//       </div>


//       {/* QUICK ACTIONS */}

//       <div className="quick-actions-section">

//         <div className="section-heading-dashboard">
//           <div>
//             <p className="dashboard-eyebrow">
//               QUICK ACTIONS
//             </p>

//             <h2>
//               Manage Your Money
//             </h2>
//           </div>
//         </div>


//         <div className="quick-actions-grid">

//           <Link
//             to={`/accounts/${account.accountId}/deposit`}
//             className="quick-action deposit"
//           >
//             <div className="quick-action-icon">
//               +
//             </div>

//             <div>
//               <h3>Deposit</h3>
//               <p>Add money to your account</p>
//             </div>

//             <span className="arrow">
//               →
//             </span>
//           </Link>


//           <Link
//             to={`/accounts/${account.accountId}/withdraw`}
//             className="quick-action withdraw"
//           >
//             <div className="quick-action-icon">
//               ↓
//             </div>

//             <div>
//               <h3>Withdraw</h3>
//               <p>Withdraw money from account</p>
//             </div>

//             <span className="arrow">
//               →
//             </span>
//           </Link>


//           <Link
//             to={`/accounts/${account.accountId}/transfer`}
//             className="quick-action transfer"
//           >
//             <div className="quick-action-icon">
//               ⇄
//             </div>

//             <div>
//               <h3>Transfer</h3>
//               <p>Send money to another account</p>
//             </div>

//             <span className="arrow">
//               →
//             </span>
//           </Link>


//           <Link
//             to={`/accounts/${account.accountId}/transactions`}
//             className="quick-action history"
//           >
//             <div className="quick-action-icon">
//               ≡
//             </div>

//             <div>
//               <h3>Transactions</h3>
//               <p>View your transaction history</p>
//             </div>

//             <span className="arrow">
//               →
//             </span>
//           </Link>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default UserDashboard;
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
        setError(api.messageFromError(error));
      } finally {
        setLoading(false);
      }
    };

    loadMyAccount();
  }, []);

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <div className="bank-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <h2>Loading your account...</h2>
          <p>Please wait while we fetch your account details.</p>
        </div>
      </div>
    );
  }

  /* ---------- ERROR ---------- */

  if (error) {
    return (
      <div className="bank-dashboard">
        <div className="dashboard-error">
          <div className="error-icon">!</div>

          <h2>Unable to load account</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* ---------- NO ACCOUNT ---------- */

  if (!account) {
    return (
      <div className="bank-dashboard">
        <div className="dashboard-empty">
          <div className="empty-icon">🏦</div>

          <h2>No Account Found</h2>

          <p>
            No bank account is associated with your profile.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- MAIN DASHBOARD ---------- */

  return (
    <div className="bank-dashboard">

      {/* HEADER */}

      <div className="bank-dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            PERSONAL BANKING
          </p>

          <h1>Welcome back! 👋</h1>

          <p className="dashboard-subtitle">
            Manage your account and transactions easily.
          </p>
        </div>

      </div>


      {/* ACCOUNT SUMMARY */}

      <div className="user-main-card">

        <div className="user-card-header">

          <div>
            <p className="card-eyebrow">
              MY ACCOUNT
            </p>

            <h2>
              {account.accountHolderName}
            </h2>

            <p className="account-number-text">
              Account No: {account.accountNumber}
            </p>
          </div>

          <span className="account-type-badge">
            {account.accountType}
          </span>

        </div>


        {/* BALANCE */}

        <div className="balance-box">

          <p>
            Available Balance
          </p>

          <h2>
            ₹{Number(account.balance || 0).toFixed(2)}
          </h2>

        </div>


        {/* DETAILS */}

        <div className="user-details-grid">

          <div className="user-detail">
            <span>Account Holder</span>
            <strong>
              {account.accountHolderName}
            </strong>
          </div>

          <div className="user-detail">
            <span>Account Number</span>
            <strong>
              {account.accountNumber}
            </strong>
          </div>

          <div className="user-detail">
            <span>Account Type</span>
            <strong>
              {account.accountType}
            </strong>
          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="quick-actions-section">

        <div className="section-heading-dashboard">
          <div>
            <p className="dashboard-eyebrow">
              QUICK ACTIONS
            </p>

            <h2>
              Manage Your Money
            </h2>
          </div>
        </div>


        <div className="quick-actions-grid">

          <Link
            to={`/accounts/${account.accountId}/deposit`}
            className="quick-action deposit"
          >
            <div className="quick-action-icon">
              +
            </div>

            <div>
              <h3>Deposit</h3>
              <p>Add money to your account</p>
            </div>

            <span className="arrow">
              →
            </span>
          </Link>


          <Link
            to={`/accounts/${account.accountId}/withdraw`}
            className="quick-action withdraw"
          >
            <div className="quick-action-icon">
              ↓
            </div>

            <div>
              <h3>Withdraw</h3>
              <p>Withdraw money from account</p>
            </div>

            <span className="arrow">
              →
            </span>
          </Link>


          <Link
            to={`/accounts/${account.accountId}/transfer`}
            className="quick-action transfer"
          >
            <div className="quick-action-icon">
              ⇄
            </div>

            <div>
              <h3>Transfer</h3>
              <p>Send money to another account</p>
            </div>

            <span className="arrow">
              →
            </span>
          </Link>


          <Link
            to={`/accounts/${account.accountId}/transactions`}
            className="quick-action history"
          >
            <div className="quick-action-icon">
              ≡
            </div>

            <div>
              <h3>Transactions</h3>
              <p>View your transaction history</p>
            </div>

            <span className="arrow">
              →
            </span>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;