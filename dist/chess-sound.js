import { clicks, sampleRate } from './chess-clicks.js';

const storageKey = 'akademia64.chessSound';
const defaults = { enabled: true, volume: 45, moves: true, feedback: true };

// Each hit specifies the recording, its onset in seconds and its gain.
const sounds = {
  move: [['move', 0, 1]],
  capture: [['capture', 0, 1]],
  castle: [['tap', 0, 1], ['move', .050, .85]],
  promotion: [['move', 0, .9], ['tap', .077, .8]],
  correct: [['tap', 0, .62], ['move', .081, .72]],
  incorrect: [['capture', 0, .51]],
  mate: [['tap', 0, .75], ['tap', .064, .82], ['capture', .133, .86]],
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
const buffers = new Map();

const recordings = new Map();

function recording(name) {
  if (recordings.has(name)) return recordings.get(name);
  const bytes = Uint8Array.from(atob(clicks[name]), byte => byte.charCodeAt(0));
  const pcm = new DataView(bytes.buffer);
  const samples = Float32Array.from({ length: bytes.length / 2 }, (_, i) => pcm.getInt16(i * 2, true) / 32768);
  recordings.set(name, samples);
  return samples;
}

function soundBuffer(name) {
  if (buffers.has(name)) return buffers.get(name);
  const hits = sounds[name].map(([sample, onset, gain]) => [recording(sample), Math.round(onset * sampleRate), gain]);
  const length = Math.max(...hits.map(([samples, offset]) => offset + samples.length));
  const buffer = audio.createBuffer(1, length, sampleRate);
  const mixed = buffer.getChannelData(0);
  for (const [samples, offset, gain] of hits) {
    for (let i = 0; i < samples.length; i++) mixed[offset + i] += samples[i] * gain;
  }
  buffers.set(name, buffer);
  return buffer;
}

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
      const source = audio.createBufferSource();
      source.buffer = soundBuffer(name);
      source.connect(channels[group]);
      source.onended = () => source.disconnect();
      source.start(time);
      time += source.buffer.duration + .008;
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
    <p>Wspólne ustawienia dla wszystkich szachownic.</p>
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
