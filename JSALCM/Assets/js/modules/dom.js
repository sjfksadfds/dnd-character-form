/* dom.js — DOM 참조/헬퍼 모듈 (스킬 UI 참조 추가) */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  const refs = {
    // Form & fields
    form: $('char-form'),
    nameEl: $('name'),
    clsEl: $('cls'),
    speciesEl: $('species'),
    backgroundEl: $('background'),
    alignmentEl: $('alignment'),
    btnReset: $('btnReset'),

    // ▼ 클래스 스킬 UI
    classSkillsWrap: $('class-skills'),
    classSkillsLabel: $('class-skills-label'),
    classSkillsList: $('class-skills-list'),
    classSkillsHint: $('class-skills-hint'),

    // Preview
    pv: $('preview'),
    pvName: $('pv-name'),
    pvClass: $('pv-class'),
    pvSpecies: $('pv-species'),
    pvBackground: $('pv-background'),
    pvAlignment: $('pv-alignment'),
    pvFeatWrap: $('pv-features-wrap'),
    pvFeatList: $('pv-class-features'),

    // ▼ 미리보기: 선택 스킬 칩
    pvSkillsWrap: $('pv-skills-wrap'),
    pvSkills: $('pv-skills'),
  };

  function getData() {
    return {
      name: refs.nameEl?.value?.trim() || '',
      classCode: refs.clsEl?.value?.trim() || '',
      species: refs.speciesEl?.value?.trim() || '',
      background: refs.backgroundEl?.value?.trim() || '',
      alignment: refs.alignmentEl?.value?.trim() || '',
    };
  }

  window.DOM = { ...refs, getData };
})();
