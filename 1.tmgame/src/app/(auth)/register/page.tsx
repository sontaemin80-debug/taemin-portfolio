"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";


export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { email, password, username } = form;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: {  display_name : username } }
    });

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists")
      ) {
        setError("이미 사용 중인 이메일입니다. 다른 이메일을 사용해야 합니다.");
      } else {
        setError(error.message);
      }
    } else {
      setSuccess("회원가입이 완료되었습니다. 이메일을 확인하세요.");
    }
  };

  // 구글 소셜 로그인
  const handleGoogleSignup = async () => {
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
      <div className="signup-container w-[403px] bg-[#fafafa] rounded-2xl shadow-lg p-12 pt-12 pb-8 box-border">
        <div className="signup-title text-[32px] font-bold text-[#1a1a1a] mb-3">Create Account</div>
        <div className="signup-subtitle text-[16px] text-[#808080] mb-8">Sign up to get started</div>
        <form onSubmit={handleSubmit}>
          <div className="input-box bg-white border border-[#d9d9d9] rounded-lg mb-4 px-4 h-14 flex items-center">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-none text-[14px] text-[#1a1a1a] placeholder-[#999]"
              required
            />
          </div>
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
          <button type="submit" className="signup-btn w-full h-14 bg-[#3366ff] text-white text-[16px] font-semibold rounded-lg mt-2 transition hover:bg-[#254edb]">Sign Up</button>
        </form>
        <div className="divider text-center text-[#808080] text-[14px] my-6">or continue with</div>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="google-btn w-full h-14 bg-white text-[#666] text-[16px] font-medium rounded-lg flex items-center justify-center shadow-sm border border-[#d9d9d9] hover:bg-gray-50"
        >
          <span className="google-icon w-6 h-6 mr-3 inline-block align-middle bg-white rounded-full text-center leading-[24px] font-bold text-[18px] border border-[#eee] text-[#4285f5]">G</span>
          Sign up with Google
        </button>
        <a href="#" className="login-link block text-center text-[#666] text-[14px] mt-7 no-underline">Already have an account? Log in</a>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </div>
      <style jsx>{`
        .signup-container { box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .signup-title { letter-spacing: 0; line-height: 38px; }
        .signup-subtitle { letter-spacing: 0; line-height: 19px; }
        .input-box input::placeholder { color: #999; font-size: 14px; }
        .google-btn .google-icon { vertical-align: middle; }
      `}</style>
    </div>
  );
}
