"use client";
import React, { useState, useEffect } from "react";

type VideoItem = {
  id: string;
  title: string;
  src: string;
  poster?: string;
  duration?: string;
  description?: string;
  aiNotes?: string;
};

const SAMPLE_VIDEOS: VideoItem[] = [
  // (removed two placeholder sample videos)
  {
    id: "yt-kcy",
    title: "동물 먹빵영상.",
    src: "https://www.youtube.com/watch?v=KCyE7Xzt25g&list=PLMmx0Omn9mY6WptqdaHPxgQd2gJ4EsbVY",
    poster: "https://img.youtube.com/vi/KCyE7Xzt25g/hqdefault.jpg",
    duration: "",
    description: "Google Flow로 Veo3동영상 제작.",
    aiNotes: "Hosted on YouTube; 임베드 플레이어로 재생됩니다.",
  },
  {
    id: "yt-shorts-1",
    title: "여성보컬 Avata",
    src: "https://www.youtube.com/shorts/CxLkAq-vfFw",
    poster: "https://img.youtube.com/vi/CxLkAq-vfFw/hqdefault.jpg",
    duration: "",
    description: "아보카도 AI로 만든 여성가수. Suno AI 로만든 노래, Hedra AI로 립싱크 제작.",
    aiNotes: "Shorts 링크는 임베드로 재생됩니다.",
  },
  {
    id: "yt-hvpg",
    title: "TTS 오디오북",
    src: "https://www.youtube.com/watch?v=HVPGNAe08k0&t=8s",
    poster: "https://img.youtube.com/vi/HVPGNAe08k0/hqdefault.jpg",
    duration: "",
    description: "Gemini 2.5 Pro TTS 로 두명의 성우로 상황에 따른 감정연출 제작 ",
    aiNotes: "임베드로 재생됩니다.",
  },
];

const CHANNEL_THUMBNAILS: Record<string, string> = {
  // map known channel URLs to a representative thumbnail (falls back to generic icon)
  'https://www.youtube.com/@%EA%BF%80%EC%9E%A0%ED%9C%B4%EA%B2%8C%EC%86%8C': 'https://img.youtube.com/vi/KCyE7Xzt25g/hqdefault.jpg',
  'https://www.youtube.com/@%EB%83%A0%EB%83%A0%EC%BF%A1%EC%BF%A1': 'https://img.youtube.com/vi/CxLkAq-vfFw/hqdefault.jpg',
  'https://www.youtube.com/@KPopDev': 'https://img.youtube.com/vi/HVPGNAe08k0/hqdefault.jpg',
};

function getChannelThumb(url: string) {
  return CHANNEL_THUMBNAILS[url] || '/file.svg';
}

function YouTubeThumbnail({ url, poster, alt }: { url: string; poster?: string; alt?: string }) {
  const [src, setSrc] = useState(poster || "");

  useEffect(() => {
    if (poster) {
      setSrc(poster);
      return;
    }

    let cancelled = false;

    const idFromUrl = (() => {
      try {
        const u = new URL(url);
        const v = u.searchParams.get("v");
        if (v) return v;
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "shorts" && parts[1]) return parts[1];
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        return null;
      } catch {
        return null;
      }
    })();

    if (!idFromUrl) return;

    const candidates = [
      `https://img.youtube.com/vi/${idFromUrl}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${idFromUrl}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${idFromUrl}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${idFromUrl}/default.jpg`,
    ];

    (async () => {
      for (const c of candidates) {
        if (cancelled) return;
        const ok = await new Promise<boolean>((res) => {
          const img = new Image();
          img.onload = () => res(true);
          img.onerror = () => res(false);
          img.src = c;
        });
        if (ok && !cancelled) {
          setSrc(c);
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, poster]);

  return <img src={src || poster || '/file.svg'} alt={alt || 'thumbnail'} className="w-full h-full object-cover" />;
}

export default function AiVideoPortfolioPage() {
  const [active, setActive] = useState<VideoItem | null>(null);

  function openVideo(v: VideoItem) {
    setActive(v);
    // prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
  }

  function closeVideo() {
    setActive(null);
    document.body.style.overflow = "";
  }

  function toYouTubeEmbed(url: string) {
    try {
      const u = new URL(url);
      const v = u.searchParams.get('v');
      // handle /shorts/{id}
      const pathParts = u.pathname.split('/').filter(Boolean);
      let shortId: string | null = null;
      if (pathParts[0] === 'shorts' && pathParts[1]) shortId = pathParts[1];
      const list = u.searchParams.get('list');
      let id = v;
      if (!id && shortId) id = shortId;
      if (!id) {
        // handle youtu.be short links
        if (u.hostname.includes('youtu.be')) {
          id = u.pathname.slice(1);
        }
      }
      if (!id) return url;
      let embed = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      if (list) embed += `&list=${encodeURIComponent(list)}`;
      return embed;
    } catch (e) {
      return url;
    }
  }

  async function copyLink(v: VideoItem) {
    try {
      await navigator.clipboard.writeText(window.location.href + `#${v.id}`);
      alert("링크가 클립보드에 복사되었습니다.");
    } catch (e) {
      alert("복사에 실패했습니다. 브라우저가 복사 API를 지원하지 않을 수 있습니다.");
    }
  }

  return (
    <main className="flex min-h-screen justify-center bg-[#f2f2f7]">
      <div className="w-full sm:max-w-2xl px-2 sm:px-0 py-6 flex flex-col gap-6">
                {/* Header Section */}
        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5 flex flex-col items-center">
          <div className="text-[32px] font-bold text-[#2e3847] mb-2 leading-[38px]">손태민</div>
          <div className="text-[20px] font-semibold text-[#667deb] mb-2">Client Programmer</div>
          <div className="text-[#738096] text-center text-[15px] mb-4 leading-tight">
            언리얼엔진 유니티 컨텐츠 개발 프로그래머입니다.<br />
            다양한 툴을 활용한 AI 컨텐츠 개발에도 열정을 가지고있습니다.
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">SunoAI</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Google AI Sudio</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Hedra</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Capcut</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Vrew</span>
          </div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5 flex flex-col items-center">
          <div className="text-[28px] font-bold text-[#2e3847] mb-1 leading-[34px]">포트폴리오</div>
          <div className="text-[15px] text-[#667deb] mb-2">유튜브 개설하여 제작한 리소스에대한 유저 반응을 확인.</div>
          <div className="text-[#738096] text-center text-[14px] mb-4 leading-tight">AI를 활용한 리소스(Avatar, Image, Video, TTS, Sound)</div>

          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href="https://www.youtube.com/@%EB%83%A0%EB%83%A0%EC%BF%A1%EC%BF%A1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-600 text-white font-semibold text-[14px] no-underline"
            >
              <span className="text-lg">🎬</span>
              1.냠냠쿡쿡
            </a>
            <a
              href="https://www.youtube.com/@KPopDev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-600 text-white font-semibold text-[14px] no-underline"
            >
              <span className="text-lg">🎬</span>
              2.KPopDev
            </a>
            <a
              href="https://www.youtube.com/@%EA%BF%80%EC%9E%A0%ED%9C%B4%EA%B2%8C%EC%86%8C"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-600 text-white font-semibold text-[14px] no-underline"
            >
              <span className="text-lg">🎬</span>
              3.꿀잠 휴게소
            </a>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5">
          <div className="text-[20px] font-bold text-[#2e3847] mb-4 leading-[26px] text-center">AI툴을 이용한 컨텐츠 개발</div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_VIDEOS.map((v) => (
              <article key={v.id} className="bg-white rounded-xl shadow p-3">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-1/2">
                    <button
                      onClick={() => openVideo(v)}
                      className="w-full h-44 sm:h-56 md:h-48 rounded-md overflow-hidden block"
                      aria-label={`Play ${v.title}`}
                    >
                      <YouTubeThumbnail url={v.src} poster={v.poster} alt={v.title} />
                    </button>
                  </div>

                  <div className="w-full sm:w-1/2 flex flex-col">
                    <h3 className="text-lg font-semibold text-[#223041]">{v.title}</h3>
                    <p className="text-sm text-[#566474] mt-2 flex-1">{v.description}</p>

                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-60" onClick={closeVideo} />
            <div className="relative z-10 w-full max-w-3xl mx-auto">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative bg-black">
                  {/(youtube\.com|youtu\.be)/i.test(active.src) ? (
                    <iframe
                      src={toYouTubeEmbed(active.src)}
                      title={active.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[56vw] max-h-[70vh]"
                      style={{ aspectRatio: '16/9' }}
                    />
                  ) : (
                    <video
                      src={active.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-auto max-h-[70vh] bg-black"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Contact Section */}
        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5 text-center">
          <div className="text-[20px] font-bold text-[#2e3847] mb-3 text-center">Contact</div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 text-[#4a5769] text-[15px] font-medium">
            <a href="mailto:sontaemin80@nate.com" className="flex items-center gap-1 hover:underline text-[#4a5769]">
              <span className="text-lg">📧</span>
              <span>sontaemin80@nate.com</span>
            </a>
            <a
              href="https://github.com/sontaemin80-debug/taemin-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline text-[#4a5769]"
            >
              <span className="text-lg">💻</span>GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/taemin-son-988125389/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline text-[#4a5769]"
            >
              <span className="text-lg">💼</span>LinkedIn
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
