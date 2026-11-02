// Apply the saved theme before styles load, preventing a bright initial flash.
(() => {
  const key = 'akademia64-theme';
  const allowed = ['light', 'dark', 'system'];
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const normalize = value => allowed.includes(value) ? value : 'system';
  let preference = 'system';
  try { preference = normalize(localStorage.getItem(key)); } catch {}

  function apply() {
    const dark = preference === 'dark' || (preference === 'system' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.style.colorScheme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#141e1b' : '#f6f5ef';
  }
  apply();
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = normalize(event.newValue);
    apply();
    const select = document.getElementById('theme-select');
    if (select) select.value = preference;
  });
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('theme-select');
    select.value = preference;
    select.addEventListener('change', () => {
      preference = normalize(select.value);
      apply();
      let saved = true;
      try { localStorage.setItem(key, preference); } catch { saved = false; }
      document.getElementById('theme-status').textContent = saved
        ? `Wybrany motyw: ${select.selectedOptions[0].textContent}. Wybór został zapamiętany.`
        : 'Motyw zmieniony. Przeglądarka nie pozwala zapamiętać wyboru.';
    });
  });
})();
