"use client";
import { useEffect, useState, useRef } from "react";
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
  const floatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = floatingRef.current;
    if (!container) return;
    const el = container;
    let running = true;
    function addBlock() {
      if (!running) return;
      const block = document.createElement("div");
      const colors = ["I", "O", "T", "S", "Z", "J", "L"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      block.className = `floating-block ${color}`;
      block.style.left = Math.random() * 100 + "%";
      block.style.animationDelay = Math.random() * 2 + "s";
      block.style.animationDuration = (Math.random() * 3 + 4) + "s";
      el.appendChild(block);
      setTimeout(() => {
        if (block.parentNode) block.parentNode.removeChild(block);
      }, 8000);
    }
    const interval = setInterval(addBlock, 1000);
    return () => {
      running = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
      <div ref={floatingRef} className="floating-blocks absolute top-0 left-0 w-full h-full pointer-events-none z-0" />
      <main className="main-container text-center text-white z-10 relative flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-pulse">환영합니다!</h1>
        <div className="w-full">
          {loading ? null : user ? (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <a href="/game-title-page" className="inline-block bg-indigo-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-indigo-600 transition">게스트</a>
                <a href="/login" className="inline-block bg-green-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-green-600 transition">로그인</a>
                <a href="/register" className="inline-block bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-full shadow hover:bg-yellow-500 transition">회원가입</a>
              </div>
              <div className="mt-4 flex justify-center">
                <a href="/portfolio-title-page" className="inline-block bg-slate-600 text-white font-medium px-6 py-2 rounded-full shadow hover:bg-slate-700 transition">포트폴리오 | 이력서</a>
              </div>
            </>
          )}
        </div>
      </main>
      <style jsx global>{`
        .floating-blocks { z-index: 1; }
        .floating-block {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 5px;
          animation: float 6s infinite linear;
          opacity: 0.3;
        }
        .floating-block.I { background: #00f0f0; }
        .floating-block.O { background: #f0f000; }
        .floating-block.T { background: #a000f0; }
        .floating-block.S { background: #00f000; }
        .floating-block.Z { background: #f00000; }
        .floating-block.J { background: #0000f0; }
        .floating-block.L { background: #f0a000; }
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
