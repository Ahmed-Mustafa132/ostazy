import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/components/SupabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserData(session.user);
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user);
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
    } catch (error) {
      console.error("خطأ في فحص المستخدم:", error);
      setCurrentUser(null);
      setUserType(null);
    } finally {
      setInitialized(true);
      setLoading(false);
    }
  };

  const loadUserData = async (user) => {
    try {
      // جلب البيانات الكاملة من user_profiles
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error("خطأ في جلب بيانات المستخدم:", error);
      }
      
      // دمج بيانات المستخدم مع البروفايل
      setCurrentUser({ 
        ...user, 
        ...profile,
        user_type: profile?.user_type || null 
      });
      setUserType(profile?.user_type || null);
    } catch (error) {
      console.error("خطأ في تحميل بيانات المستخدم:", error);
      setCurrentUser(user);
      setUserType(null);
    }
  };

  const value = {
    currentUser,
    userType,
    loading,
    initialized,
    refreshUser: checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {initialized ? children : (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}