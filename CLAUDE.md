@AGENTS.md

<!-- ORG:BEGIN — ai-commander 가 관리하는 구간(이 구간만 고쳐 씀) -->
## 조직도
작업 폴더가 속한 저장소의 루트에 ORG.md 가 있으면 작업을 시작하기 전에 읽어라(워크트리라면 본 저장소의 루트, 곧 `git rev-parse --git-common-dir` 의 상위 폴더). ORG.md 가 없으면 이 절은 지나가라.
환경 변수 COMMANDER_SESSION_NAME 이 네 세션 이름이다. ORG.md 에서 그 이름을 맡은 역할을 찾아 상위·하위 관계를 확인하고, 거기 적힌 네 역할 정의서 파일(ORG/roles/…)을 읽어 그 내용을 네 지침으로 삼아라.
대화가 길어져 역할이 불확실하거나 대화가 압축된 뒤에는 ORG.md 와 네 역할 정의서 파일을 다시 읽어라.
상위 역할은 하위 역할의 정의서 파일(ORG/roles/…)을 직접 고쳐도 된다. 자기 정의서는 직접 고치지 말고 `node /home/commander/ai-commander/tools/org.js request-doc-edit` 로 요청한다(사용자가 조직도 화면에서 승인해야 반영된다).
고쳤으면 해당 세션에 쪽지로 다시 읽으라고 알려라.
다른 세션에게 일을 맡기거나 연락할 때는 실행 중인 세션 목록이 아니라 `node /home/commander/ai-commander/tools/say.js list` 로 주소를 확인하고 `node /home/commander/ai-commander/tools/say.js <주소> "할 말"` 로 쪽지를 보낸다. 쉬고 있는 세션도 쪽지를 받는다.
주소가 없는 세션이면 사용자에게 주소를 만들어 달라고 요청한다.
역할이나 역할의 세션이 필요하면 `node /home/commander/ai-commander/tools/org.js help` 로 요청 방법을 보고 요청한다(자리를 지정할 수 있고 사용자 승인이 필요하다). 사용자가 조직도 화면에서 승인해야 만들어진다.
사용자에게 확인·결정을 받아야 하면 채팅으로 묻지 말고 `node /home/commander/ai-commander/tools/ask.js help` 로 확인 요청을 올린다. 사용자가 결재함에서 답하면 쪽지로 온다.
«[결재함 문의 #N]» 머리말이 붙은 메시지는 사용자가 그 요청에 대해 묻는 질문이다. 채팅으로 설명·답하고, 요청은 그대로 둔다(새 요청을 올리지 않는다).
사용자에게 파일을 주려면 채팅에 경로만 적지 말고 `node /home/commander/ai-commander/tools/files.js send <경로>` 로 파일함에 보낸다(자세한 사용법은 `help`).
<!-- ORG:END -->
