import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const navigate = useNavigate();

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const initializingRef = useRef(false);
  // ✅ Track xem đã navigate chưa để tránh navigate lặp
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const fetchUserRole = async (email) => {
    if (!email || !isMountedRef.current) return null;

    const cacheKey = `user_role_${email}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          console.log("✅ Using cached role for:", email);
          return parsed.data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      console.log("🔍 Fetching role from database for:", email);

      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const { data, error } = await supabase
        .from("users")
        .select("role, full_name, employee_code, department")
        .eq("email", email)
        .maybeSingle();

      if (!isMountedRef.current) return null;

      if (error) {
        console.error("❌ Database error:", error);
        if (
          error.message?.includes("JWT") ||
          error.message?.includes("token") ||
          error.message?.includes("issued in the future") ||
          error.code === "PGRST301"
        ) {
          console.warn("⚠️ Auth token issue, signing out...");
          await supabase.auth.signOut({ scope: "local" });
          localStorage.clear();
          return null;
        }
        return null;
      }

      if (!data) {
        console.warn("⚠️ No user found in database for:", email);
        return null;
      }

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          email,
        }),
      );

      console.log("✅ Role fetched successfully:", data.role);
      return data;
    } catch (err) {
      if (err.name === "AbortError") return null;
      console.error("❌ Error in fetchUserRole:", err);
      return null;
    }
  };

  const setUserWithRole = async (authUser, shouldNavigate = false) => {
    if (!isMountedRef.current) return;

    if (!authUser) {
      setUser(null);
      setPermissionLoading(false);
      return;
    }

    console.log("🔐 Setting user with role for:", authUser.email);
    setPermissionLoading(true);

    const userRole = await fetchUserRole(authUser.email);

    if (!isMountedRef.current) return;

    setPermissionLoading(false);

    if (!userRole) {
      console.error("❌ User not found in database");
      await supabase.auth.signOut({ scope: "local" });
      if (isMountedRef.current) navigate("/login");
      return;
    }

    const enhancedUser = {
      ...authUser,
      role: userRole.role,
      full_name: userRole.full_name,
      employee_code: userRole.employee_code,
      department: userRole.department,
      user_metadata: {
        ...authUser.user_metadata,
        role: userRole.role,
        full_name: userRole.full_name,
        employee_code: userRole.employee_code,
        department: userRole.department,
      },
    };

    setUser(enhancedUser);
    console.log("✅ User set with role:", userRole.role);

    // ✅ Chỉ navigate 1 lần duy nhất sau khi đăng nhập
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
          localStorage.clear();
          if (mounted) setLoading(false);
          initializingRef.current = false;
          return;
        }

        if (mounted) {
          if (session?.user) {
            console.log("✅ Found session for:", session.user.email);
            // ✅ false = không navigate khi restore session (user đang ở trang nào đó rồi)
            await setUserWithRole(session.user, false);
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
          // ✅ Chỉ xử lý SIGNED_IN khi chưa có user (tức là lần đăng nhập mới)
          if (session?.user && !user) {
            console.log("✅ User signed in:", session.user.email);
            await setUserWithRole(session.user, true); // true = navigate to dashboard
          }
          break;

        case "TOKEN_REFRESHED":
          // ✅ Không làm gì cả khi token refresh — đây là nguyên nhân gây reload!
          console.log("🔄 Token refreshed — no action needed");
          break;

        case "SIGNED_OUT":
          console.log("👋 User signed out");
          setUser(null);
          setPermissionLoading(false);
          hasNavigatedRef.current = false;
          Object.keys(localStorage).forEach((key) => {
            if (key.includes("user_role_") || key.includes("supabase")) {
              localStorage.removeItem(key);
            }
          });
          navigate("/login");
          break;

        case "INITIAL_SESSION":
          // ✅ Bỏ qua — đã xử lý trong initializeAuth
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
      localStorage.clear();
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
      if (user?.email) localStorage.removeItem(`user_role_${user.email}`);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("❌ Sign out error:", error);
      await supabase.auth.signOut({ scope: "local" });
      setUser(null);
    }
  };

  const clearUserRoleCache = (email) => {
    const cacheKey = `user_role_${email || user?.email}`;
    localStorage.removeItem(cacheKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissionLoading,
        signInWithGoogle,
        signOut,
        clearUserRoleCache,
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
