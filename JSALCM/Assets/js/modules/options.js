/*
 * options.js — 옵션 데이터 주입/조회 모듈 (주석 강화판)
 * ─────────────────────────────────────────────────────────────
 * 역할
 *  1) window.DND_OPTIONS 데이터를 읽어 <select> 옵션으로 주입
 *  2) 선택된 라벨 구하기, 클래스(code)로 클래스 찾기 등의 헬퍼 제공
 *  3) 스킬 마스터/코드 배열을 {value,label} 배열로 변환하는 헬퍼 제공
 *  4) 데이터 스크립트가 누락된 경우 ensureLoaded()로 자동 로드 시도
 *
 * 기대 데이터 구조(assets/js/options.ko.global.js):
 *  window.DND_OPTIONS = {
 *    skillsMaster: [ { code:'acrobatics', name:'곡예(민첩)' }, ...],
 *    classes: [ { code:'fighter', name:'파이터', featuresLvl1:[...], skills:{ choose:2, from:['athletics', ...] } }, ...],
 *    alignments: [...], species: [...], backgrounds: [...]
 *  }
 */
(function () {
  'use strict';

  /** 내부 유틸: 문자열/객체 형태를 value/label 쌍으로 표준화 */
  function normalizeItem(item) {
    if (item == null) return null;
    if (typeof item === 'string') return { value: item, label: item };
    if ('value' in item && 'label' in item) return { value: item.value, label: item.label };
    if ('code' in item && 'name' in item) return { value: item.code, label: item.name };
    return null;
  }

  /** <select>에 옵션들을 채워 넣습니다. (placeholder 유지) */
  function fillSelect(selectEl, items) {
    if (!selectEl) return;
    const first = selectEl.querySelector('option');
    selectEl.innerHTML = '';
    if (first) selectEl.appendChild(first);

    const frag = document.createDocumentFragment();
    for (const raw of items || []) {
      const it = normalizeItem(raw);
      if (!it) continue;
      const opt = document.createElement('option');
      opt.value = String(it.value);
      opt.textContent = String(it.label);
      frag.appendChild(opt);
    }
    selectEl.appendChild(frag);
  }

  /** 모든 셀렉트를 외부 데이터로 채웁니다. */
  function populateAll() {
    const d = window.DND_OPTIONS || {};
    fillSelect(DOM.clsEl, d.classes);
    fillSelect(DOM.speciesEl, d.species);
    fillSelect(DOM.backgroundEl, d.backgrounds);
    fillSelect(DOM.alignmentEl, d.alignments);
  }

  /** 현재 선택된 <select>의 보이는 라벨 텍스트를 가져옵니다. */
  function selectedLabel(selectEl) {
    return (selectEl?.selectedOptions?.[0]?.textContent || '').trim();
  }

  /** 클래스 code로 클래스 객체({code, name, featuresLvl1, skills})를 찾아 반환합니다. */
  function findClassByCode(code) {
    const arr = window.DND_OPTIONS?.classes || [];
    return arr.find((c) => c && typeof c === 'object' && c.code === code) || null;
  }

  /** 마스터 스킬 목록을 {value,label} 배열로 반환합니다. */
  function masterSkills() {
    const arr = window.DND_OPTIONS?.skillsMaster || [];
    return arr.map(normalizeItem).filter(Boolean);
  }

  /** 스킬 코드 배열을 {value,label} 배열로 변환합니다. */
  function skillsByCodes(codes) {
    if (!Array.isArray(codes)) return [];
    const master = window.DND_OPTIONS?.skillsMaster || [];
    const map = new Map(master.map((s) => [s.code, s.name]));
    return codes
      .map((code) => ({ value: code, label: map.get(code) || code }))
      .filter((x) => x.value);
  }

  /**
   * 클래스의 스킬 규칙을 정규화하여 반환합니다.
   * 반환: { choose: number, items: Array<{value,label}> }
   */
  function classSkillOptions(classCode) {
    const cls = findClassByCode(classCode);
    if (!cls || !cls.skills) return { choose: 0, items: [] };
    const choose = Number(cls.skills.choose) || 0;
    const items = skillsByCodes(cls.skills.from);
    return { choose, items };
  }

  /** 데이터 스크립트가 없을 때 자동 로드(필요 시) */
  function ensureLoaded(cb) {
    if (window.DND_OPTIONS) { cb?.(); return; }
    const s = document.createElement('script');
    s.src = 'assets/js/options.ko.global.js';
    s.async = false;                 // 로드 순서 보장
    s.onload = () => cb?.();         // 로드 후 콜백 실행
    s.onerror = () => console.warn('[Options] options.ko.global.js 로드 실패');
    document.head.appendChild(s);
  }

  // 전역 공개
  window.Options = {
    populateAll, selectedLabel, findClassByCode,
    ensureLoaded, fillSelect,
    masterSkills, skillsByCodes, classSkillOptions
  };
})();
