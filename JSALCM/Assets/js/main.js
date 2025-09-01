/*
 * main.js — 엔트리 포인트 (스킬 UI 연동 추가)
 */
(function () {
  'use strict';

  function firstPaint() {
    Options.populateAll();
    Theme.init();
    Preview.update();
    Preview.renderClassFeatures();
    // 초기 클래스 기준 스킬 UI 렌더
    ClassSkills.renderForClass(DOM.clsEl?.value || '');
    Preview.renderSelectedSkills();
  }

  function bindEvents() {
    const fields = [DOM.nameEl, DOM.clsEl, DOM.speciesEl, DOM.backgroundEl, DOM.alignmentEl];

    fields.forEach((el) => {
      el?.addEventListener('input', () => {
        Preview.update();
        if (el === DOM.nameEl) Validation.validateName(DOM.nameEl);
        else if (el === DOM.clsEl) Validation.validateRequired(DOM.clsEl, '클래스');
        else if (el === DOM.speciesEl) Validation.validateRequired(DOM.speciesEl, '종족');
        else if (el === DOM.backgroundEl) Validation.validateRequired(DOM.backgroundEl, '배경');
        else if (el === DOM.alignmentEl) Validation.validateRequired(DOM.alignmentEl, '성향');
      });

      el?.addEventListener('change', () => {
        Preview.update();
        if (el === DOM.clsEl) {
          // 클래스가 바뀌면: 특성/스킬 UI 재렌더 + 스킬 칩 갱신
          Preview.renderClassFeatures();
          ClassSkills.renderForClass(DOM.clsEl.value || '');
          Preview.renderSelectedSkills();
        }
      });
    });

    // 스킬 UI에서 선택이 바뀌면 미리보기 칩을 갱신
    ClassSkills.onChange(() => { Preview.renderSelectedSkills(); });

    DOM.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = [
        Validation.validateName(DOM.nameEl),
        Validation.validateRequired(DOM.clsEl, '클래스'),
        Validation.validateRequired(DOM.speciesEl, '종족'),
        Validation.validateRequired(DOM.backgroundEl, '배경'),
        Validation.validateRequired(DOM.alignmentEl, '성향'),
      ].every(Boolean);

      Preview.update();
      Preview.renderClassFeatures();
      Preview.renderSelectedSkills();

      if (!ok) {
        const firstInvalid = fields.find((el) => el?.getAttribute('aria-invalid') === 'true');
        firstInvalid?.focus();
        return;
      }

      // 선택 스킬까지 포함한 데이터 출력(원하면 서버 전송 지점)
      const payload = { ...DOM.getData(), skills: ClassSkills.getSelectedSkills() };
      console.log('[캐릭터]', JSON.stringify(payload));
    });

    DOM.btnReset?.addEventListener('click', () => {
      DOM.form?.reset();
      [DOM.nameEl, DOM.clsEl, DOM.speciesEl, DOM.backgroundEl, DOM.alignmentEl]
        .forEach((el) => Validation.setError(el, ''));
      Preview.update();
      Preview.renderClassFeatures();
      ClassSkills.renderForClass(DOM.clsEl?.value || '');
      Preview.renderSelectedSkills();
      DOM.nameEl?.focus();
    });
  }

  Options.ensureLoaded(() => { firstPaint(); bindEvents(); });
})();
