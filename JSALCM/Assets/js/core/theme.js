/*
 * Theme module
 * - Handles light/dark theme, syncs with system preference, persists user choice
 * - No external deps. Attaches API to window.Theme
 */
(function(){
  const root = document.documentElement;
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  /**
   * Get the effective theme considering stored preference and OS setting
   * @returns {'light'|'dark'}
   */
  function effectiveTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Apply and persist theme. If mode is undefined, clears user override (auto)
   * @param {'light'|'dark'|undefined} mode
   */
  function applyTheme(mode){
    if (mode === 'light' || mode === 'dark') {
      root.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
    } else {
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
    const eff = effectiveTheme();
    // Update meta for UA form controls
    if (colorSchemeMeta) colorSchemeMeta.setAttribute('content', eff === 'dark' ? 'dark light' : 'light dark');
    // Update toggle UI if present
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(eff === 'dark'));
      const icon = themeToggle.querySelector('.icon');
      const label = themeToggle.querySelector('.label');
      if (icon) icon.textContent = eff === 'dark' ? '☀️' : '🌙';
      if (label) label.textContent = eff === 'dark' ? '라이트' : '다크';
    }
  }

  /**
   * Wire up the toggle button and system change listener
   */
  function init(){
    const themeToggle = document.getElementById('themeToggle');
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
    // Initial paint
    applyTheme();
  }

  window.Theme = { init, applyTheme, effectiveTheme };
})();