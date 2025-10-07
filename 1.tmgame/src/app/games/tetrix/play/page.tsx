"use client";
import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  // 프로필 관리: profiles는 로컬스토리지에서 유지, 선택된 프로필은 별도 키에 저장
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [highScore, setHighScore] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);

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

  // Refs to hold latest board and currentPiece so the gravity loop doesn't get recreated
  // or blocked by closures when other actions (left/right) occur.
  const currentPieceRef = useRef<Piece | null>(null);
  const boardRef = useRef<(string | 0)[][]>(
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0))
  );

  // 프로필과 선택된 프로필 로드
  useEffect(() => {
    (async () => {
      const p = getProfiles();
      setProfiles(p);

      // Supabase에서 현재 사용자 정보 가져오기
      let currentUser: User | null = null;
      try {
        const { data } = await supabase.auth.getUser();
        currentUser = data?.user ?? null;
      } catch {
        currentUser = null;
      }
      setUser(currentUser);

      if (currentUser) {
        const email = currentUser.email ?? null;
        // 메타의 display_name을 우선 사용 (user_metadata는 런타임 객체이므로 안전하게 읽음)
        const meta = (currentUser.user_metadata ?? {}) as Record<string, unknown>;
        const displayName = (meta["display_name"] as string) || (meta["full_name"] as string) || (email ? email.split("@")[0] : "player");
        const profileName = `${displayName} (${email})`;
        // 매칭 우선순위: 1) 이메일, 2) 'displayName (email)' 형태, 3) displayName
        let found = p.find((x) => x.name === profileName) ||
          null;

        if (!found) {
          // 새 프로필 생성: 내부 식별은 이메일로 하고, UI에서는 displayName(email) 형식으로 보여줌
          const newProfile: Profile = {
            name: profileName,
            highScore: 0,
            totalGames: 0,
            totalLines: 0,
            createdAt: new Date().toISOString(),
          };
          const updated = [...p, newProfile];
          try {
            localStorage.setItem("tetrisProfiles", JSON.stringify(updated));
          } catch {
            // ignore
          }
          setProfiles(updated);
          found = newProfile;
        }

        // 선택된 프로필로 설정 (저장은 식별자용 name을 저장)
        try {
          localStorage.setItem("tetrisSelectedProfile", found.name);
        } catch {}
        setSelectedProfile(found);
        setHighScore(found.highScore || 0);
        return;
      }
      else{
        const selectedName = typeof window !== "undefined" ? localStorage.getItem("tetrisSelectedProfile") : null;

        if (selectedName) {
          const found = p.find((x) => x.name === selectedName) || null;
          setSelectedProfile(found);
          setHighScore(found?.highScore || 0);
          return;
        }
      }

      // 로그인도 없고 선택된 프로필도 없으면 프로필 관리 페이지로 이동
      router.push("/games/tetrix/profiles");
    })();
  }, [router]);

  // Supabase auth 상태 변경 구독 (페이지에 머무르는 동안 로그인/로그아웃 반영)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 페이지가 열릴 때 최하단으로 자동 스크롤 (클라이언트 전용)
  useEffect(() => {
    // 약간의 지연을 주어 DOM이 안정된 뒤 스크롤
    const t = window.setTimeout(() => {
      try {
        const top = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        window.scrollTo({ top, behavior: "smooth" });
      } catch (e) {
        // 브라우저가 아닌 환경에서는 무시
      }
    }, 80);
    return () => clearTimeout(t);
  }, []);

  // 키보드 이벤트
  // bind movePiece to ref so loops can call the latest function
  useEffect(() => {
    movePieceRef.current = movePiece;
  }, [movePiece]);

  // 전역: P 키로 항상 일시정지 토글 (게임 running 여부와 무관하게 작동)
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        setGamePaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, []);

  useEffect(() => {
    if (!gameRunning || gamePaused) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeysRef.current[e.key] = true;
      if (!currentPiece) return;
      if (e.key === "ArrowLeft") movePiece(-1, 0);
      if (e.key === "ArrowRight") movePiece(1, 0);
      if (e.key === " ") {
        e.preventDefault();
        dropPiece();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current[e.key] = false;
      if (!currentPiece) return;
      if (e.key === "ArrowUp") rotatePiece();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRunning, gamePaused, currentPiece, board]);

  // 게임 루프 - independent RAF loop using refs
  useEffect(() => {
    if (!gameRunning || gamePaused) return;
    let rafId: number | null = null;
    let last = performance.now();
    const baseInterval = Math.max(100, 1000 - (level - 1) * 100);
    const softInterval = Math.max(30, Math.floor(baseInterval / 6));

    const loop = (now: number) => {
      const elapsed = now - last;
      const downHeld = !!pressedKeysRef.current["ArrowDown"];
      const interval = downHeld ? softInterval : baseInterval;
      if (elapsed >= interval) {
        // use the ref to ensure latest movePiece behavior is used
        movePieceRef.current?.(0, 1);
        last = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRunning, gamePaused, level]);

  // on-screen 버튼용 홀드(press-and-hold) 지원
  const leftHoldRef = useRef<number | null>(null);
  const rightHoldRef = useRef<number | null>(null);
  const downHoldRef = useRef<number | null>(null);
  const movePieceRef = useRef<((dx: number, dy: number) => void) | null>(null);
  const pressedKeysRef = useRef<Record<string, boolean>>({});

  // 텍스트를 최대 10글자(길면 마지막 문자는 '…'로)로 제한
  function truncateText(s?: string | null) {
    if (!s) return "";
    return s.length > 10 ? s.slice(0, 9) + "…" : s;
  }

  function startHold(action: () => void, ref: React.MutableRefObject<number | null>, repeat = 100) {
    // 즉시 한 번 실행하고 반복 시작
    action();
    if (ref.current) return;
    ref.current = window.setInterval(() => {
      // 방어: 게임이 멈췄다면 중지
      if (!gameRunning || gamePaused) {
        stopHold(ref);
        return;
      }
      action();
    }, repeat) as unknown as number;
  }

  function stopHold(ref: React.MutableRefObject<number | null>) {
    if (ref.current) {
      clearInterval(ref.current as unknown as number);
      ref.current = null;
    }
  }

  // 프로필 관련: 선택은 profiles 페이지에서 수행, play 페이지는 selected profile을 읽어 게임 시작

  // 게임 시작
  const handleStart = () => {
    if (!selectedProfile) return alert("프로필을 선택하세요.");
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameRunning(true);
    setGamePaused(false);
    setGameOver(false);
    const empty = Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    setBoard(empty);
    boardRef.current = empty;
    const first = getRandomPiece();
    setCurrentPiece(first);
    currentPieceRef.current = first;
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
      const updated = { ...currentPiece, x: newX, y: newY };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
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
      const updated = { ...currentPiece, shape: rotated };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
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

  // 블록 놓기 (overridePiece를 전달하면 그 piece를 사용해서 즉시 배치)
  function placePiece(overridePiece?: Piece) {
    const piece = overridePiece ?? currentPiece;
    if (!piece) return;
    const newBoard = board.map((row) => [...row]);
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const x = piece.x + px;
          const y = piece.y + py;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = piece.color;
          }
        }
      }
    }
    // 현재 조작 중인 블록 상태를 즉시 정리
    setCurrentPiece(null);
    currentPieceRef.current = null;
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
    boardRef.current = newBoard;
    spawnPiece(newBoard);
  }

  // 블록 떨어뜨리기 (하드 드롭: 계산된 위치로 바로 배치)
  function dropPiece() {
    if (!currentPiece) return;
    let y = currentPiece.y;
    while (!checkCollision(currentPiece, currentPiece.x, y + 1)) {
      y++;
    }
    const dropped = { ...currentPiece, y };
    // 상태 업데이트에 의존하지 않고 즉시 놓기
    placePiece(dropped);
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
    currentPieceRef.current = piece;
    setNextPiece(getRandomPiece());
    setBoard(newBoard);
    boardRef.current = newBoard;
  }

  // 게임 재시작
  const handleRestart = () => {
    setGameOver(false);
    handleStart();
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
    // We'll render blocks using percent positions so the preview scales with its container (aspect-square)
    const cols = nextPiece.shape[0].length;
    const rows = nextPiece.shape.length;
    const cellPercent = 100 / Math.max(cols, rows);
    const cells = [];
    for (let py = 0; py < rows; py++) {
      for (let px = 0; px < cols; px++) {
        if (nextPiece.shape[py][px]) {
          const left = px * cellPercent + (50 - (cols * cellPercent) / 2);
          const top = py * cellPercent + (50 - (rows * cellPercent) / 2);
          cells.push(
            <div
              key={`n-${py}-${px}`}
              className={`block ${nextPiece.color}`}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                width: `calc(${cellPercent}% - 2px)`,
                height: `calc(${cellPercent}% - 2px)`,
                background: BLOCK_COLORS[nextPiece.color],
              }}
            />
          );
        }
      }
    }
    return <div style={{ position: "relative", width: "100%", height: "100%" }}>{cells}</div>;
  }

  return (
  <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-400 to-purple-600 p-0 m-0">
  <div className="main-container flex flex-col items-center gap-0 w-full">

  {/* 정보 패널 (상단, 좌우 50:50) */}
  <div className="info-panel-top flex flex-row gap-[2px] items-center justify-center text-white mx-auto" style={{ width: BOARD_WIDTH * BLOCK_SIZE }}>
  <div className="profile-display flex-1 bg-blue-500 bg-opacity-10 p-0.5 rounded text-white min-w-0 h-[80px] flex items-center justify-center">
      {user ? (
            <div className="text-center">
          {(() => {
            const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
            const display = (meta["display_name"] as string) || (meta["full_name"] as string) || null;
            return (
              <div className="font-bold text-base profile-name">{truncateText(display ? display : (user?.email ?? ""))}</div>
            );
          })()}
          <div className="text-sm mt-0">최고 점수: {highScore.toLocaleString()}</div>
        </div>
      ) : selectedProfile ? (
        <div className="text-center">
          <div className="font-bold text-base profile-name">{truncateText(selectedProfile.name)}</div>
          <div className="text-sm mt-0">최고 점수: {highScore.toLocaleString()}</div>
          {!user && (
            <div className="mt-0 text-center">
              <button className="bg-blue-600 text-white px-2 py-0.5 rounded-sm text-sm" onClick={() => router.push('/games/tetrix/profiles')}>프로필 관리하러 가기</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-sm">선택된 프로필이 없습니다.</div>
      )}

    </div>
    <div className="next-piece flex-1 bg-blue-500 bg-opacity-10 p-0.5 rounded text-white min-w-0 h-[80px] flex flex-col items-center justify-center">
      <div className="next-board mx-auto mt-0 w-full aspect-square max-w-[70px]" style={{ position: "relative" }}>
        {renderNextPiece()}
      </div>
    </div>
  </div>

  {/* 게임 영역 */}
  <div className="game-container flex gap-0 rounded" style={{ background: 'rgba(255,255,255,0.02)', padding: 0 }}>
          {/* 게임 보드 */}
          <div
            className="game-board relative"
            style={{
              width: BOARD_WIDTH * BLOCK_SIZE,
              height: BOARD_HEIGHT * BLOCK_SIZE,
              background: "#000",
              border: "0px solid #fff",
              borderRadius: 4,
            }}
          >
            {/* 보드 상단 통계: 점수/레벨/라인 (항상 보드 위에 위치) */}
            <div className="board-stats absolute top-0 left-1/2 transform -translate-x-1/2 bg-transparent text-white px-3 py-0 rounded flex gap-4 items-center z-20">
              <div className="stat text-center">
                <div className="text-[10px]">점수</div>
                <div className="text-sm font-bold">{score}</div>
              </div>
              <div className="stat text-center">
                <div className="text-[10px]">레벨</div>
                <div className="text-sm font-bold">{level}</div>
              </div>
              <div className="stat text-center">
                <div className="text-[10px]">라인</div>
                <div className="text-sm font-bold">{lines}</div>
              </div>
            </div>
            {renderBoard()}
            {gameOver && (
              <div className="game-over absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white rounded">
                <h2 className="text-2xl font-bold mb-2">게임 오버!</h2>
                <p className="mb-2">최종 점수: <span>{score}</span></p>
                <button className="start-button bg-green-600 text-white px-3 py-1.5 rounded mt-2" onClick={handleRestart}>
                  다시 시작
                </button>
                <button className="mt-2 bg-red-500 text-white px-3 py-1.5 rounded" onClick={goBack}>
                  ← 메인으로
                </button>
              </div>
            )}
            {/* 게임 시작 버튼: 보드 중앙에 표시 (버튼만 클릭 가능) */}
            {!gameRunning && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-2">
                  <button
                    className="start-button bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleStart}
                    disabled={!selectedProfile}
                  >
                    게임 시작
                  </button>
                  <div className="controls text-white text-sm text-center leading-tight">
                    <div>← → : 이동</div>
                    <div>↓ : 빠른 낙하</div>
                    <div>↑ : 회전</div>
                    <div>스페이스 : 즉시 낙하</div>
                    <div>P : 일시정지</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* info panel moved to top */}
        </div>
      </div>
  {/* 하단 모바일/화면 조작 버튼 (보드 바로 아래, 고정 아님) */}
  <div className="mt-[2px] w-full flex justify-center gap-x-[10px] z-50">
        <button
          aria-label="left"
          className="control-btn bg-white bg-opacity-20 text-black px-4 py-2 rounded user-select-none touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => movePiece(-1, 0)}
        >
          ←
        </button>

        <button
          aria-label="right"
          className="control-btn bg-white bg-opacity-20 text-black px-4 py-2 rounded user-select-none touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => movePiece(1, 0)}
        >
          →
        </button>

        <button
          aria-label="hard-drop"
          className="control-btn bg-yellow-500 text-black px-4 py-2 rounded font-bold user-select-none touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => dropPiece()}
        >
          Drop
        </button>

        <button
          aria-label="down"
          className="control-btn bg-white bg-opacity-20 text-black px-4 py-2 rounded user-select-none touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => movePiece(0, 1)}
        >
          ↓
        </button>


        <button
          aria-label="rotate"
          className="control-btn bg-white bg-opacity-20 text-black px-4 py-2 rounded user-select-none touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => rotatePiece()}
          title="Rotate"
        >
          {/* Inline SVG for better cross-browser compatibility (Tesla browser friendly) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M21 12a9 9 0 10-2.6 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
        .control-btn {
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}
