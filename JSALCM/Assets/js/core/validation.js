/*
 * Validation module
 * - Name and required-field checks
 * - Attaches API to window.Validation
 */
(function(){
  const NAME_MAX = 40;
  const rxName = /^(?=.{1,40}$)[A-Za-z0-9\s_\-.'·\u00B7가-힣\u3131-\u3163\uAC00-\uD7A3]+$/; // include Hangul jamo & syllables

  function setError(el, msg){
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

  function validateName(nameInput){
    const v = nameInput.value.trim();
    if (!v) { setError(nameInput, '이름을 입력하세요.'); return false; }
    if (v.length > NAME_MAX) { setError(nameInput, `최대 ${NAME_MAX}자까지 입력할 수 있습니다.`); return false; }
    if (!rxName.test(v)) { setError(nameInput, "허용되지 않는 문자가 포함되어 있어요. (한글/영문/숫자/공백/-, _, ', .)"); return false; }
    setError(nameInput, '');
    return true;
  }

  function validateRequired(selectEl, label){
    const v = (selectEl.value ?? '').trim();
    if (!v) { setError(selectEl, `${label}을(를) 선택하세요.`); return false; }
    setError(selectEl, '');
    return true;
  }

  window.Validation = { setError, validateName, validateRequired, NAME_MAX };
})();