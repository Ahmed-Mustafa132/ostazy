import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student"); // افتراضي: طالب
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await signUpEmail(email, password);

      // حفظ نوع المستخدم في Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        userType: userType,
        createdAt: new Date().toISOString(),
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
      });

      await ensureUserDoc(result.user);
      navigate("/");
    } catch (err) {
      setError("فشل التسجيل: " + err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithGoogle();

      // حفظ نوع المستخدم في Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        userType: userType,
        createdAt: new Date().toISOString(),
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
      }, { merge: true }); // merge: true لعدم الكتابة فوق البيانات الموجودة

      await ensureUserDoc(result.user);
      navigate("/");
    } catch (err) {
      setError("فشل التسجيل بجوجل: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>إنشاء حساب جديد</h2>
      {error && <p style={{ color: "red", backgroundColor: "#fee", padding: "10px", borderRadius: "5px" }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>نوع المستخدم:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
          >
            <option value="student">طالب</option>
            <option value="teacher">معلم</option>
          </select>
        </div>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ddd", borderRadius: "5px" }}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ddd", borderRadius: "5px" }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          تسجيل
        </button>
      </form>

      <div style={{ margin: "15px 0", textAlign: "center", color: "#999" }}>أو</div>

      <button
        onClick={handleGoogleRegister}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#fff",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        تسجيل بجوجل
      </button>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        لديك حساب؟ <a href="/login" style={{ color: "#22c55e", textDecoration: "none" }}>سجل الدخول</a>
      </p>
    </div>
  );
}