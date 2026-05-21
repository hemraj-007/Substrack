import axios, { type AxiosInstance } from "axios";
import { getToken } from "./auth";

// Call backend directly (defaults to localhost:5001).
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only trigger global logout for 401 on protected routes, not on login itself
    const isLoginRequest = err.config?.url?.includes("/api/auth/login");
    if (err.response?.status === 401 && !isLoginRequest && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(err);
  }
);

/** User-friendly message for API errors (404 card ownership, 429 rate limit, etc.). */
export function getApiErrorMessage(
  err: unknown,
  options?: { context?: "upload" | "auth"; defaultMessage?: string }
): string {
  const defaultMsg = options?.defaultMessage ?? "Something went wrong.";
  if (!err || typeof err !== "object" || !("response" in err)) return defaultMsg;
  const res = (err as { response?: { status?: number; data?: { message?: string }; headers?: { "retry-after"?: string } } })
    .response;
  if (!res) return defaultMsg;
  if (res.status === 404 && options?.context === "upload") {
    return "Card not found or you don't have access to it.";
  }
  if (res.status === 429) {
    const retryAfter = res.headers?.["retry-after"];
    return retryAfter
      ? `Too many requests. Please try again in ${retryAfter} second(s).`
      : "Too many requests. Please try again later.";
  }
  if (res.status === 401 && options?.context === "auth") {
    return (res.data?.message as string) ?? "Invalid email or password.";
  }
  if (res.status === 503) {
    return (res.data?.message as string) ?? "Service temporarily unavailable. Please try again shortly.";
  }
  return (res.data?.message as string) ?? defaultMsg;
}

// Auth
export const authApi = {
  signup: (email: string, password: string) =>
    api.post<{ user: import("./auth").User; token: string }>("/api/auth/signup", {
      email,
      password,
    }),
  login: (email: string, password: string) =>
    api.post<{ user: import("./auth").User; token: string }>("/api/auth/login", {
      email,
      password,
    }),
};

// Cards
export type CardPayload = { last4: string; bankName?: string; network?: string };
export type Card = {
  id: string;
  userId: string;
  last4: string;
  bankName: string | null;
  network: string | null;
  createdAt: string;
};

export const cardsApi = {
  list: () => api.get<Card[]>("/api/cards"),
  create: (data: CardPayload) => api.post<Card>("/api/cards", data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/cards/${id}`),
};

// Transactions
export type Transaction = {
  id: string;
  merchant?: string;
  description?: string;
  amount: number;
  currency: string;
  date: string;
  cardId: string;
  [key: string]: unknown;
};

export const transactionsApi = {
  list: () => api.get<Transaction[]>("/api/transactions"),
  upload: (cardId: string, file: File) => {
    const form = new FormData();
    form.append("file", file); // must be "file" per backend upload.single("file")
    form.append("cardId", cardId);
    return api.post<{ imported: number }>("/api/transactions/upload", form, {
      headers: { "Content-Type": false as unknown as string },
    });
  },
};

// Subscriptions
export type Subscription = {
  id: string;
  merchant: string;
  amount: number;
  frequency: string;
  status: string;
  lastCharged?: string;
  nextCharge?: string;
  [key: string]: unknown;
};

export const subscriptionsApi = {
  list: () => api.get<Subscription[]>("/api/subscriptions"),
  detect: () =>
    api.post<Subscription[]>("/api/subscriptions/detect"),
};

// Alerts
export type Alert = {
  id: string;
  type: "RENEWAL" | "PRICE_HIKE" | "UNUSED";
  message: string;
  scheduledAt: string;
  sentAt: string | null;
  [key: string]: unknown;
};

export const alertsApi = {
  list: () =>
    api.get<Alert[]>("/api/alerts"),
};
