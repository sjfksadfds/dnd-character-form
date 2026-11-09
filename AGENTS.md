

# 「던전&드래곤 도우미」 프로젝트 지침서

이 저장소에서 일하는 모든 AI 에이전트(Claude, DeepSeek 등)가 따르는 지침이다. 위의 ORG 구간은 앱이 관리하므로 고치지 말고, 이 아래만 고친다.
`~/.claude/CLAUDE.md`(공통 규칙)와 `ORG.md`·역할 정의서가 함께 적용되고, 충돌하면 이 순서로 우선한다:
대표님의 그때그때 지시 > 역할 정의서 > 이 파일 > 공통 규칙.

> 현재 상태(2026-10-24): 인수 준비 단계. 앱 코드는 아직 이 컴퓨터에 없다.
> 인수 자료: `docs/handover/HANDOVER.md`(전체 인수인계), `docs/handover/TODO.md`(할 일 정리).
> 코드를 받으면 원래 프로젝트의 `AGENTS.md`·`CLAUDE.md`·`README.md` 를 읽고 이 지침과 합친다.

## 1. 프로젝트

- 이름: 사용자에게 보이는 이름 「던전&드래곤 도우미」(`src/domain/app-name.ts`), 내부 코드명 「모험 개설」(moheom-gaeseol).
- 무엇: D&D 2024(PHB 2024) 규칙으로 캐릭터를 만들고 세션을 진행하는 한국어 웹앱. 폰 우선, PC·태블릿 대응.
- 누구: 대표님(소유자)과 팀원(플레이어·던전마스터). **가정용·지인용, 판매하지 않음.**
- 스택: Next.js 16 (App Router, standalone) · React 19 · TypeScript 5 · Tailwind CSS 4 · Node 내장 SQLite · web-push(VAPID) · Brevo 메일 · Fly.io(nrt).
- 이 저장소의 `JSALCM/` 은 이전의 작은 순수 JS 앱(「D&D 캐릭터 입력」)이다. 위 앱과 별개다.

## 2. 호칭·말투·보고

- 소유자는 **대표님**이라 부른다. 모든 답변·커밋 메시지·이슈 코멘트는 한국어.
- 보고는 결론부터 짧게(200자 안팎): 한 일 · 결과 · 실패 이유, 결정이 필요하면 그것만.
- 화면이 바뀌는 작업의 완료 보고에는 TEST 화면 스크린샷 4장(폰 412px / PC 1280px × 라이트·다크)을 붙인다.
  파일은 AI 지휘소 앱의 파일함 도구 `tools/files.js send <경로>` 로 파일함에 보낸다(채팅에 경로만 적지 않는다).
- 대표님은 폰 스크린샷에 빨간 표시로 요청을 보낸다. 표시된 부분과 그 주변 화면을 함께 확인한다.
- 확인·결정이 필요하면 채팅으로 묻지 말고 `tools/ask.js` 로 올린다.

## 3. 코드 지도 (받은 뒤 실제와 맞춰 고칠 것)

| 경로 | 내용 |
|---|---|
| `src/app/` | 라우트와 `api/*` |
| `src/domain/` | 순수 규칙 로직 + `*.test.ts` (rules, spells, spell-slots, rest, level-up, economy, haggle …) |
| `src/server/` | DB 접근·HTTP 처리. `db.ts` 가 스키마·마이그레이션 |
| `src/features/` | 화면 컴포넌트 |
| `src/data/` | 클라이언트 저장·규칙 데이터(`rules/` 원문, `generated/` 생성 TS) |
| `scripts/` | 규칙 데이터 생성 스크립트(gen-rules.ts 등) |
| 루트 | Dockerfile, fly.toml(TEST), fly.prod.toml(PROD), verify-*.mjs |

- 규칙 로직은 `src/domain/` 에 순수 함수로 두고 테스트를 붙인다. 화면·서버에 규칙 계산을 흩지 않는다.
- `src/data/rules/generated/*` 는 생성물이다. 손으로 고치지 말고 원문·스크립트를 고친 뒤 다시 생성한다.
- 규칙은 **2024 규칙**이 기준이다. 2014 규칙이 남아 있으면 버그로 본다.

## 4. 개발·테스트

```bash
npm ci
npm run dev        # http://localhost:47231
npm test           # 전체 테스트(직렬). 변경 후 반드시 전체 통과
npm run build
```

- 이 컴퓨터는 기본 `node` 가 v22 다(인수 문서의 `$HOME/node22` PATH 설정 불필요).
- 새 테스트 파일은 `package.json` 의 `test` 스크립트 목록에 직접 추가해야 실행된다.
- 간헐 실패 테스트(P-216 상점 이름)는 «원래 그렇다» 고 넘기지 말고 기록한다.
- 코드 수정은 공통 규칙대로 먼저 Aider 에게 맡기고 `git diff`·테스트로 검토한다(5줄 안쪽 수정·원인 조사·큰 구조 변경·비밀값 관련은 직접).

## 5. DB 원칙

- 마이그레이션은 **열·표 추가만** 한다. 기존 행 삭제·열 삭제 금지. 1회성 처리는 `schema_flags` 로.
- 로컬 DB(`data/moheom.sqlite`)·업로드 파일은 커밋하지 않는다.
- TEST·PROD 의 데이터를 지우거나 고치는 일(잔여 테스트 데이터 정리 포함)은 대표님 승인 뒤에만.

## 6. 배포

| | TEST | PROD |
|---|---|---|
| URL | https://moheom-gaeseol.fly.dev | https://moheom-app.fly.dev |
| 명령 | `flyctl deploy -c fly.toml -a moheom-gaeseol --ha=false` | `flyctl deploy -c fly.prod.toml -a moheom-app --ha=false` |

- 순서: `npm test` 통과 → 빌드 확인 → **TEST 배포** → TEST 화면 확인·스크린샷 → (지시가 있으면) PROD.
- **PROD 는 대표님이 명시적으로 지시할 때만.** 그 전에 반드시:
  1. 볼륨 스냅샷(`flyctl volumes snapshots create <vol-id>`)
  2. `VACUUM INTO` 백업을 받아 로컬 백업 폴더에 보관(위치는 인수 때 정함)
  3. 배포 전·후 테이블별 행 수 비교
- 항상 `--ha=false`, **머신 1대**(SQLite 는 머신끼리 공유 불가), auto-stop off, min 1.

## 7. 비밀값

- 시크릿은 **이름만** 말한다: `APP_BASE_URL`, `BREVO_API_KEY`, `MAIL_FROM`, `MAIL_FROM_NAME`(시크릿 여부 미확인), `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
- 값은 출력·기록·커밋하지 않는다. 필요한 값(예: Fly 토큰)은 `tools/secrets.js request` 로 받고 경로로만 쓴다.
- 앱 메일 발신에 **대표님 개인 Gmail 을 쓰지 않는다.**

## 8. 저장소·동기화

- Origin: `https://origin.cursor.com/git/doksup/tmp-cacf539ba3d89199.git` `main` (인수 시점 TEST v181 과 같다고 기록됨).
- tarball 로 옮길 때는 `--exclude=./data` (루트 DB 폴더만). **`--exclude=data` 금지** — `src/data` 까지 빠진다.
  그 밖에 `./node_modules`, `./.next`, `'*.db'`, `'./.env*'`, `./uploads` 를 뺀다.
- 커밋은 검토 뒤 직접 한다. `.aider*` 는 커밋하지 않는다.

## 9. 작업 기록 (Linear)

- 팀 **던전크롤러**, 프로젝트 **「모험 개설」**, 이슈 키 예: P-234.
- 작업이 합의되면 바로 이슈를 **In Progress** 로 만든다. **Done 은 TEST 배포 후 화면 확인을 마친 뒤에만.**
- 완료 코멘트(한국어): 바뀐 내용, TEST 버전, 스크린샷.
- 이 컴퓨터에 Linear 연결이 없는 동안은 `docs/handover/TODO.md` 등에 같은 내용을 남긴다(방식은 대표님 결정 대기).

## 10. 디자인 (Penpot)

- 파일 「Dnd  앱 개발」(공백 2칸), 페이지 「주요 화면 (v180)」: 7개 화면의 폰·PC 판.
- Penpot MCP 는 한 번에 열린 파일 하나에만 붙고 다른 봇과 같이 쓴다. 쓰기 전에 다른 봇이 쓰는지 확인하고, 끝나면 연결을 끊는다.

## 11. 저작권

- PHB 2024 의역 내용이 들어 있어 **판매·공개 배포 금지** 상태다. 판매를 검토하면 상표(WotC) 이름 변경, SRD 5.2 CC-BY-4.0 출처 표기, SRD 밖 내용 제거가 필요하다.
