// ===== Theme handling =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

function effectiveTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(mode /* 'light' | 'dark' | undefined */) {
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
const btnReset = document.getElementById('btnReset');

// ===== Validation helpers =====
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
  setError(nameEl, '');
  return true;
}
function validateRequired(el, label) {
  const v = (el.value ?? '').trim();
  if (!v) { setError(el, `${label}을(를) 선택하세요.`); return false; }
  setError(el, '');
  return true;
}

// ===== Options population (external list) =====
function fillSelect(selectEl, items) {
  if (!selectEl || !Array.isArray(items)) return;
  const first = selectEl.querySelector('option'); // placeholder 유지
  selectEl.innerHTML = '';
  if (first) selectEl.appendChild(first);
  const frag = document.createDocumentFragment();
  for (const label of items) {
    const opt = document.createElement('option');
    opt.value = label; // 현재는 value=라벨(한국어) 동일
    opt.textContent = label;
    frag.appendChild(opt);
  }
  selectEl.appendChild(frag);
}
function populateAllOptions() {
  const d = window.DND_OPTIONS || {};
  fillSelect(clsEl, d.classes);
  fillSelect(speciesEl, d.species);
  fillSelect(backgroundEl, d.backgrounds);
  fillSelect(alignmentEl, d.alignments);
}
(function ensureOptionsAndInit(){
  if (window.DND_OPTIONS) {
    populateAllOptions();
  } else {
    const s = document.createElement('script');
    s.src = 'assets/js/options.ko.global.js';
    s.async = false; // 순서 보장
    s.onload = () => { populateAllOptions(); updatePreview(); };
    s.onerror = () => console.warn('[DND] 옵션 스크립트를 불러오지 못했습니다.');
    document.head.appendChild(s);
  }
})();

// ===== Live preview =====
function getData() {
  return {
    name: nameEl?.value?.trim() || '',
    class: clsEl?.value?.trim() || '',
    species: speciesEl?.value?.trim() || '',
    background: backgroundEl?.value?.trim() || '',
    alignment: alignmentEl?.value?.trim() || ''
  };
}
function updatePreview() {
  const data = getData();
  pvName.textContent = data.name || '—';
  pvClass.textContent = `Class: ${data.class || '—'}`;
  pvSpecies.textContent = `Species: ${data.species || '—'}`;
  pvBackground.textContent = `Background: ${data.background || '—'}`;
  pvAlignment.textContent = `Alignment: ${data.alignment || '—'}`;
  const anyFilled = data.name || data.class || data.species || data.background || data.alignment;
  pv.hidden = !anyFilled;
}

// 입력 즉시 반영
[nameEl, clsEl, speciesEl, backgroundEl, alignmentEl].forEach(el => {
  el?.addEventListener('input', () => {
    // 즉시 미리보기 갱신
    updatePreview();
    // 즉시 검증도 수행(선택 사항)
    if (el === nameEl) validateName();
    else if (el === clsEl) validateRequired(clsEl, '클래스');
    else if (el === speciesEl) validateRequired(speciesEl, '종족');
    else if (el === backgroundEl) validateRequired(backgroundEl, '배경');
    else if (el === alignmentEl) validateRequired(alignmentEl, '성향');
  });
  el?.addEventListener('change', updatePreview);
});

document.addEventListener('DOMContentLoaded', updatePreview);

// ===== Submit/Reset (유지: 저장 버튼 없이도 동작) =====
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = (
    validateName() &
    validateRequired(clsEl, '클래스') &
    validateRequired(speciesEl, '종족') &
    validateRequired(backgroundEl, '배경') &
    validateRequired(alignmentEl, '성향')
  );
  updatePreview();
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
  updatePreview();
  nameEl.focus();
});
