const storageKey = 'akademia64.chessSound';
const defaults = { enabled: false, volume: 45, moves: true, feedback: true };

// Each note describes its pitch, duration and strength.
const sounds = {
  move: [[190, .047, .27]],
  capture: [[135, .075, .38]],
  castle: [[190, .045, .27], [155, .055, .24]],
  promotion: [[330, .055, .22], [494, .085, .23]],
  correct: [[440, .055, .23], [587, .09, .23]],
  incorrect: [[260, .065, .22], [207, .085, .22]],
  mate: [[392, .065, .22], [523, .075, .22], [659, .12, .24]],
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return {
      enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : defaults.enabled,
      volume: Number.isFinite(saved?.volume) ? Math.min(100, Math.max(0, saved.volume)) : defaults.volume,
      moves: typeof saved?.moves === 'boolean' ? saved.moves : defaults.moves,
      feedback: typeof saved?.feedback === 'boolean' ? saved.feedback : defaults.feedback,
    };
  } catch {
    return { ...defaults };
  }
}

let settings = loadSettings();
let audio, master, channels;

function applyLevels() {
  if (!master) return;
  master.gain.value = settings.enabled ? settings.volume / 100 : 0;
  channels.moves.gain.value = Number(settings.moves);
  channels.feedback.gain.value = Number(settings.feedback);
}

export function unlockChessSound() {
  if (!settings.enabled || !settings.volume) return;
  try {
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return;
    if (!audio) {
      audio = new AudioContext();
      master = audio.createGain();
      master.connect(audio.destination);
      channels = { moves: audio.createGain(), feedback: audio.createGain() };
      for (const channel of Object.values(channels)) channel.connect(master);
      applyLevels();
    }
    if (audio.state !== 'running') audio.resume().catch(() => {});
  } catch {
    // Audio is optional and must never interrupt the exercise.
  }
}

function playSequence(events) {
  if (!settings.enabled || !settings.volume || !audio || !channels) return;
  try {
    let time = audio.currentTime + .005;
    for (const [name, group] of events) {
      if (!settings[group]) continue;
      for (const [pitch, duration, strength] of sounds[name]) {
        const tone = audio.createOscillator();
        const envelope = audio.createGain();
        tone.type = group === 'moves' ? 'triangle' : 'sine';
        tone.frequency.setValueAtTime(pitch, time);
        tone.frequency.exponentialRampToValueAtTime(pitch * .8, time + duration);
        envelope.gain.setValueAtTime(.001, time);
        envelope.gain.exponentialRampToValueAtTime(strength, time + .006);
        envelope.gain.exponentialRampToValueAtTime(.001, time + duration);
        tone.connect(envelope);
        envelope.connect(channels[group]);
        tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
        tone.start(time);
        tone.stop(time + duration);
        time += duration + .012;
      }
      time += .025;
    }
  } catch {
    // A browser can suspend or disable audio independently of the settings.
  }
}

export function soundMove(move, { reply, answer, mate = false } = {}) {
  const events = [move, reply].filter(Boolean).map(played => {
    const name = played.promotion ? 'promotion'
      : /[kq]/.test(played.flags) ? 'castle'
      : played.captured ? 'capture' : 'move';
    return [name, 'moves'];
  });
  if (mate || answer) events.push([mate ? 'mate' : answer, 'feedback']);
  playSequence(events);
}

export function openSoundSettings(dialog, content) {
  content.innerHTML = `
    <div class="eyebrow">AKADEMIA 64</div>
    <h2>Dźwięki szachowe</h2>
    <p>Wspólne ustawienia dla Zadań i Debiutów.</p>
    <p><label><input name="enabled" type="checkbox"> Włącz dźwięki</label></p>
    <p><label for="sound-volume">Głośność <output for="sound-volume"></output></label><br>
      <input id="sound-volume" name="volume" type="range" min="0" max="100"></p>
    <p><label><input name="moves" type="checkbox"> Ruchy figur</label></p>
    <p><label><input name="feedback" type="checkbox"> Odpowiedzi i mat</label></p>
  `;
  const output = content.querySelector('output');
  output.value = settings.volume + '%';
  for (const input of content.querySelectorAll('input')) {
    if (input.type === 'checkbox') input.checked = settings[input.name];
    else input.value = settings.volume;
    input.addEventListener('input', () => {
      settings[input.name] = input.type === 'checkbox' ? input.checked : input.valueAsNumber;
      output.value = settings.volume + '%';
      try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch {}
      applyLevels();
      unlockChessSound();
    });
  }
  dialog.showModal();
}
