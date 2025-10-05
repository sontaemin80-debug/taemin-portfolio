
# 콘솔 슈팅 게임 (포트폴리오 샘플)

간단한 콘솔 기반 탑다운 슈팅 게임입니다. 이 문서는 프로젝트 구조, 실행 방법, 주요 클래스(확장 포인트 포함)를 정리합니다.

## 빠른 실행
Windows에서 PowerShell을 열고 프로젝트의 `src` 폴더로 이동한 뒤 빌드·실행하세요:

```powershell
Set-Location -Path "\src"
dotnet build
dotnet run
```

참고: 콘솔 창이 충분히 크지 않으면(세로 약 30줄 이상 권장) 화면 출력이나 위치 계산에서 오류가 날 수 있습니다.

## 플레이 방법
- 이동: ← / → 또는 A / D (키를 누르고 있으면 연속 이동)
- 발사: Space (스페이스를 누르고 있으면 자동 연사, 한 번에 여러 미사일 발사)
- 종료: Esc

HUD에 점수(Score)와 남은 목숨(Lives)이 표시됩니다.

## 파일 구조 및 역할
- `src/Program.cs` — 게임 엔트리와 주요 루프(`ConsoleShooter`). 렌더링, 업데이트, 적 생성 등 메인 로직이 포함됩니다.
- `src/PlayerController.cs` — 플레이어 입력(좌/우/스페이스)과 자동 발사 로직을 관리합니다. 발사 패턴과 연사 속도를 이쪽에서 조정할 수 있습니다.
- `src/GameState.cs` — 점수 관리를 담당합니다 (AddScore 등).
- `src/PlayerState.cs` — 플레이어의 목숨과 무적 상태(추후 확장)를 관리합니다.
- `src/GameMode.cs` — 게임 규칙/난이도 설정(스폰 간격, 적 속도 배수, 적 파괴 점수)을 캡슐화합니다. `GameMode.Easy()/Normal()/Hard()` 팩토리 제공.
- `src/README.md` — (없다면 이 파일을 참고하세요) 프로젝트 문서.

추가적으로 `src` 내부에 `bin/` `obj/` 등 빌드 산출물이 생성됩니다(이미 `.gitignore`로 무시됨).

## 주요 클래스(간단 설명)
- ConsoleShooter
   - 게임 루프(입력, 업데이트, 렌더)를 수행합니다.
   - `mode`를 통해 스폰 간격·적 속도·점수를 읽어 동작합니다.

- PlayerController
   - 물리적 키 상태(Windows의 `GetAsyncKeyState`)를 사용해 좌/우 연속 이동을 처리합니다.
   - 스페이스를 누르고 있으면 자동으로 미사일을 발사하도록 `TryAutoFire`를 제공.

- GameState
   - 점수를 중앙에서 관리합니다. 파일로 저장하거나 하이스코어를 연결하기 쉬운 구조입니다.

- PlayerState
   - 플레이어의 목숨(Lives)과 무적 상태를 관리합니다.

- GameMode
   - 난이도별 파라메터(SpawnIntervalMs, EnemySpeedMultiplier, ScorePerEnemy)를 제공합니다.

## 커스터마이징 포인트
- 난이도 변경: `GameMode.Normal()` 대신 `GameMode.Easy()` 또는 `GameMode.Hard()`로 교체하거나 새 모드를 추가하세요.
- 미사일/발사 패턴: `PlayerController.TryAutoFire` 내부의 `MissilesPerShot`, `MissileSpeed`, `MissileGlyph`를 조정하세요.
- 적 속도/스폰: `GameMode` 설정 또는 `ConsoleShooter.enemySpeed` 곱셈값을 변경하세요.

## 빌드·테스트
- .NET SDK(버전 9 이상 권장)가 필요합니다. 설치: https://dotnet.microsoft.com/download
- 빌드: `dotnet build`
- 실행: `dotnet run` (프로젝트 `src` 폴더에서 실행)

## 향후 개선 아이디어
- 적 유형 추가(고속/방어/보스) 및 점수 보상 다양화
- 아이템(목숨 회복, 무적 시간) 추가
- 게임 레코드(로컬 하이스코어 파일) 저장
- 유닛 테스트로 핵심 로직(충돌 판정, 점수 계산) 보장

---

문서나 예시를 더 추가하고 싶으시면 어떤 정보를 우선으로 넣을지 알려 주세요 (예: 클래스 다이어그램, 코드 예제, 실행 스크린샷 등). 

