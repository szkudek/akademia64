// Apply the saved theme before styles load, preventing a bright initial flash.
(() => {
  const key = 'akademia64-theme';
  const root = document.documentElement;
  const normalize = value => value === 'gray' ? 'gray' : 'dark';
  let preference = 'dark';
  try { preference = normalize(localStorage.getItem(key)); } catch {}

  function apply() {
    root.dataset.palette = preference;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = preference === 'gray' ? '#191a1c' : '#101a29';
  }
  apply();
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
