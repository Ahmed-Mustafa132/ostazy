import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button"; // بفرض وجود Shadcn UI كما في الأكواد السابقة
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // نفترض وجود دوال Auth مستوردة أو من Hook
      // await signInEmail(email, password); 
      navigate("/");
    } catch (err) {
      setError(t("Login_auth.login_error") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      // await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(t("Login_auth.google_error") + ": " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-[400px] bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          {t("Login_auth.login_title")}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("Login_auth.email_label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("Login_auth.password_label")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 h-11 text-lg font-bold"
          >
            {loading ? t("common.loading") : t("Login_auth.login_btn")}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white px-2 text-gray-500">{t("Login_auth.or")}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-11 border-gray-300 font-semibold"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/04/2x/google.png"
            alt="Google"
            className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2"
          />
          {t("Login_auth.google_btn")}
        </Button>

        <p className="mt-8 text-center text-sm text-gray-600">
          {t("Login_auth.no_account")}{" "}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            {t("Login_auth.register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}