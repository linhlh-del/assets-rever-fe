import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "rever-auth",
  },
  global: {
    headers: {
      "X-Client-Info": "rever-web-app",
    },
  },
});

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

const pendingRequests = new Map();

export const apiClient = {
  baseURL: API_BASE_URL,

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const requestKey = `${options.method || "GET"}-${endpoint}`;
    if (pendingRequests.has(requestKey)) {
      const prevController = pendingRequests.get(requestKey);
      prevController.abort();
    }

    const controller = new AbortController();
    pendingRequests.set(requestKey, controller);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const config = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      };

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log("🔑 Request with token");
        console.log("🔍 Token info:", {
          access_token: session.access_token,
          user: session.user,
        });
      } else {
        console.warn("⚠️  No session token");
      }

      console.log(`📡 ${options.method || "GET"} ${endpoint}`);

      const response = await fetch(url, config);

      pendingRequests.delete(requestKey);

      if (!response.ok) {
        // Handle 401 - Try to refresh token ONCE
        if (response.status === 401) {
          console.warn("⚠️  401 Unauthorized - Attempting token refresh...");

          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (!refreshError && refreshData.session) {
            console.log("✅ Token refreshed, retrying...");

            // Retry with new token
            config.headers.Authorization = `Bearer ${refreshData.session.access_token}`;
            const retryResponse = await fetch(url, config);

            if (!retryResponse.ok) {
              // CRITICAL: DON'T sign out automatically
              // Backend might be misconfigured or down
              const errorData = await retryResponse.json().catch(() => ({}));

              console.error("❌ Retry failed:", {
                status: retryResponse.status,
                error: errorData,
              });

              // Just throw error, let React Query handle retry
              throw new Error(
                errorData.message ||
                  `Backend error: ${retryResponse.status} ${retryResponse.statusText}`,
              );
            }

            console.log("✅ Retry succeeded");
            return await retryResponse.json();
          } else {
            // CRITICAL: DON'T sign out automatically
            console.error("❌ Token refresh failed:", refreshError);

            // Backend authentication might be misconfigured
            // Let the user stay logged in and show error message
            throw new Error(
              "Backend authentication error. Please check backend configuration.",
            );
          }
        }

        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ ${response.status}:`, errorData);

        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log(`✅ ${options.method || "GET"} ${endpoint} - Success`);
      return data;
    } catch (error) {
      pendingRequests.delete(requestKey);

      if (error.name === "AbortError") {
        console.log("🚫 Request cancelled");
        return null;
      }

      console.error(`❌ API Error: ${endpoint}`, error);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  },
};
