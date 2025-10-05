이력서
- Web : https://tmgame.vercel.app/resume
- PDF : https://tmgame.vercel.app/pdf/SonTaemin_Resume.pdf

코드 샘플
- 1.tmgame 웹게임 (TypeScript | Node.js/Next.js/React) : 실행방법 https://tmgame.vercel.app/games/tetrix
- 2.언리얼 게임(C++) : 
- 3.유니티게임(C#) :
- 4.터미널 게임(C#) : 실행방벙 src폴더에서 dotnet run
## 파일 구조 및 역할
- `src/Program.cs` — 게임 엔트리와 주요 루프(`ConsoleShooter`). 렌더링, 업데이트, 적 생성 등 메인 로직이 포함됩니다.
- `src/PlayerController.cs` — 플레이어 입력(좌/우/스페이스)과 자동 발사 로직을 관리합니다. 발사 패턴과 연사 속도를 이쪽에서 조정할 수 있습니다.
- `src/GameState.cs` — 점수 관리를 담당합니다 (AddScore 등).
- `src/PlayerState.cs` — 플레이어의 목숨과 무적 상태(추후 확장)를 관리합니다.
- `src/GameMode.cs` — 게임 규칙/난이도 설정(스폰 간격, 적 속도 배수, 적 파괴 점수)을 캡슐화합니다. `GameMode.Easy()/Normal()/Hard()` 팩토리 제공.
- `src/README.md` — (없다면 이 파일을 참고하세요) 프로젝트 문서.
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
