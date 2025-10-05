"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        router.replace("/game-title-page");
      }
    };
    getUser();
    // 로그인/로그아웃 상태 실시간 반영
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          router.replace("/game-title-page");
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">환영합니다!</h1>
      <div className="space-x-4">
        {loading ? null : user ? (
          <button
            onClick={handleLogout}
            className="text-red-500 underline bg-transparent border-none cursor-pointer"
          >
            로그아웃
          </button>
        ) : (
          <>
            <a href="/login" className="text-blue-500 underline">로그인</a>
            <a href="/register" className="text-blue-500 underline">회원가입</a>
            <a href="/portfolio-title-page" className="text-blue-500 underline">포트폴리오</a>
          </>
        )}
      </div>
    </main>
  );
}
