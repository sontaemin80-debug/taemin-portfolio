"use client";
import Image from "next/image";

export default function ResumePage() {
  return (
  <main className="min-h-screen py-4 px-2">
  <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-2xl relative">
        {/* 헤더 */}
  <div className="bg-[#1e3c72] text-white rounded-2xl p-8 text-center relative overflow-hidden mb-8">
          <div className="relative z-10">
            <h1 className="font-orbitron text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-white">손태민</h1>
            <p className="text-lg sm:text-xl font-light opacity-90 mb-6 tracking-widest">언리얼/유니티 프로그래머</p>
            <div className="grid grid-cols-1 place-content-center mt-4">
              <a href="mailto:sontaemin80@nate.com" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm w-auto max-w-fit mx-auto hover:underline">
                <span>📧</span>
                <span className="whitespace-nowrap">sontaemin80@nate.com</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 justify-items-center mt-2">
              <div className="flex items-center gap-2 bg-[#e3f0ff] px-4 py-2 rounded-xl border border-[#b6d4fe] backdrop-blur-sm mx-auto text-[#0f172a] print:text-[#0f172a]"><span>📱</span><span>010-9031-0976</span></div>
              <div className="flex items-center gap-2 bg-[#e3f0ff] px-4 py-2 rounded-xl border border-[#b6d4fe] backdrop-blur-sm mx-auto text-[#0f172a] print:text-[#0f172a]"><span>📍</span><span>경기 광주시 신현동</span></div>
         </div>
         

        {/* 핵심 통계 */}
  <section className="mb-10 mt-5">
          <h2 className="font-orbitron text-2xl font-bold text-[#1e3c72] mb-6 border-b-4 border-[#2a5298] pb-2 flex items-center gap-3">🎯 경력</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#667eea] text-white rounded-xl">
              <div className="text-3xl font-extrabold font-orbitron">22+</div>
              <div className="text-base opacity-90 mt-1">년 경력</div>
            </div>
            <div className="text-center p-4 bg-[#667eea] text-white rounded-xl">
              <div className="text-3xl font-extrabold font-orbitron">12+</div>
              <div className="text-base opacity-90 mt-1">언리얼 엔진</div>
            </div>
            <div className="text-center p-4 bg-[#667eea] text-white rounded-xl">
              <div className="text-3xl font-extrabold font-orbitron">5+</div>
              <div className="text-base opacity-90 mt-1">유니티 엔진</div>
            </div>
            <div className="text-center p-4 bg-[#667eea] text-white rounded-xl">
              <div className="text-3xl font-extrabold font-orbitron">6+</div>
              <div className="text-base opacity-90 mt-1">주요 프로젝트</div>
            </div>
          </div>
        </section>
        {/* 주요 참여 게임 프로젝트 */}
        <section className="mb-10">
          <h2 className="font-orbitron text-2xl font-bold text-[#1e3c72] mb-6 border-b-4 border-[#2a5298] pb-2 flex items-center gap-3">🎮 주요 참여 게임 프로젝트</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 각 게임 프로젝트 카드 예시 */}
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/biohazard_survival_unit.jpg" alt="바이오하자드 서바이벌 유닛" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">🎮 바이오하자드 서바이벌 유닛</div>
              <div className="text-base opacity-90">Unity6 캡콤 IP 활용 모바일 전략게임<br />영지 시스템, 건물, 스킨, 영웅</div>
            </div>
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/gunship_battle.jpg" alt="건쉽 배틀 토탈 워페어" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">⛴️ 건쉽 배틀: 토탈 워페어</div>
              <div className="text-base opacity-90">Unity2021 모바일 전략게임<br />영지 건물, 연합 컨텐츠, 이벤트</div>
            </div>
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/blessm.jpg" alt="Bless 모바일 MMORPG" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">⚔️ Bless 모바일 MMORPG</div>
              <div className="text-base opacity-90">언리얼엔진4 MMORPG<br />캐릭터 시스템, 네트워크 동기화, 던전</div>
            </div>
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/ludiel.jpg" alt="루디엘 액션 RPG" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">🗡️ 루디엘 (액션 RPG)</div>
              <div className="text-base opacity-90">모바일 액션 RPG<br />실시간 PVP, 길드전, 타운 시스템</div>
            </div>
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/ava.jpg" alt="아바 A.V.A FPS" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">🔫 아바 (A.V.A)</div>
              <div className="text-base opacity-90">언리얼엔진３ 온라인 FPS<br />UI 시스템, 게임 모드, AI</div>
            </div>
            <div className="bg-[#667eea] rounded-2xl p-6 text-white text-center shadow relative">
              <Image src="/images/resume/warrock.jpg" alt="워록 FPS" width={400} height={200} className="w-[400px] h-[180px] rounded-xl object-cover mb-4 mx-auto" />
              <div className="font-bold text-lg mb-2">🚁 워록(WarRock)</div>
              <div className="text-base opacity-90">진도엔진 온라인 FPS<br />게임모드, UI 시스템, 해외서비스</div>
            </div>
          </div>
        </section>
        {/* 경력사항 */}
        <section className="mb-10">
          <h2 className="font-orbitron text-2xl font-bold text-[#1e3c72] mb-6 border-b-4 border-[#2a5298] pb-2 flex items-center gap-3">💼 경력사항</h2>
          {/* 경력 카드들은 sontaemin-resume.html 참고하여 추가 구현 가능 */}
          <div className="space-y-6">
            {/* 예시: */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">조이시티 로제타본부 / 엔드림게임즈(붐잇게임즈)</div>
                  <div className="text-[#666] text-base">STRAT실 프로그램팀</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2021.09 ~ 재직중 (4년 2개월)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: Unity 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>엔드림게임즈 - 바이오하자드 서바이벌 유닛 클라이언트 컨텐츠 개발</li>
                  <li>영지 스테이지/건물 설정/건물 정보/건물 업그레이드 시스템 구현</li>
                  <li>스킨(프로필,건물,네임) / 헤드업 상태 표시, 오브젝트 셀렉트 링 메뉴 개발</li>
                  <li>영웅 시스템 (상세 정보/스토리 호감도 시스템/영지 출현) 구현</li>
                  <li>연합 마커, 개인 및 연합 컨텐츠, 이벤트 상점/페이지 개발</li>
                  <li>조이시티 - 건쉽 배틀 토탈 워페어 서버 및 클라이언트 컨텐츠 개발</li>
                </ul>
              </div>
            </div>
            {/* 씽크펀 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">씽크펀</div>
                  <div className="text-[#666] text-base">프로그램팀 차장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2017.04 ~ 2021.08 (4년 5개월)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 언리얼엔진4 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>Bless 모바일 MMORPG</li>
                  <li>플레이어/NPC 캐릭터 시스템, 위상 변이 시스템 구현</li>
                  <li>iFun Engine, Replication 네트워크 동기화 개발</li>
                  <li>소프트 레퍼런스 로딩 최적화, 캐릭터 풀/프리로드/비동기 로드 최적화</li>
                  <li>던전 매니저, 대규모 PVP 던전, 레이드, 심연의 던전 개발</li>
                  <li>인트로 튜토리얼, 전투, AI, UMG, Blueprint, Native 코드 등 MMORPG 전체 개발</li>
                </ul>
              </div>
            </div>
            {/* 레이드몹 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">레이드몹</div>
                  <div className="text-[#666] text-base">프로그램팀 과장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2016.04 ~ 2017.03 (1년)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: Unity 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>액션 RPG 게임 루디엘(모바일) 개발</li>
                  <li>컨텐츠 타운전, 길드전 시스템 구현</li>
                  <li>실시간 TCP PVP 컨텐츠 1vs1, 3vs3 PvE 개발</li>
                  <li>Unity5 Network을 이용한 DedicatedServer 실시간 PVP 개발</li>
                </ul>
              </div>
            </div>
            {/* JWNest */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">JWNest</div>
                  <div className="text-[#666] text-base">프로그램팀 팀장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2015.11 ~ 2016.04 (6개월)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 언리얼4 서버 겸 VR 게임 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>웹서버 C# ASP.Net/TCP C++ 서버 개발 (Unreal4)</li>
                  <li>AccessToken 중복 로그인 처리, 회원가입, 캐릭터 생성 등</li>
                  <li>구글/페이스북 로그인, 웹서버 TCP 서버 패킷 암호화</li>
                  <li>서버/클라이언트 통합 개발</li>
                </ul>
              </div>
            </div>
            {/* 가니타니 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">가니타니</div>
                  <div className="text-[#666] text-base">프로그램팀 과장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2014.11 ~ 2015.10 (1년)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 언리얼4 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>가니타니 벨라티아 - 언리얼 데브 그랜트 수상 게임</li>
                  <li>모바일 액션 RPG 개발 클라이언트 담당</li>
                  <li>로그인~캐릭터 생성, 메인 UI, 인벤토리, 퀘스트, 던전 UI</li>
                  <li>동료 AI, 몬스터 AI, 서버 클라이언트 연동 작업</li>
                </ul>
              </div>
            </div>
            {/* 레드덕 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">레드덕</div>
                  <div className="text-[#666] text-base">클라이언트팀 과장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2009.08 ~ 2014.07 (5년)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 언리얼3 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>PC 온라인 FPS 아바 클라이언트 개발</li>
                  <li>스케일폼 UI 미들웨어 언리얼엔진 적용</li>
                  <li>HUD, 결과창, 맵 선택, 랭킹 등 UI 작업</li>
                  <li>게임 모드 개발, 모드별 NPC AI 작업, 튜토리얼</li>
                  <li>서버 클라이언트 연동, 해외 서비스, 빌드 작업</li>
                </ul>
              </div>
            </div>
            {/* 예인스소프트 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">예인스소프트</div>
                  <div className="text-[#666] text-base">클라이언트팀 팀장</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2007.08 ~ 2009.07 (2년)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 언리얼2.5 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>PC 레이싱 액션 게임 개발</li>
                  <li>로그인, 로비, 캐릭터 생성/선택, 게임 HUD 등 모든 UI</li>
                  <li>게임 모드 개발, 액션/주행 시스템</li>
                  <li>서버 클라이언트 연동, 툴 개발</li>
                </ul>
              </div>
            </div>
            {/* 드림익스큐션 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">드림익스큐션</div>
                  <div className="text-[#666] text-base">클라이언트팀 대리</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2006.09 ~ 2007.08 (1년)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 진도 엔진 PC 온라인 FPS 워록 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>모든 UI, 게임 모드 개발</li>
                  <li>해외 서비스 대응</li>
                </ul>
              </div>
            </div>
            {/* 아라곤네트웍스 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">아라곤네트웍스</div>
                  <div className="text-[#666] text-base">클라이언트팀 대리</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2005.07 ~ 2006.09 (1년 3개월)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: 게임 브리오 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>PC MMORPG 피에스타 온라인/샤인 온라인 클라이언트</li>
                  <li>모든 UI, 인게임 컨텐츠</li>
                  <li>해외 서비스 대응</li>
                </ul>
              </div>
            </div>
            {/* 앗엔터테인먼트 */}
            <div className="bg-white border border-[#e9ecef] rounded-2xl p-6 shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <div>
                  <div className="font-bold text-lg text-[#1e3c72]">앗엔터테인먼트</div>
                  <div className="text-[#666] text-base">프로그램팀</div>
                </div>
                <div className="bg-[#ff6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow">2002.06 ~ 2004.06 (2년 1개월)</div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-[#1e3c72] mb-1">담당업무: AuranJet 3D 클라이언트 프로그래머</div>
                <ul className="list-disc pl-5 text-[#333] text-sm space-y-1">
                  <li>MMF 2D 게임 개발, ASP 웹서버 개발</li>
                  <li>MMORPG 클라이언트 개발</li>
                  <li>2D 게임 부루마블 개발</li>
                </ul>
              </div>
            </div>
            {/* ...다른 경력 카드들도 위와 같은 형식으로 추가 가능... */}
            
          </div>
        </section>
        {/* 자기소개서 */}
        <section className="mb-10">
          <h2 className="font-orbitron text-2xl font-bold text-[#1e3c72] mb-6 border-b-4 border-[#2a5298] pb-2 flex items-center gap-3">💬 자기소개서</h2>
          <div className="bg-[#f8f9fa] p-6 rounded-2xl border-l-4 border-[#2a5298] text-base leading-relaxed">
            <p className="mb-4 font-semibold text-[#1e3c72]">언리얼/유니티 게임 엔진을 사용하여 실무에서 완성도 높은 대규모 온라인 게임(PC/모바일) 개발에 참여하였습니다.<br />장르별로는 MMORPG, FPS, 전쟁 게임, 액션 RPG, 레이싱, 퍼즐 게임 등 다양한 개발 경험이 풍부합니다.</p>
            <p className="mb-4">실무에서 <span className="font-bold text-[#1e3c72]">언리얼 엔진 12년, 유니티 엔진 5년 이상</span> 프로젝트 진행에 중요한 프레임워크/최적화/네트워크/멀티플랫폼 게임 개발 경험을 보유하고 있습니다.<br />컨텐츠개발및 문제 해결을 위한자료 수집및 시행착오 경험이 풍부하여 팀 프로젝트에 큰 도움이 되고 있습니다.</p>
            <p className="mb-4">컨텐츠 개발에 <span className="font-bold text-[#1e3c72]">C++/C# 외에도 블루프린트/비주얼 스크립트</span>도 적극 활용하고 있습니다. 이는 비프로그래머 개발자의 역량을 끌어올릴 수 있는 좋은 도구이며, 실무에 적용하면 기획자/레벨 디자이너도 더 좋은 성과를 낼 수 있었습니다.</p>
            <p className="mb-4"><span className="font-bold text-[#1e3c72]">AI를 잘 활용 할줄아는 인재로 성장하고있습니다.</span><br />활용능력에 따라 비전문가도 준전문가 수준의 컨텐츠와 코드 작성할 수 있도록 도와줍니다.<br />VS Code와 Copilot Agnet 활용하여 코딩 생산성을 높이고 있습니다.<br />Node.js로 웹/앱 풀스택개발 MCP활용(Supabase 회원인증관리/피그마 UI디자인) Vercel배포 개발속도면에서 정말 빠르고 편리합니다.<br />구글AI스튜디오로 컨텐츠 그래픽/동영상/TTS, 향상된 프롬프트로 고퀄리티 컨텐츠 제작하려고 노력하고있습니다.<br />AI모델선택에 따라 결과물에 차이를 알고사용해야 원하는 결과물을 쉽게 얻을수있습니다.</p>
            <p className="mb-0 font-semibold text-[#1e3c72]">클라이언트 초기 개발부터 상용화, 해외 서비스 문제 해결까지 전 과정의 경험을 보유한 프로그래머입니다.</p>
          </div>
        </section>
        {/* 보유 역량 및 기술 */}
        <section className="mb-10">
          <h2 className="font-orbitron text-2xl font-bold text-[#1e3c72] mb-6 border-b-4 border-[#2a5298] pb-2 flex items-center gap-3">🛠️ 보유 역량 및 기술</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#f8f9fa] p-6 rounded-2xl border-t-4 border-[#2a5298]">
              <div className="font-bold text-[#1e3c72] mb-2">프로그래밍 언어</div>
              <div className="text-[#666]">C++, C#, ASP.Net Core, ASP, ASPX, JavaScript, PHP, TypeScript</div>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-2xl border-t-4 border-[#2a5298]">
              <div className="font-bold text-[#1e3c72] mb-2">게임 엔진</div>
              <div className="text-[#666]">Unreal, Unity</div>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-2xl border-t-4 border-[#2a5298]">
              <div className="font-bold text-[#1e3c72] mb-2">네트워크</div>
              <div className="text-[#666]">ProtoBuf, FlatBuffer,TCP, UDP, REST API, iFunEngine</div>
            </div>
            <div className="bg-[#f8f9fa] p-6 rounded-2xl border-t-4 border-[#2a5298]">
              <div className="font-bold text-[#1e3c72] mb-2">툴</div>
              <div className="text-[#666]">Visual Studio, VS Code, MSSQL, Jenkins, Perforce, SVN, SSMS, pgAdmin4, Supabase, Postman, Node.js, Next.js, React</div>
            </div>
          </div>
        </section>
      </div>
      
    </main>
  );
}
