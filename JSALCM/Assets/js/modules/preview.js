/* preview.js — 라이브 미리보기 & 특성 + 스킬 칩 렌더 */
(function () {
  'use strict';

  function update() {
    const data = DOM.getData();
    const className = Options.selectedLabel(DOM.clsEl);

    DOM.pvName.textContent = data.name || '—';
    DOM.pvClass.textContent = `Class: ${className || '—'}`;
    DOM.pvSpecies.textContent = `Species: ${data.species || '—'}`;
    DOM.pvBackground.textContent = `Background: ${data.background || '—'}`;
    DOM.pvAlignment.textContent = `Alignment: ${data.alignment || '—'}`;

    const anyFilled = data.name || data.classCode || data.species || data.background || data.alignment;
    DOM.pv.hidden = !anyFilled;
  }

  function renderClassFeatures() {
    DOM.pvFeatList.innerHTML = '';
    const code = DOM.clsEl?.value?.trim() || '';
    const cls = Options.findClassByCode(code);
    const feats = cls?.featuresLvl1 || [];
    if (!code || feats.length === 0) { DOM.pvFeatWrap.hidden = true; return; }

    const frag = document.createDocumentFragment();
    feats.forEach((f) => {
      const li = document.createElement('li');
      li.className = 'feature-item';
      const t = document.createElement('div'); t.className = 'feat-title'; t.textContent = f.name || '특성';
      const d = document.createElement('div'); d.className = 'feat-desc';  d.textContent = f.desc || '';
      li.appendChild(t); li.appendChild(d);
      frag.appendChild(li);
    });
    DOM.pvFeatList.appendChild(frag);
    DOM.pvFeatWrap.hidden = false;
  }

  /** 선택한 스킬을 칩으로 표시 */
  function renderSelectedSkills() {
    DOM.pvSkills.innerHTML = '';
    const items = (window.ClassSkills?.getSelectedSkills?.() || []);
    if (!items.length) { DOM.pvSkillsWrap.hidden = true; return; }

    const frag = document.createDocumentFragment();
    items.forEach(({ label }) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = label || '스킬';
      frag.appendChild(span);
    });
    DOM.pvSkills.appendChild(frag);
    DOM.pvSkillsWrap.hidden = false;
  }

  window.Preview = { update, renderClassFeatures, renderSelectedSkills };
})();
