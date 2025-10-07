"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name: string;
  highScore: number;
  totalGames: number;
  totalLines: number;
  createdAt: string;
};

function getProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("tetrisProfiles") || "[]");
}

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const floatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  useEffect(() => {
    const container = floatingRef.current;
    const el = container ?? null;

    let running = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    if (el) {
      const parent = el;
      function addBlock() {
        if (!running) return;
        const block = document.createElement("div");
        const colors = ["I", "O", "T", "S", "Z", "J", "L"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        block.className = `floating-block ${color}`;
        block.style.left = Math.random() * 100 + "%";
        block.style.animationDelay = Math.random() * 2 + "s";
        block.style.animationDuration = (Math.random() * 3 + 4) + "s";
        parent.appendChild(block);
        setTimeout(() => {
          if (block.parentNode) block.parentNode.removeChild(block);
        }, 8000);
      }
      interval = setInterval(addBlock, 1000);
    }

    return () => {
      running = false;
      if (interval) clearInterval(interval);
    };
  }, []);

  const createProfile = () => {
    const n = name.trim();
    if (!n) return alert("프로필 이름을 입력하세요.");
    if (profiles.some((p) => p.name === n)) return alert("이미 존재하는 프로필입니다.");
    const p: Profile = { name: n, highScore: 0, totalGames: 0, totalLines: 0, createdAt: new Date().toISOString() };
    const updated = [...profiles, p];
    setProfiles(updated);
    localStorage.setItem("tetrisProfiles", JSON.stringify(updated));
    setName("");
  };

  const deleteProfile = (n: string) => {
    if (!confirm(`${n} 프로필을 삭제할까요?`)) return;
    const updated = profiles.filter((p) => p.name !== n);
    setProfiles(updated);
    localStorage.setItem("tetrisProfiles", JSON.stringify(updated));
  };

  const selectProfile = (n: string) => {
    localStorage.setItem("tetrisSelectedProfile", n);
    router.push("/games/tetrix/play");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
      <div ref={floatingRef} className="floating-blocks absolute top-0 left-0 w-full h-full pointer-events-none z-0" />
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow z-10 text-slate-900">
        <h1 className="text-2xl font-bold mb-4 drop-shadow-lg animate-pulse text-black">게스트 프로필 관리</h1>
        <div className="mb-4 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="프로필 이름" className="flex-1 border px-3 py-2 rounded" />
          <button onClick={createProfile} className="bg-blue-600 text-white px-4 py-2 rounded">생성</button>
        </div>

        <div className="space-y-3">
          {profiles.length === 0 && <div className="text-sm text-gray-500">생성된 프로필이 없습니다. 새 프로필을 만들어 주세요.</div>}
          {profiles.map((p) => (
            <div key={p.name} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-semibold text-black">{p.name}</div>
                <div className="text-xs text-gray-500">최고 점수: {p.highScore} · 총 게임: {p.totalGames}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => selectProfile(p.name)} className="bg-green-600 text-white px-3 py-1 rounded">선택</button>
                <button onClick={() => deleteProfile(p.name)} className="bg-red-500 text-white px-3 py-1 rounded">삭제</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-600">프로필을 선택하면 게임 플레이 페이지로 이동합니다.</div>
      </div>

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
