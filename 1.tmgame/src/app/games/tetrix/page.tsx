"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

const BLOCK_COLORS = [
  "I", "O", "T", "S", "Z", "J", "L"
];

function createRandomBlockStyle() {
  return {
    left: Math.random() * 100 + "%",
    animationDelay: Math.random() * 2 + "s",
    animationDuration: (Math.random() * 3 + 4) + "s"
  };
}

export default function TetrixGamePage() {
  const router = useRouter();
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{ email?: string | null; name?: string | null } | null>(null);

  useEffect(() => {
    const container = floatingRef.current;
    if (!container) return;
    let running = true;
    function addBlock() {
      if (!running) return;
      const block = document.createElement("div");
      const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
      block.className = `floating-block ${color}`;
      const style = createRandomBlockStyle();
      Object.assign(block.style, style);
      container?.appendChild(block);
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

  // Supabase로 로그인된 사용자 정보 가져오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const {
          data: { user: suser },
        } = await supabase.auth.getUser();
        if (!mounted) return;
        if (suser) {
          const meta = (suser.user_metadata ?? {}) as Record<string, unknown>;
          const name = (meta["display_name"] as string) || (meta["name"] as string) || null;
          setUser({ email: suser.email, name });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
      {/* (나가기 버튼을 버튼 컨테이너로 이동했습니다) */}
      <div ref={floatingRef} className="floating-blocks absolute top-0 left-0 w-full h-full pointer-events-none z-0" />
      <main className="main-container text-center text-white z-10 relative">
  <h1 className="title text-5xl font-bold mt-[30px] mb-4 drop-shadow-lg animate-pulse">🎮 TMGame</h1>
        <p className="subtitle text-xl mb-12 opacity-90 drop-shadow">클래식 퍼즐 게임의 재미를 느껴보세요!</p>
        <div className="button-container flex flex-col gap-5 items-center mb-10">
          <div className="welcome-text text-white text-lg font-semibold">
            {user && (user.name || user.email) ? (
              <div>{user.name ? `${user.name} (${user.email})님, 환영합니다!` : `${user.email}님, 환영합니다!`}</div>
            ) : (
              <div>게스트님 환영합니다!</div>
            )}
          </div>
          <button
            className="action-button bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:from-green-600 hover:to-green-500 transition w-64"
            onClick={() => router.push("/games/tetrix/play")}
          >
            게임 시작
          </button>
          <button
            className="action-button bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition w-64"
            onClick={() => router.push("/games/tetrix/ranking")}
          >
            랭킹 보기
          </button>
          <button
            className="action-button bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition w-64"
            onClick={() => router.push('/game-title-page')}
          >
            나가기
          </button>
        </div>
        <div className="features grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-8">
          <div className="feature bg-blue-500 bg-opacity-10 p-6 rounded-xl shadow">
            <h3 className="mb-2 text-lg font-semibold">🎯 프로필 시스템</h3>
            <p>개인별 점수 관리와 최고 기록 추적</p>
          </div>
          <div className="feature bg-blue-500 bg-opacity-10 p-6 rounded-xl shadow">
            <h3 className="mb-2 text-lg font-semibold">🏆 랭킹 시스템</h3>
            <p>다른 플레이어와 점수 경쟁</p>
          </div>
          <div className="feature bg-blue-500 bg-opacity-10 p-6 rounded-xl shadow">
            <h3 className="mb-2 text-lg font-semibold">💾 자동 저장</h3>
            <p>게임 점수 자동 저장 및 통계 관리</p>
          </div>
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
