import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/components/SupabaseClient";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2 } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';

export default function UserLogin() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [error, setError] = useState("");

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '561362297890-pdn7p0hscm8vo1o91na4l4rro3p4sq5g.apps.googleusercontent.com', // استبدله بـ Web Client ID من Google Console
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }, []);

  // التحقق من حالة الجلسة
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate(createPageUrl("Home"));
    };
    checkUser();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      if (Capacitor.isNativePlatform()) {
        // --- النمط الخاص بالموبايل (Native) ---
        // ملاحظة: تأكد أنك تستخدم Android/iOS Client ID هنا
        const googleUser = await GoogleAuth.signIn();

        if (!googleUser.authentication.idToken) {
          throw new Error("No ID Token received from Google");
        }

        // إرسال الـ Token لسوبابيس
        const { data, error: sbError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleUser.authentication.idToken,
        });

        if (sbError) throw sbError;

        // نجاح التسجيل في الموبايل
        navigate(createPageUrl("Home"));
        // reload ليس ضرورياً دائماً إذا قمت بتحديث الـ Auth State
        window.location.reload();

      } else {
        // --- النمط الخاص بالويب (Web) ---
        // هنا المتصفح سيتولى عملية الـ Redirect
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin, // سيعود للمتصفح مباشرة
          }
        });
        if (oauthError) throw oauthError;
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      // تجنب إظهار خطأ "إلغاء المستخدم" كخطأ فعلي
      if (err.message !== "user cancelled" && err !== "user cancelled") {
        setError(err.message || t("userLogin.google_error"));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
          scopes: 'name email',
        }
      });
      if (error) throw error;

      if (data?.url) {
        const targetWindow = window.top || window;
        targetWindow.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      setError(error.message || t("userLogin.apple_error"));
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName, role: 'user' } }
        });
        if (error) throw error;
        if (data?.user) {
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'user'
          });
          alert(t("userLogin.signup_success"));
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        navigate(createPageUrl("Home"));
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || t("userLogin.general_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? t("userLogin.signup_title") : t("userLogin.login_title")}
          </CardTitle>
          <p className="text-gray-500 text-sm">
            {t("userLogin.platform_name")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("userLogin.full_name_label")}</label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t("userLogin.full_name_placeholder")}
                  className={isRTL ? "text-right" : "text-left"}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("userLogin.email_label")}</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("userLogin.password_label")}</label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
                className="text-left"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? t("userLogin.signup_btn") : t("userLogin.login_btn"))}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleAppleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5 mb-1" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              {t("userLogin.apple_login")}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">{t("userLogin.or_separator")}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t("userLogin.google_login")}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              {isSignUp ? t("userLogin.have_account") : t("userLogin.no_account")}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 font-bold hover:underline"
              >
                {isSignUp ? t("userLogin.login_link") : t("userLogin.signup_link")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}