"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 블록 색상
const BLOCK_COLORS: Record<string, string> = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

type Profile = {
  name: string;
  highScore: number;
  totalGames: number;
  totalLines: number;
  createdAt: string;
};

type Piece = {
  shape: number[][];
  color: string;
  x: number;
  y: number;
};

function getProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("tetrisProfiles") || "[]");
}

function getScores() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("tetrisScores") || "[]");
}

export default function TGamePage() {
  const router = useRouter();

  // 프로필 관리
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [highScore, setHighScore] = useState<number>(0);

  // 게임 상태
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // 테트리스 보드와 블록
  const [board, setBoard] = useState<(string | 0)[][]>(
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);

  // 프로필 불러오기
  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  // 프로필 선택 시 최고점수 표시
  useEffect(() => {
    if (selectedProfile) setHighScore(selectedProfile.highScore);
    else setHighScore(0);
  }, [selectedProfile]);

  // 키보드 이벤트
  useEffect(() => {
    if (!gameRunning || gamePaused) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPiece) return;
      if (e.key === "ArrowLeft") movePiece(-1, 0);
      if (e.key === "ArrowRight") movePiece(1, 0);
      if (e.key === "ArrowDown") movePiece(0, 1);
      if (e.key === "ArrowUp") rotatePiece();
      if (e.key === " ") dropPiece();
      if (e.key === "p" || e.key === "P") setGamePaused((p) => !p);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [gameRunning, gamePaused, currentPiece, board]);

  // 게임 루프
  useEffect(() => {
    if (!gameRunning || gamePaused) return;
    const interval = setInterval(() => {
      movePiece(0, 1);
    }, Math.max(100, 1000 - (level - 1) * 100));
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [gameRunning, gamePaused, currentPiece, board, level]);

  // 프로필 생성
  const handleCreateProfile = () => {
    const name = newProfileName.trim();
    if (!name) return alert("프로필 이름을 입력하세요.");
    if (profiles.some((p) => p.name === name)) return alert("이미 존재하는 프로필입니다.");
    const newProfile: Profile = {
      name,
      highScore: 0,
      totalGames: 0,
      totalLines: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem("tetrisProfiles", JSON.stringify(updated));
    setSelectedProfile(newProfile);
    setNewProfileName("");
  };

  type Score = {
  playerName: string;
  score: number;
  level: number;
  lines: number;
  date: string;
};

  // 프로필 삭제
  const handleDeleteProfile = () => {
    if (!selectedProfile) return alert("삭제할 프로필을 선택하세요.");
    if (!window.confirm(`"${selectedProfile.name}" 프로필을 삭제할까요?`)) return;
    const updated = profiles.filter((p) => p.name !== selectedProfile.name);
    setProfiles(updated);
    localStorage.setItem("tetrisProfiles", JSON.stringify(updated));
    setSelectedProfile(null);
    setHighScore(0);
    // 점수도 삭제
    const scores = getScores().filter((s: Score) => s.playerName !== selectedProfile.name);
    localStorage.setItem("tetrisScores", JSON.stringify(scores));
  };

  // 프로필 선택
  const handleSelectProfile = (name: string) => {
    const found = profiles.find((p) => p.name === name) || null;
    setSelectedProfile(found);
    setHighScore(found?.highScore || 0);
  };

  // 게임 시작
  const handleStart = () => {
    if (!selectedProfile) return alert("프로필을 선택하세요.");
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameRunning(true);
    setGamePaused(false);
    setGameOver(false);
    setBoard(Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0)));
    const first = getRandomPiece();
    setCurrentPiece(first);
    setNextPiece(getRandomPiece());
  };

  // 게임 오버
  const handleGameOver = () => {
    setGameRunning(false);
    setGameOver(true);
    // 점수 저장
    if (selectedProfile) {
      const scores = getScores();
      scores.push({
        playerName: selectedProfile.name,
        score,
        level,
        lines,
        date: new Date().toISOString(),
      });
      localStorage.setItem("tetrisScores", JSON.stringify(scores));
      // 프로필 최고점수 갱신
      const updatedProfiles = profiles.map((p) =>
        p.name === selectedProfile.name
          ? {
              ...p,
              highScore: Math.max(p.highScore, score),
              totalGames: p.totalGames + 1,
              totalLines: p.totalLines + lines,
            }
          : p
      );
      setProfiles(updatedProfiles);
      localStorage.setItem("tetrisProfiles", JSON.stringify(updatedProfiles));
      setHighScore(Math.max(selectedProfile.highScore, score));
    }
  };

  // 블록 생성
  function getRandomPiece(): Piece {
    const pieces = [
      { shape: [[1, 1, 1, 1]], color: "I" },
      { shape: [[1, 1], [1, 1]], color: "O" },
      { shape: [[0, 1, 0], [1, 1, 1]], color: "T" },
      { shape: [[0, 1, 1], [1, 1, 0]], color: "S" },
      { shape: [[1, 1, 0], [0, 1, 1]], color: "Z" },
      { shape: [[1, 0, 0], [1, 1, 1]], color: "J" },
      { shape: [[0, 0, 1], [1, 1, 1]], color: "L" },
    ];
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      shape: piece.shape.map((row) => [...row]),
      color: piece.color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
    };
  }

  // 충돌 체크
  function checkCollision(piece: Piece, x: number, y: number) {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const newX = x + px;
          const newY = y + py;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // 블록 이동
  function movePiece(dx: number, dy: number) {
    if (!currentPiece) return;
    const newX = currentPiece.x + dx;
    const newY = currentPiece.y + dy;
    if (!checkCollision(currentPiece, newX, newY)) {
      setCurrentPiece({ ...currentPiece, x: newX, y: newY });
    } else if (dy > 0) {
      placePiece();
    }
  }

  // 블록 회전
  function rotatePiece() {
    if (!currentPiece) return;
    const rotated = rotateMatrix(currentPiece.shape);
    const testPiece = { ...currentPiece, shape: rotated };
    if (!checkCollision(testPiece, currentPiece.x, currentPiece.y)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  }

  function rotateMatrix(matrix: number[][]) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols)
      .fill(0)
      .map(() => Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = matrix[i][j];
      }
    }
    return rotated;
  }

  // 블록 놓기
  function placePiece() {
    if (!currentPiece) return;
    const newBoard = board.map((row) => [...row]);
    for (let py = 0; py < currentPiece.shape.length; py++) {
      for (let px = 0; px < currentPiece.shape[py].length; px++) {
        if (currentPiece.shape[py][px]) {
          const x = currentPiece.x + px;
          const y = currentPiece.y + py;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = currentPiece.color;
          }
        }
      }
    }
    clearLines(newBoard);
  }

  // 라인 클리어
  function clearLines(newBoard: (string | 0)[][]) {
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }
    setLines((l) => l + linesCleared);
    setScore((s) => s + linesCleared * 100 * level);
    setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    setBoard(newBoard);
    spawnPiece(newBoard);
  }

  // 블록 떨어뜨리기
  function dropPiece() {
    if (!currentPiece) return;
    let y = currentPiece.y;
    while (!checkCollision(currentPiece, currentPiece.x, y + 1)) {
      y++;
    }
    setCurrentPiece({ ...currentPiece, y });
    placePiece();
  }

  // 새 블록 생성
  function spawnPiece(newBoard: (string | 0)[][]) {
    if (!nextPiece) {
      setCurrentPiece(getRandomPiece());
      setNextPiece(getRandomPiece());
      return;
    }
    const piece = nextPiece;
    piece.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
    piece.y = 0;
    if (checkCollision(piece, piece.x, piece.y)) {
      setGameOver(true);
      setGameRunning(false);
      handleGameOver();
      return;
    }
    setCurrentPiece(piece);
    setNextPiece(getRandomPiece());
    setBoard(newBoard);
  }

  // 게임 재시작
  const handleRestart = () => {
    setGameOver(false);
    handleStart();
  };

  // 랭킹 페이지 이동
  const goToRanking = () => {
    router.push("/games/tetrix/ranking");
  };

  // 메인으로 이동
  const goBack = () => {
    router.push("/games/tetrix");
  };

  // 보드 렌더링
  function renderBoard() {
    const cells = [];
    // 기존 보드
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const color = board[y][x];
        if (color) {
          cells.push(
            <div
              key={`b-${y}-${x}`}
              className={`block ${color}`}
              style={{
                left: x * BLOCK_SIZE,
                top: y * BLOCK_SIZE,
                background: BLOCK_COLORS[color as string],
              }}
            />
          );
        }
      }
    }
    // 현재 블록
    if (currentPiece) {
      for (let py = 0; py < currentPiece.shape.length; py++) {
        for (let px = 0; px < currentPiece.shape[py].length; px++) {
          if (currentPiece.shape[py][px]) {
            const x = currentPiece.x + px;
            const y = currentPiece.y + py;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              cells.push(
                <div
                  key={`c-${y}-${x}`}
                  className={`block ${currentPiece.color}`}
                  style={{
                    left: x * BLOCK_SIZE,
                    top: y * BLOCK_SIZE,
                    background: BLOCK_COLORS[currentPiece.color],
                  }}
                />
              );
            }
          }
        }
      }
    }
    return cells;
  }

  // 다음 블록 렌더링
  function renderNextPiece() {
    if (!nextPiece) return null;
    const offsetX = (120 - nextPiece.shape[0].length * 20) / 2;
    const offsetY = (120 - nextPiece.shape.length * 20) / 2;
    const cells = [];
    for (let py = 0; py < nextPiece.shape.length; py++) {
      for (let px = 0; px < nextPiece.shape[py].length; px++) {
        if (nextPiece.shape[py][px]) {
          cells.push(
            <div
              key={`n-${py}-${px}`}
              className={`block ${nextPiece.color}`}
              style={{
                position: "absolute",
                left: offsetX + px * 20,
                top: offsetY + py * 20,
                width: 18,
                height: 18,
                background: BLOCK_COLORS[nextPiece.color],
              }}
            />
          );
        }
      }
    }
    return <div style={{ position: "relative", width: 120, height: 120 }}>{cells}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <div className="main-container flex flex-col items-center gap-6">
        {/* 헤더 */}
        <div className="header flex gap-4 items-center mb-4">
          <button className="back-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={goBack}>
            ← 메인으로
          </button>
          <div className="profile-section bg-blue-500 bg-opacity-10 p-6 rounded-2xl backdrop-blur shadow text-white min-w-[300px]">
            <h3 className="font-bold mb-2">프로필 관리</h3>
            <div className="profile-selector mb-2">
              <select
                className="w-full p-2 rounded bg-blue-400 bg-opacity-20 text-white"
                value={selectedProfile?.name || ""}
                onChange={(e) => handleSelectProfile(e.target.value)}
              >
                <option value="">프로필을 선택하세요</option>
                {profiles.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-input flex gap-2 mt-2">
              <input
                type="text"
                className="flex-1 p-2 rounded bg-blue-400 bg-opacity-20 text-white"
                placeholder="새 프로필 이름"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
              <button className="btn btn-primary bg-green-600 text-white px-3 rounded" onClick={handleCreateProfile}>
                생성
              </button>
            </div>
            <div className="profile-buttons flex gap-2 mt-2">
              <button className="btn btn-secondary bg-blue-600 text-white px-3 rounded" onClick={goToRanking}>
                랭킹 보기
              </button>
              <button className="btn btn-danger bg-red-500 text-white px-3 rounded" onClick={handleDeleteProfile}>
                삭제
              </button>
            </div>
            {selectedProfile && (
              <>
                <div className="current-player bg-blue-500 bg-opacity-10 p-2 rounded mt-2 text-center">
                  <strong>현재 플레이어: {selectedProfile.name}</strong>
                </div>
                <div className="high-score bg-yellow-200 bg-opacity-20 p-2 rounded mt-2 text-center text-yellow-900">
                  <strong>최고 점수: {highScore.toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        </div>
        {/* 게임 영역 */}
        <div className="game-container flex gap-6 bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur shadow">
          {/* 게임 보드 */}
          <div
            className="game-board relative"
            style={{
              width: BOARD_WIDTH * BLOCK_SIZE,
              height: BOARD_HEIGHT * BLOCK_SIZE,
              background: "#000",
              border: "3px solid #fff",
              borderRadius: 10,
            }}
          >
            {renderBoard()}
            {gameOver && (
              <div className="game-over absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white rounded">
                <h2 className="text-2xl font-bold mb-2">게임 오버!</h2>
                <p className="mb-2">최종 점수: <span>{score}</span></p>
                <button className="start-button bg-green-600 text-white px-4 py-2 rounded mt-2" onClick={handleRestart}>
                  다시 시작
                </button>
              </div>
            )}
          </div>
          {/* 정보 패널 */}
          <div className="info-panel flex flex-col gap-4 min-w-[200px] text-white">
            <div className="score-board bg-blue-500 bg-opacity-10 p-4 rounded text-center">
              <h3 className="font-bold">점수</h3>
              <div>{score}</div>
              <h3 className="font-bold mt-2">레벨</h3>
              <div>{level}</div>
              <h3 className="font-bold mt-2">라인</h3>
              <div>{lines}</div>
            </div>
            <div className="next-piece bg-blue-500 bg-opacity-10 p-4 rounded text-center">
              <h3 className="font-bold">다음 블록</h3>
              <div className="next-board mx-auto mt-2" style={{ width: 120, height: 120, position: "relative" }}>
                {renderNextPiece()}
              </div>
            </div>
            <div className="controls bg-blue-500 bg-opacity-10 p-4 rounded text-sm">
              <h3 className="font-bold">조작법</h3>
              <p>← → : 이동</p>
              <p>↓ : 빠른 낙하</p>
              <p>↑ : 회전</p>
              <p>스페이스 : 즉시 낙하</p>
              <p>P : 일시정지</p>
            </div>
            <button
              className="start-button bg-green-600 text-white px-4 py-2 rounded mt-2"
              onClick={handleStart}
              disabled={!selectedProfile || gameRunning}
            >
              게임 시작
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .block {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 1px solid #333;
          box-sizing: border-box;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
