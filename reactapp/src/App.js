import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

import AccountDashboard from "./components/AccountDashboard";
import CreateAccountForm from "./components/CreateAccountForm";
import AccountDetails from "./components/AccountDetails";
import DepositForm from "./components/DepositForm";
import WithdrawForm from "./components/WithdrawForm";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

import "./App.css";


// PRIVATE ROUTE


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ROLE ROUTE

function RoleRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// LAYOUT


function Layout({ children, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    if (onLogout) {
      onLogout();
    }

    navigate("/login", { replace: true });
  };

  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">

      <header className="topbar">

        <Link to="/dashboard" className="logo">
          Bank<span>Flow</span>
        </Link>

        <nav>

          {username && (
            <span className="user-pill">
              {username}
              {role ? ` · ${role}` : ""}
            </span>
          )}

          <button
            type="button"
            className="logout"
            onClick={logout}
          >
            Logout
          </button>

        </nav>

      </header>

      <main>
        {children}
      </main>

    </div>
  );
}


// APP


function App() {

  /*
   * This state is used to force App to re-render after
   * login/logout changes localStorage.
   */
  const [, setAuthVersion] = useState(0);

  useEffect(() => {

    const handleAuthChange = () => {
      setAuthVersion((previous) => previous + 1);
    };

    window.addEventListener(
      "authChanged",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChange
      );
    };

  }, []);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Debug information
  console.log("=================================");
  console.log("AUTHENTICATION CHECK");
  console.log("Token:", token);
  console.log("Role:", role);
  console.log(
    "Username:",
    localStorage.getItem("username")
  );
  console.log("=================================");

  return (
    <Routes>

      {/* =================================================
          HOME
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to={token ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      {/* =================================================
          LOGIN
      ================================================= */}

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      {/* =================================================
          REGISTER
      ================================================= */}

      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      {/* =================================================
          DASHBOARD

          ADMIN -> AdminDashboard
          USER  -> UserDashboard
      ================================================= */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>

            <Layout>

              {role === "ADMIN" ? (
                <AdminDashboard />
              ) : role === "USER" ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" replace />
              )}

            </Layout>

          </PrivateRoute>
        }
      />

      {/* =================================================
          ACCOUNT DASHBOARD
      ================================================= */}

      <Route
        path="/accounts"
        element={
          <PrivateRoute>

            <Layout>
              <AccountDashboard />
            </Layout>

          </PrivateRoute>
        }
      />

      {/* =================================================
          CREATE ACCOUNT

          ADMIN ONLY
      ================================================= */}

      <Route
        path="/accounts/new"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>

            <Layout>
              <CreateAccountForm />
            </Layout>

          </RoleRoute>
        }
      />

      {/* =================================================
          ACCOUNT DETAILS
      ================================================= */}

      <Route
        path="/accounts/:accountId"
        element={
          <PrivateRoute>

            <Layout>
              <AccountDetails />
            </Layout>

          </PrivateRoute>
        }
      />

      {/* =================================================
          DEPOSIT
      ================================================= */}

      <Route
        path="/accounts/:accountId/deposit"
        element={
          <PrivateRoute>

            <Layout>
              <DepositForm />
            </Layout>

          </PrivateRoute>
        }
      />

      {/* =================================================
          WITHDRAW
      ================================================= */}

      <Route
        path="/accounts/:accountId/withdraw"
        element={
          <PrivateRoute>

            <Layout>
              <WithdrawForm />
            </Layout>

          </PrivateRoute>
        }
      />

     
{/* =================================================
    TRANSFER
================================================= */}

<Route
  path="/accounts/:accountId/transfer"
  element={
    <PrivateRoute>

      <Layout>
        <TransferForm />
      </Layout>

    </PrivateRoute>
  }
/>

{/* =================================================
    TRANSACTION HISTORY
================================================= */}

<Route
  path="/accounts/:accountId/transactions"
  element={
    <PrivateRoute>

      <Layout>
        <TransactionHistory />
      </Layout>

    </PrivateRoute>
  }
/>

   {/* =================================================
          INVALID URL
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />

    </Routes>
  );
}

export default App;