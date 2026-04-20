import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/components/SupabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // فحص الجلسة الحالية
    checkSession();

    // الاستماع لتغييرات حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          await loadUserData(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoadingAuth(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session check failed:', error);
        setAuthError(error.message);
        setIsAuthenticated(false);
        setUser(null);
      } else if (session?.user) {
        await loadUserData(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setAuthError(error.message);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  const loadUserData = async (authUser) => {
    try {
      // محاولة جلب بيانات المستخدم من user_profiles
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('⚠️ Error loading profile:', error);
      }

      // دمج البيانات
      const userData = {
        id: authUser.id,
        email: authUser.email,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email,
        user_type: profile?.user_type || authUser.user_metadata?.user_type || 'student',
        role: authUser.user_metadata?.role || 'user',
        phone: profile?.phone,
        avatar_url: profile?.avatar_url,
        country: profile?.country,
        city: profile?.city,
        ...authUser.user_metadata
      };

      console.log('✅ User data loaded:', userData.email);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Error in loadUserData:', error);
      // حتى لو فشل جلب البروفايل، استخدم بيانات Auth
      setUser({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email,
        role: authUser.user_metadata?.role || 'user',
        ...authUser.user_metadata
      });
      setIsAuthenticated(true);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        await loadUserData(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth';
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ ...prev, ...updates }));
      console.log('✅ Profile updated');
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      signIn,
      signUp,
      logout,
      updateProfile,
      checkSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
