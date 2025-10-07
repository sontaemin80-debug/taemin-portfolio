"use client";
import Image from "next/image";

export default function PortfolioTitlePage() {
  return (
    <main className="flex min-h-screen justify-center bg-[#f2f2f7]">
      <div className="w-full sm:max-w-2xl px-2 sm:px-0 py-6 flex flex-col gap-6">
        {/* Header Section */}
        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5 flex flex-col items-center">
          <div className="text-[32px] font-bold text-[#2e3847] mb-2 leading-[38px]">손태민</div>
          <div className="text-[20px] font-semibold text-[#667deb] mb-2">Client Programmer</div>
          <div className="text-[#738096] text-center text-[15px] mb-4 leading-tight">
            언리얼엔진 유니티 컨텐츠 개발 프로그래머입니다.<br />
            사용자 경험을 최우선으로 생각하며, 최적화된 프레임워크 작성에 열정을 가지고 있습니다.
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Unreal</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">Unity</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">C#</span>
            <span className="bg-[#f7fafc] border border-[#e3e8f0] rounded-full px-4 py-1 text-[#4a5769] text-[14px] font-medium">C++</span>
          </div>
        </section>
        {/* Projects Section */}
        <section className="bg-white rounded-2xl shadow-lg px-4 pt-6 pb-5">
          <div className="text-[24px] font-bold text-[#2e3847] mb-4 leading-[30px] text-center">Featured Projects</div>
          <div className="flex flex-col gap-4">
            <div className="w-full max-w-xs sm:max-w-md aspect-[2.5/1] rounded-md overflow-hidden shadow-sm bg-[#eee] flex items-end justify-start mx-auto relative">
              <Image src="/biohazard_survival_unit.jpg" alt="Project 1" fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" style={{ minWidth: 0, minHeight: 0 }} />
            </div>
            <div className="w-full max-w-xs sm:max-w-md aspect-[2.5/1] rounded-md overflow-hidden shadow-sm bg-[#eee] flex items-end justify-start mx-auto relative">
              <Image src="/bless_mobile.jpg" alt="Project 2" fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" style={{ minWidth: 0, minHeight: 0 }} />
            </div>
            <div className="w-full max-w-xs sm:max-w-md aspect-[2.5/1] rounded-md overflow-hidden shadow-sm bg-[#eee] flex items-end justify-start mx-auto relative">
              <Image src="/ava.jpg" alt="Project 3" fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" style={{ minWidth: 0, minHeight: 0 }} />
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col gap-3">
            <a href="/resume" className="w-full h-12 rounded-full text-[#667deb] bg-white border-2 border-[#667deb] font-semibold text-[16px] transition-colors flex items-center justify-center no-underline">이력서</a>
            <a
              href="https://github.com/sontaemin80-debug/taemin-portfolio"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full text-white bg-[#667deb] font-semibold text-[16px] transition-colors flex items-center justify-center no-underline"
            >
              포트폴리오
            </a>
          </div>
          
          <div className="flex flex-col gap-3">
            <a
              href="/ai-video-portfolio"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full text-white bg-red-600 font-semibold text-[16px] transition-colors flex items-center justify-center no-underline"
            >
              AI 컨텐츠 포트폴리오
            </a>
          </div>
        </section>
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
