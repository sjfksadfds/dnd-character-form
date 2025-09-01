// ===== Theme handling =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

function effectiveTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(mode) {
  if (mode === 'light' || mode === 'dark') {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  } else {
    root.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
  const eff = effectiveTheme();
  themeToggle?.setAttribute('aria-pressed', String(eff === 'dark'));
  const icon = themeToggle?.querySelector('.icon');
  const label = themeToggle?.querySelector('.label');
  if (icon) icon.textContent = eff === 'dark' ? '☀️' : '🌙';
  if (label) label.textContent = eff === 'dark' ? '라이트' : '다크';
  if (colorSchemeMeta) colorSchemeMeta.setAttribute('content', eff === 'dark' ? 'dark light' : 'light dark');
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const stored = localStorage.getItem('theme');
    if (stored !== 'light' && stored !== 'dark') {
      const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(sysDark ? 'light' : 'dark');
    } else {
      applyTheme(stored === 'dark' ? 'light' : 'dark');
    }
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('theme')) applyTheme();
  });
}
applyTheme();

// ===== Form refs =====
const form = document.getElementById('char-form');
const nameEl = document.getElementById('name');
const clsEl = document.getElementById('cls');
const speciesEl = document.getElementById('species');
const backgroundEl = document.getElementById('background');
const alignmentEl = document.getElementById('alignment');

const pv = document.getElementById('preview');
const pvName = document.getElementById('pv-name');
const pvClass = document.getElementById('pv-class');
const pvSpecies = document.getElementById('pv-species');
const pvBackground = document.getElementById('pv-background');
const pvAlignment = document.getElementById('pv-alignment');
const pvFeatWrap = document.getElementById('pv-features-wrap');
const pvFeatList = document.getElementById('pv-class-features');
const btnReset = document.getElementById('btnReset');

// ===== Validation =====
const NAME_MAX = 40;
const rxName = /^(?=.{1,40}$)[A-Za-z0-9\s_\-.'·\u00B7가-힣ㄱ-ㅎㅏ-ㅣ]+$/;
function setError(el, msg) {
  const err = document.getElementById(`${el.id}-error`);
  if (!err) return;
  if (msg) {
    err.textContent = msg;
    err.hidden = false;
    el.setAttribute('aria-invalid', 'true');
  } else {
    err.textContent = '';
    err.hidden = true;
    el.setAttribute('aria-invalid', 'false');
  }
}
function validateName() {
  const v = nameEl.value.trim();
  if (!v) { setError(nameEl, '이름을 입력하세요.'); return false; }
  if (v.length > NAME_MAX) { setError(nameEl, `최대 ${NAME_MAX}자까지 입력할 수 있습니다.`); return false; }
  if (!rxName.test(v)) { setError(nameEl, "허용되지 않는 문자가 포함되어 있어요. (한글/영문/숫자/공백/-, _, ', .)"); return false; }
  setError(nameEl, ''); return true;
}
function validateRequired(el, label) {
  const v = (el.value ?? '').trim();
  if (!v) { setError(el, `${label}을(를) 선택하세요.`); return false; }
  setError(el, ''); return true;
}

// ===== Helpers =====
function fillSelect(selectEl, items) {
  if (!selectEl) return;
  const first = selectEl.querySelector('option'); // placeholder 유지
  selectEl.innerHTML = '';
  if (first) selectEl.appendChild(first);

  const frag = document.createDocumentFragment();
  for (const item of (items || [])) {
    if (item == null) continue;
    let value, label;
    if (typeof item === 'string') {
      value = item; label = item;
    } else if ('value' in item && 'label' in item) {
      value = item.value; label = item.label;
    } else if ('code' in item && 'name' in item) {
      value = item.code; label = item.name;
    } else {
      continue;
    }
    const opt = document.createElement('option');
    opt.value = String(value);
    opt.textContent = String(label);
    frag.appendChild(opt);
  }
  selectEl.appendChild(frag);
}
function selectedLabel(selectEl) {
  return (selectEl?.selectedOptions?.[0]?.textContent || '').trim();
}
function findClassByCode(code) {
  const arr = window.DND_OPTIONS?.classes || [];
  return arr.find(c => (c && typeof c === 'object' && c.code === code)) || null;
}

// ===== Populate options =====
function populateAllOptions() {
  const d = window.DND_OPTIONS || {};
  fillSelect(clsEl, d.classes);
  fillSelect(speciesEl, d.species);
  fillSelect(backgroundEl, d.backgrounds);
  fillSelect(alignmentEl, d.alignments);
}

// ===== Live preview & features =====
function getData() {
  return {
    name: nameEl?.value?.trim() || '',
    classCode: clsEl?.value?.trim() || '',
    className: selectedLabel(clsEl) || '',
    species: speciesEl?.value?.trim() || '',
    background: backgroundEl?.value?.trim() || '',
    alignment: alignmentEl?.value?.trim() || ''
  };
}
function renderClassFeatures() {
  if (!pvFeatWrap || !pvFeatList) return;
  pvFeatList.innerHTML = '';

  const code = (clsEl?.value || '').trim();
  const cls = findClassByCode(code);
  const feats = (cls?.featuresLvl1 || []);

  if (!code || feats.length === 0) { pvFeatWrap.hidden = true; return; }

  const frag = document.createDocumentFragment();
  feats.forEach(f => {
    const li = document.createElement('li');
    li.className = 'feature-item';
    const t = document.createElement('div'); t.className = 'feat-title'; t.textContent = f.name || '특성';
    const d = document.createElement('div'); d.className = 'feat-desc'; d.textContent = f.desc || '';
    li.appendChild(t); li.appendChild(d);
    frag.appendChild(li);
  });
  pvFeatList.appendChild(frag);
  pvFeatWrap.hidden = false;
}
function updatePreview() {
  const data = getData();
  pvName.textContent = data.name || '—';
  pvClass.textContent = `Class: ${data.className || '—'}`;
  pvSpecies.textContent = `Species: ${data.species || '—'}`;
  pvBackground.textContent = `Background: ${data.background || '—'}`;
  pvAlignment.textContent = `Alignment: ${data.alignment || '—'}`;
  const anyFilled = data.name || data.classCode || data.species || data.background || data.alignment;
  pv.hidden = !anyFilled;
}

// ===== Init (ensure data loaded) =====
(function ensureOptionsAndInit(){
  if (window.DND_OPTIONS) {
    populateAllOptions(); updatePreview(); renderClassFeatures();
  } else {
    const s = document.createElement('script');
    s.src = 'assets/js/options.ko.global.js';
    s.async = false;
    s.onload = () => { populateAllOptions(); updatePreview(); renderClassFeatures(); };
    s.onerror = () => console.warn('[DND] 옵션 스크립트를 불러오지 못했습니다.');
    document.head.appendChild(s);
  }
})();

// ===== Events =====
[nameEl, clsEl, speciesEl, backgroundEl, alignmentEl].forEach(el => {
  el?.addEventListener('input', () => {
    updatePreview();
    if (el === nameEl) validateName();
    else if (el === clsEl) validateRequired(clsEl, '클래스');
    else if (el === speciesEl) validateRequired(speciesEl, '종족');
    else if (el === backgroundEl) validateRequired(backgroundEl, '배경');
    else if (el === alignmentEl) validateRequired(alignmentEl, '성향');
  });
  el?.addEventListener('change', () => {
    updatePreview();
    if (el === clsEl) renderClassFeatures();
  });
});
document.addEventListener('DOMContentLoaded', () => { updatePreview(); renderClassFeatures(); });

// ===== Submit/Reset (폼 제출은 페이지 전환 없이 로그만 남김) =====
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = (
    validateName() &
    validateRequired(clsEl, '클래스') &
    validateRequired(speciesEl, '종족') &
    validateRequired(backgroundEl, '배경') &
    validateRequired(alignmentEl, '성향')
  );
  updatePreview(); renderClassFeatures();
  if (!ok) {
    const firstInvalid = [nameEl, clsEl, speciesEl, backgroundEl, alignmentEl].find(el => el.getAttribute('aria-invalid') === 'true');
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  console.log('[캐릭터]', JSON.stringify(getData()));
});
btnReset?.addEventListener('click', () => {
  form.reset();
  [nameEl, clsEl, speciesEl, backgroundEl, alignmentEl].forEach(el => setError(el, ''));
  updatePreview(); renderClassFeatures();
  nameEl.focus();
});
