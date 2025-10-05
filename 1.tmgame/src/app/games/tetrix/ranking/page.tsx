"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Score = {
  playerName: string;
  score: number;
  level: number;
  lines?: number;
  date: string;
};

type Tab = "all" | "month" | "week";

function getScores(): Score[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("tetrisScores") || "[]");
}

export default function RankingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [scores, setScores] = useState<Score[]>([]);
  const [filtered, setFiltered] = useState<Score[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  useEffect(() => {
    const now = new Date();
    let filteredScores = scores;
    if (tab === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredScores = scores.filter((s) => new Date(s.date) >= monthAgo);
    } else if (tab === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredScores = scores.filter((s) => new Date(s.date) >= weekAgo);
    }
    filteredScores = [...filteredScores].sort((a, b) => b.score - a.score);
    setFiltered(filteredScores);
  }, [tab, scores]);

  // 통계
  const totalPlayers = new Set(scores.map((s) => s.playerName)).size;
  const totalGames = scores.length;
  const highestScore = scores.length > 0 ? Math.max(...scores.map((s) => s.score)) : 0;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-700 p-4">
      <div className="container max-w-3xl w-full bg-blue-500 bg-opacity-10 p-8 rounded-2xl backdrop-blur shadow-lg">
        <div className="header text-center text-white mb-6">
          <h1 className="text-4xl font-bold mb-2 drop-shadow">🏆 테트리스 랭킹</h1>
        </div>
        <button
          className="back-button bg-green-600 text-white px-5 py-2 rounded mb-6 hover:bg-green-700"
          onClick={() => router.push("/games/tetrix")}
        >
          ← 게임으로 돌아가기
        </button>
        <div className="ranking-tabs flex gap-2 mb-4">
          <button
            className={`tab-button px-4 py-2 rounded ${tab === "all" ? "bg-blue-700 bg-opacity-30" : "bg-blue-600 bg-opacity-20"} text-white`}
            onClick={() => setTab("all")}
          >
            전체 랭킹
          </button>
          <button
            className={`tab-button px-4 py-2 rounded ${tab === "month" ?  "bg-blue-700 bg-opacity-30" : "bg-blue-600 bg-opacity-20"} text-white`}
            onClick={() => setTab("month")}
          >
            이번 달
          </button>
          <button
            className={`tab-button px-4 py-2 rounded ${tab === "week" ?  "bg-blue-700 bg-opacity-30" : "bg-blue-600 bg-opacity-20"} text-white`}
            onClick={() => setTab("week")}
          >
            이번 주
          </button>
        </div>
        <div className="ranking-table bg-blue-800 bg-opacity-10 rounded-lg overflow-hidden mb-6">
          <div className="ranking-header grid grid-cols-5 gap-2 bg-blue-700 bg-opacity-20 p-3 font-bold text-white text-center">
            <div>순위</div>
            <div>플레이어</div>
            <div>점수</div>
            <div>레벨</div>
            <div>날짜</div>
          </div>
          <div id="rankingList">
            {filtered.length === 0 ? (
              <div className="no-data text-center text-white py-8">데이터가 없습니다</div>
            ) : (
              filtered.map((score, idx) => {
                const rank = idx + 1;
                let rankClass = "";
                if (rank === 1) rankClass = "text-yellow-400 font-bold";
                else if (rank === 2) rankClass = "text-gray-300 font-bold";
                else if (rank === 3) rankClass = "text-orange-500 font-bold";
                return (
                  <div
                    key={idx}
                    className={
                      `ranking-row grid grid-cols-5 gap-2 p-3 text-center border-b border-white/10 hover:bg-white/10 transition ` +
                      (rank <= 3 ? rankClass : "")
                    }
                  >
                    <div className="rank">{rank}</div>
                    <div className="player-name text-left font-bold">{score.playerName}</div>
                    <div className="score text-green-400 font-bold">{score.score.toLocaleString()}</div>
                    <div className="level text-blue-400">{score.level}</div>
                    <div className="date text-gray-200 text-sm">{new Date(score.date).toLocaleDateString("ko-KR")}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="stats-summary grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="stat-card bg-blue-700 bg-opacity-10 p-4 rounded text-center text-white">
            <div className="stat-number text-2xl font-bold text-green-400 mb-1">{totalPlayers}</div>
            <div className="stat-label text-gray-200 text-sm">총 플레이어 수</div>
          </div>
          <div className="stat-card bg-blue-700 bg-opacity-10 p-4 rounded text-center text-white">
            <div className="stat-number text-2xl font-bold text-green-400 mb-1">{totalGames}</div>
            <div className="stat-label text-gray-200 text-sm">총 게임 수</div>
          </div>
          <div className="stat-card bg-blue-700 bg-opacity-10 p-4 rounded text-center text-white">
            <div className="stat-number text-2xl font-bold text-green-400 mb-1">{highestScore.toLocaleString()}</div>
            <div className="stat-label text-gray-200 text-sm">최고 점수</div>
          </div>
          <div className="stat-card bg-blue-700 bg-opacity-10 p-4 rounded text-center text-white">
            <div className="stat-number text-2xl font-bold text-green-400 mb-1">{avgScore.toLocaleString()}</div>
            <div className="stat-label text-gray-200 text-sm">평균 점수</div>
          </div>
        </div>
      </div>
    </div>
  );
}
