const storageKey = 'akademia64.chessSound';
const defaults = { enabled: true, volume: 45, moves: true, feedback: true };

// Short, inharmonic resonances model the board and the softer felt mallet.
const wood = {
  modes: [[1, .65, .016], [2.17, .34, .008], [4.61, .21, .004]],
  noise: .54,
  decay: .004,
};
const mallet = {
  modes: [[1, .72, .048], [2.01, .18, .020], [3.92, .07, .008]],
  noise: .14,
  decay: .006,
};

// Each strike specifies its material, onset, resonance, length and peak.
const sounds = {
  move: [[wood, 0, 306, .072, .28]],
  capture: [[wood, 0, 490, .045, .19], [wood, .017, 229, .091, .35]],
  castle: [[wood, 0, 278, .072, .28], [wood, .065, 339, .066, .24]],
  promotion: [[wood, 0, 306, .072, .27], [mallet, .052, 587, .135, .18]],
  correct: [[mallet, 0, 440, .115, .18], [mallet, .071, 554, .143, .17]],
  incorrect: [[wood, 0, 207, .077, .19], [wood, .047, 168, .093, .14]],
  mate: [[mallet, 0, 349, .138, .19], [mallet, .074, 440, .145, .17], [mallet, .147, 523, .172, .17]],
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

function soundBuffer(name) {
  if (buffers.has(name)) return buffers.get(name);
  const strikes = sounds[name];
  const rate = audio.sampleRate;
  const duration = Math.max(...strikes.map(([, onset, , length]) => onset + length));
  const buffer = audio.createBuffer(1, Math.ceil(duration * rate), rate);
  const samples = buffer.getChannelData(0);
  let seed = 64;
  for (const [material, onset, pitch, length, strength] of strikes) {
    const start = Math.round(onset * rate);
    const strike = new Float32Array(Math.floor(length * rate));
    let peak = 0;
    let noise = 0;
    for (let i = 0; i < strike.length; i++) {
      const time = i / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      noise += .28 * (seed / 2147483648 - 1 - noise);
      let sample = noise * material.noise * Math.exp(-time / material.decay);
      for (const [ratio, gain, decay] of material.modes) {
        sample += Math.sin(2 * Math.PI * pitch * ratio * time) * gain * Math.exp(-time / decay);
      }
      sample *= Math.min(1, time / .0015, (length - time) / .016);
      strike[i] = sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    for (let i = 0; i < strike.length && start + i < samples.length; i++) {
      samples[start + i] += strike[i] * strength / peak;
    }
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
      time += source.buffer.duration + .018;
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
