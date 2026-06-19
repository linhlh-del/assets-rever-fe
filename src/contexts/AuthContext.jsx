import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});
export { AuthContext };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3004/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const navigate = useNavigate();

  const isMountedRef = useRef(true);
  const hasNavigatedRef = useRef(false);
  const initializingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Gọi BE /auth/me thay vì query Supabase trực tiếp
  // BE sẽ: verify JWT → lookup VPS Postgres → trả về user info
  const fetchUserFromBE = async (accessToken) => {
    if (!accessToken || !isMountedRef.current) return null;

    const cacheKey = `user_profile_${accessToken.slice(-20)}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          console.log("✅ Using cached user profile");
          return parsed.data;
        } else {
          sessionStorage.removeItem(cacheKey);
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    try {
      console.log("🔍 Fetching user profile from BE /auth/me...");

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!isMountedRef.current) return null;

      if (response.status === 401 || response.status === 403) {
        console.warn("⚠️ Unauthorized — user not registered or token invalid");
        return null;
      }

      if (!response.ok) {
        console.error("❌ BE /auth/me error:", response.status);
        return null;
      }

      const data = await response.json();

      if (!data?.user) {
        console.warn("⚠️ No user data returned from BE");
        return null;
      }

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ data: data.user, timestamp: Date.now() }),
      );

      console.log("✅ User profile fetched:", data.user.role);
      return data.user;
    } catch (err) {
      console.error("❌ Error fetching user from BE:", err);
      return null;
    }
  };

  const setUserWithRole = async (
    authUser,
    accessToken,
    shouldNavigate = false,
  ) => {
    if (!isMountedRef.current) return;

    if (!authUser) {
      setUser(null);
      setPermissionLoading(false);
      return;
    }

    console.log("🔐 Setting user for:", authUser.email);
    setPermissionLoading(true);

    const userProfile = await fetchUserFromBE(accessToken);

    if (!isMountedRef.current) return;

    setPermissionLoading(false);

    if (!userProfile) {
      console.error("❌ User not found in system (VPS Postgres)");
      await supabase.auth.signOut({ scope: "local" });
      sessionStorage.clear();
      if (isMountedRef.current) navigate("/login");
      return;
    }

    // Kết hợp thông tin Supabase auth + thông tin từ VPS Postgres (qua BE)
    const enhancedUser = {
      ...authUser,
      role: userProfile.role,
      full_name: userProfile.full_name,
      employee_code: userProfile.employee_code,
      department: userProfile.department,
      user_metadata: {
        ...authUser.user_metadata,
        role: userProfile.role,
        full_name: userProfile.full_name,
        employee_code: userProfile.employee_code,
        department: userProfile.department,
      },
    };

    setUser(enhancedUser);
    console.log("✅ User set with role:", userProfile.role);

    if (shouldNavigate && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        console.log("🚀 Initializing auth...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          await supabase.auth.signOut({ scope: "local" });
          sessionStorage.clear();
          if (mounted) setLoading(false);
          initializingRef.current = false;
          return;
        }

        if (mounted) {
          if (session?.user) {
            console.log("✅ Found session for:", session.user.email);
            await setUserWithRole(session.user, session.access_token, false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        if (mounted) setLoading(false);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log("🔔 Auth event:", event);

      switch (event) {
        case "SIGNED_IN":
          if (session?.user && !user) {
            console.log("✅ User signed in:", session.user.email);
            await setUserWithRole(session.user, session.access_token, true);
          }
          break;

        case "TOKEN_REFRESHED":
          // Token mới → xóa cache cũ để fetch lại profile với token mới
          console.log("🔄 Token refreshed — clearing profile cache");
          sessionStorage.clear();
          break;

        case "SIGNED_OUT":
          console.log("👋 User signed out");
          setUser(null);
          setPermissionLoading(false);
          hasNavigatedRef.current = false;
          sessionStorage.clear();
          navigate("/login");
          break;

        case "INITIAL_SESSION":
          console.log("🔑 INITIAL_SESSION — handled by initializeAuth");
          break;

        default:
          console.log("🔔 Other auth event:", event);
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signInWithGoogle = async () => {
    try {
      console.log("🔐 Starting Google sign in...");
      await supabase.auth.signOut({ scope: "local" });
      sessionStorage.clear();
      hasNavigatedRef.current = false;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: { hd: "rever.vn" },
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log("👋 Signing out...");
      sessionStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("❌ Sign out error:", error);
      await supabase.auth.signOut({ scope: "local" });
      setUser(null);
    }
  };

  const clearUserCache = () => {
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissionLoading,
        signInWithGoogle,
        signOut,
        clearUserCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
