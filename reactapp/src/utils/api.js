import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// JWT INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// AUTH
// =====================================================

export const login = async (
  username,
  password
) => {

  const response = await api.post(
    "/api/auth/login",
    {
      username,
      password,
    }
  );

  return response.data;
};

export const register = async (data) => {

  const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

// =====================================================
// USER ACCOUNT
// =====================================================

export const fetchMyAccount = async () => {

  const response = await api.get(
    "/api/accounts/my-account"
  );

  return response.data;
};

// =====================================================
// ADMIN ACCOUNTS
// =====================================================

export const fetchAccounts = async () => {

  const response = await api.get(
    "/api/accounts"
  );

  return response.data;
};

export const fetchAccount = async (
  accountId
) => {

  const response = await api.get(
    `/api/accounts/${accountId}`
  );

  return response.data;
};

export const createAccount = async (data) => {

  const response = await api.post(
    "/api/accounts",
    data
  );

  return response.data;
};

// =====================================================
// TRANSACTIONS
// =====================================================

export const deposit = async (
  accountId,
  amount,
  description
) => {

  const response = await api.post(
    "/api/transactions/deposit",
    {
      accountId: Number(accountId),
      amount: Number(amount),
      description,
    }
  );

  return response.data;
};

export const withdraw = async (
  accountId,
  amount,
  description
) => {

  const response = await api.post(
    "/api/transactions/withdraw",
    {
      accountId: Number(accountId),
      amount: Number(amount),
      description,
    }
  );

  return response.data;
};

export const transfer = async (
  fromAccountId,
  toAccountId,
  amount,
  description
) => {

  const response = await api.post(
    "/api/transactions/transfer",
    {
      fromAccountId: Number(fromAccountId),
      toAccountId: Number(toAccountId),
      amount: Number(amount),
      description,
    }
  );

  return response.data;
};

export const fetchTransactionHistory =
  async (accountId) => {

    const response = await api.get(
      `/api/transactions/account/${accountId}`
    );

    return response.data;
  };

// =====================================================
// ERROR
// =====================================================

export const messageFromError = (error) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

export default api;