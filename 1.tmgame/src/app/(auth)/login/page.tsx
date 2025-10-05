"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { email, password } = form;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      const msg = error.message;
      if (msg === "Invalid login credentials") {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (msg === "Email not confirmed") {
        setError("이메일 인증이 완료되지 않았습니다. 메일을 확인하세요.");
      } else if (msg === "User not found") {
        setError("존재하지 않는 계정입니다.");
      } else if (msg === "Email not provided") {
        setError("이메일을 입력해 주세요.");
      } else if (msg === "Password not provided") {
        setError("비밀번호를 입력해 주세요.");
      } else {
        setError("로그인에 실패했습니다: " + msg);
      }
    } else {
      setSuccess("로그인 성공!");
      router.replace("/game-title-page");
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });
    if (error) {
      setError("구글 로그인에 실패했습니다: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="login-container w-[375px] bg-[#fafafa] rounded-2xl shadow-lg p-12 pt-12 pb-8 box-border">
        <div className="login-title text-[32px] font-bold text-[#1a1a1a] mb-3">Welcome Back</div>
        <div className="login-subtitle text-[16px] text-[#808080] mb-8">Sign in to continue</div>
        <form onSubmit={handleSubmit}>
          <div className="input-box bg-white border border-[#d9d9d9] rounded-lg mb-4 px-4 h-14 flex items-center">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-none text-[14px] text-[#1a1a1a] placeholder-[#999]"
              required
            />
          </div>
          <div className="input-box bg-white border border-[#d9d9d9] rounded-lg mb-4 px-4 h-14 flex items-center">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-none text-[14px] text-[#1a1a1a] placeholder-[#999]"
              required
            />
          </div>
          <button type="submit" className="login-btn w-full h-14 bg-[#3366ff] text-white text-[16px] font-semibold rounded-lg mt-2 transition hover:bg-[#254edb]">Login</button>
        </form>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-btn w-full h-14 bg-white text-[#222] text-[16px] font-semibold rounded-lg mt-4 flex items-center justify-center shadow-sm border border-[#e0e0e0] hover:bg-gray-50"
        >
          <span className="google-icon w-7 h-7 mr-3 inline-block align-middle">
            <svg width="28" height="28" viewBox="0 0 28 28"><g><path fill="#4285F4" d="M25.6 14.3c0-.9-.1-1.8-.2-2.6H14v5h6.5c-.3 1.5-1.3 2.8-2.7 3.7v3h4.4c2.6-2.4 4.1-5.9 4.1-9.1z"/><path fill="#34A853" d="M14 27c3.7 0 6.7-1.2 8.9-3.2l-4.4-3c-1.2.8-2.7 1.3-4.5 1.3-3.5 0-6.5-2.4-7.6-5.6H2v3.1C4.2 24.6 8.7 27 14 27z"/><path fill="#FBBC05" d="M6.4 16.5c-.3-.8-.5-1.7-.5-2.5s.2-1.7.5-2.5V8.4H2C1.3 9.8 1 11.4 1 13c0 1.6.3 3.2.9 4.6l4.5-3.1z"/><path fill="#EA4335" d="M14 6.5c2 0 3.4.8 4.2 1.5l3.1-3.1C20.7 2.7 17.7 1 14 1 8.7 1 4.2 3.4 2 7.1l4.5 3.1C7.5 8.9 10.5 6.5 14 6.5z"/></g></svg>
          </span>
          Google로 로그인
        </button>
        <a href="#" className="forgot block text-right text-[#666] text-[14px] mt-5 no-underline">Forgot password?</a>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </div>
      <style jsx>{`
        .login-container { box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .login-title { letter-spacing: 0; line-height: 38px; }
        .login-subtitle { letter-spacing: 0; line-height: 19px; }
        .input-box input::placeholder { color: #999; font-size: 14px; }
        .google-btn .google-icon { vertical-align: middle; }
      `}</style>
    </div>
  );
}
