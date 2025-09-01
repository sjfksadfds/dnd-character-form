/*
 * classSkills.js — 클래스별 스킬 선택 UI 모듈
 * ─────────────────────────────────────────────────────────────
 * 역할
 *  1) 선택된 클래스의 규칙(choose/from)에 맞춰 스킬 콤보박스를 N개 생성
 *  2) 콤보박스들 사이에서 같은 스킬을 중복 선택하지 못하도록 관리
 *  3) 외부에 getSelectedSkills(), onChange() 제공 → 미리보기와 연동
 *
 * 의존성
 *  - window.DOM      : UI 컨테이너 참조 (class-skills*)
 *  - window.Options  : classSkillOptions(), fillSelect() 등
 */
(function () {
  'use strict';

  // 내부 상태: 현재 렌더된 스킬 셀렉트 DOM들을 저장
  let selects = [];
  // 외부에서 등록하는 변경 콜백들
  const listeners = new Set();

  /** 현재 선택된 스킬들을 {value,label} 배열로 반환 */
  function getSelectedSkills() {
    return selects
      .map(sel => {
        const opt = sel?.selectedOptions?.[0];
        if (!opt || !opt.value) return null;
        return { value: opt.value, label: (opt.textContent || '').trim() };
      })
      .filter(Boolean);
  }

  /** 외부에서 변경 콜백을 등록 */
  function onChange(fn) { if (typeof fn === 'function') listeners.add(fn); return () => listeners.delete(fn); }
  function fireChange() { listeners.forEach(fn => fn(getSelectedSkills())); }

  /** 다른 셀렉트에서 이미 선택된 값들은 현재 셀렉트에서 disabled 처리하여 중복 방지 */
  function enforceUnique() {
    const chosen = new Set(selects.map(s => s.value).filter(v => !!v));
    selects.forEach(sel => {
      // 현재 셀렉트의 선택값은 유지해야 하므로, 자신의 값은 제외하고 비활성화 판단
      const selfValue = sel.value;
      Array.from(sel.options).forEach(opt => {
        if (!opt.value) return; // placeholder
        opt.disabled = chosen.has(opt.value) && opt.value !== selfValue;
      });
    });
  }

  /** 콤보박스 하나를 만들어 주입 (placeholder+옵션 채우기) */
  function createSkillSelect(index, items) {
    const select = document.createElement('select');
    select.className = 'skill-select';
    select.setAttribute('aria-label', `스킬 선택 ${index + 1}`);

    // placeholder를 먼저 넣고, Options.fillSelect로 항목 주입
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = `— 스킬 선택 #${index + 1} —`;
    select.appendChild(ph);
    Options.fillSelect(select, items);

    // 이벤트: 값이 바뀌면 중복 비활성화 갱신 + 변경 알림
    select.addEventListener('change', () => { enforceUnique(); fireChange(); });
    select.addEventListener('input',  () => { enforceUnique(); fireChange(); });

    return select;
  }

  /**
   * 선택된 클래스 코드에 맞춰 스킬 UI를 렌더
   * - 규칙이 없거나 choose=0이면 UI를 숨깁니다.
   * - 규칙이 있으면 N개의 콤보박스를 만들고 중복 방지를 활성화합니다.
   */
  function renderForClass(classCode) {
    const { choose, items } = Options.classSkillOptions(classCode);
    // 컨테이너 비우기
    DOM.classSkillsList.innerHTML = '';
    selects = [];

    if (!choose || !items || items.length === 0) {
      DOM.classSkillsWrap.hidden = true;
      fireChange(); // 선택 0개로 알림
      return;
    }

    // 라벨/힌트 업데이트
    DOM.classSkillsLabel.textContent = `클래스 스킬 선택 (총 ${choose}개)`;
    DOM.classSkillsHint.textContent = `현재 클래스 규칙: ${choose}개 선택 가능`;

    // N개 콤보박스를 만들어 추가
    for (let i = 0; i < choose; i++) {
      const sel = createSkillSelect(i, items);
      DOM.classSkillsList.appendChild(sel);
      selects.push(sel);
    }

    DOM.classSkillsWrap.hidden = false;
    enforceUnique();
    fireChange(); // 초기 상태 알림
  }

  /** 현재 UI를 초기화(값 비우기) */
  function reset() {
    selects.forEach(s => { s.value = ''; });
    enforceUnique();
    fireChange();
  }

  // 전역 공개
  window.ClassSkills = { renderForClass, reset, getSelectedSkills, onChange };
})();
