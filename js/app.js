'use strict';
/* =========================================================
   Minhas Músicas — player web que lê uma pasta do OneDrive
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------------- ícones ---------------- */
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  back: svg('<path d="M15 18l-6-6 6-6"/>'),
  refresh: svg('<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>'),
  settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  play: svg('<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor" stroke="none"/>'),
  pause: svg('<rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" stroke="none"/>'),
  next: svg('<path d="M5 5.5v13a1 1 0 0 0 1.55.83L16 13v5a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v5L6.55 4.67A1 1 0 0 0 5 5.5z" fill="currentColor" stroke="none"/>'),
  prev: svg('<path d="M19 5.5v13a1 1 0 0 1-1.55.83L8 13v5a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5l9.45-6.33A1 1 0 0 1 19 5.5z" fill="currentColor" stroke="none"/>'),
  shuffle: svg('<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>'),
  repeat: svg('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
  repeat1: svg('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><path d="M11 10l1.5-1v6" stroke-width="1.8"/>'),
  heart: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'),
  heartFill: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" fill="currentColor"/>'),
  more: svg('<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>'),
  music: svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
  artist: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  album: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>'),
  playlist: svg('<path d="M3 6h13M3 12h13M3 18h8"/><path d="M19 16V7l3-1"/><circle cx="17" cy="16" r="2"/>'),
  down: svg('<path d="M6 9l6 6 6-6"/>'),
  queue: svg('<path d="M3 6h18M3 12h18M3 18h11"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  chev: svg('<path d="M9 6l6 6-6 6"/>'),
  playnext: svg('<path d="M3 6h12M3 12h8M3 18h8"/><path d="M15 13l6 3.5-6 3.5z" fill="currentColor"/>'),
  addq: svg('<path d="M3 6h12M3 12h12M3 18h7"/><path d="M17 14v6M14 17h6"/>'),
  trash: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
  edit: svg('<path d="M4 20h4L19 9l-4-4L4 16v4z"/>'),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'),
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  ms: '<svg viewBox="0 0 24 24" width="18" height="18"><rect x="2" y="2" width="9.5" height="9.5" fill="#f25022"/><rect x="12.5" y="2" width="9.5" height="9.5" fill="#7fba00"/><rect x="2" y="12.5" width="9.5" height="9.5" fill="#00a4ef"/><rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#ffb900"/></svg>'
};
function applyIcons(root = document) { $$('[data-icon]', root).forEach(el => { el.innerHTML = ICON[el.dataset.icon] || ''; }); }

/* ---------------- utilidades ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const collator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });
function fmt(sec) {
  if (!sec || !isFinite(sec)) return '';
  sec = Math.floor(sec);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function shuffled(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* ---------------- estado ---------------- */
const S = {
  tracks: [],
  byId: new Map(),
  meta: new Map(),
  data: { versao: 1, favoritos: [], playlists: [], atualizado: '' },
  stack: [{ type: 'songs' }],
  list: [],
  query: '',
  sort: lsGet('mp_sort', 'recent'),
  scanning: false,
  lastScan: 0,
  folderMissing: false,
  sheetHandler: null,
  user: null
};
const folder = () => lsGet('mp_folder', null) || CONFIG.FOLDER || 'Musicas';
const artistOf = (t) => t.artist || 'Artista desconhecido';
const albumOf = (t) => t.album || t.folderName || 'Sem álbum';
const albumKey = (t) => albumOf(t) + '\u0001' + (t.album ? '' : t.folder || '');
const artOf = (t) => (t && (t.art || t.thumb)) || '';

/* ---------------- cache de metadados (IndexedDB) ---------------- */
const MetaDB = (() => {
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open('meu-player', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('meta');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  async function all() {
    const d = await db();
    return new Promise((res, rej) => {
      const out = new Map();
      const q = d.transaction('meta').objectStore('meta').openCursor();
      q.onsuccess = () => { const c = q.result; if (c) { out.set(c.key, c.value); c.continue(); } else res(out); };
      q.onerror = () => rej(q.error);
    });
  }
  async function put(k, v) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction('meta', 'readwrite'); tx.objectStore('meta').put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  }
  async function clear() {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction('meta', 'readwrite'); tx.objectStore('meta').clear(); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  }
  return { all, put, clear };
})();

function applyMeta(t) {
  const m = S.meta.get(t.id);
  if (!m || m.mod !== t.modified || m.failed) return;
  if (!t.hasTags) { if (m.title) t.title = m.title; if (m.artist) t.artist = m.artist; }
  if (!t.album && m.album) t.album = m.album;
  if (m.art) t.art = m.art;
}

function setTracks(list) {
  list.forEach(applyMeta);
  S.tracks = list;
  S.byId = new Map(list.map(t => [t.id, t]));
}

/* ---------------- playlists e favoritos (arquivo _player.json no OneDrive) ---------------- */
const Data = {
  path: () => folder() + '/_player.json',
  normalize(d) {
    d = d && typeof d === 'object' ? d : {};
    return {
      versao: 1,
      favoritos: Array.isArray(d.favoritos) ? d.favoritos : [],
      playlists: Array.isArray(d.playlists) ? d.playlists.filter(p => p && p.id).map(p => ({ id: p.id, nome: p.nome || 'Playlist', faixas: Array.isArray(p.faixas) ? p.faixas : [] })) : [],
      atualizado: d.atualizado || ''
    };
  },
  async load() {
    S.data = this.normalize(lsGet('mp_data', null));
    try {
      const remote = await OneDrive.readJson(this.path());
      if (remote) {
        const r = this.normalize(remote);
        if (!S.data.atualizado || r.atualizado >= S.data.atualizado) { S.data = r; lsSet('mp_data', r); }
        else this.push();   // local mais novo: envia
      } else if (S.data.playlists.length || S.data.favoritos.length) this.push();
    } catch (e) { if (e.name === 'AuthError') throw e; console.warn('Playlists:', e); }
  },
  _t: null,
  save() {
    S.data.atualizado = new Date().toISOString();
    lsSet('mp_data', S.data);
    clearTimeout(this._t);
    this._t = setTimeout(() => this.push(), 1200);
  },
  push() {
    OneDrive.writeJson(this.path(), S.data).catch(e => {
      if (e.name === 'AuthError') return App.authFail();
      toast('Não foi possível salvar as playlists no OneDrive');
    });
  },
  isFav: (id) => S.data.favoritos.includes(id),
  toggleFav(t) {
    const i = S.data.favoritos.indexOf(t.id);
    if (i >= 0) S.data.favoritos.splice(i, 1); else S.data.favoritos.unshift(t.id);
    this.save();
    toast(i >= 0 ? 'Removida das favoritas' : 'Adicionada às favoritas');
    return i < 0;
  },
  createPlaylist(nome) {
    const p = { id: 'pl_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nome, faixas: [] };
    S.data.playlists.push(p); this.save(); return p;
  },
  addTo(p, ids) {
    let n = 0;
    ids.forEach(id => { if (!p.faixas.includes(id)) { p.faixas.push(id); n++; } });
    this.save();
    toast(n ? `${plural(n, 'música adicionada', 'músicas adicionadas')} a "${p.nome}"` : 'Já estava na playlist');
  },
  removeFrom(p, id) { p.faixas = p.faixas.filter(x => x !== id); this.save(); },
  rename(p, nome) { p.nome = nome; this.save(); },
  remove(p) { S.data.playlists = S.data.playlists.filter(x => x.id !== p.id); this.save(); },
  get: (id) => S.data.playlists.find(p => p.id === id)
};

/* ---------------- player ---------------- */
const Player = (() => {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  let queue = [], original = [], idx = -1;
  let shuffle = lsGet('mp_shuffle', false), repeat = lsGet('mp_repeat', 'off');
  let loadedId = null, unlocked = false, silentUrl = null, token = 0, pendingSeek = 0, restoreTime = 0;
  let source = '', retried = {}, lastPos = 0, lastSave = 0;
  const urls = new Map();
  const listeners = [];
  const emit = () => listeners.forEach(fn => fn());

  function silentWav() {
    const sr = 8000, n = 800, b = new ArrayBuffer(44 + n), v = new DataView(b);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }

  /** Precisa ser chamado de forma síncrona dentro de um toque (exigência do iOS) */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (!loadedId) {
      silentUrl = silentUrl || silentWav();
      audio.src = silentUrl;
      audio.play().catch(() => {});
    }
  }

  async function urlFor(t) {
    const c = urls.get(t.id);
    if (c && c.exp > Date.now()) return c.url;
    const url = await OneDrive.downloadUrl(t.id);
    urls.set(t.id, { url, exp: Date.now() + 40 * 60000 });
    return url;
  }
  function prefetch() {
    const n = queue[idx + 1] || (repeat === 'all' ? queue[0] : null);
    if (n) urlFor(n).catch(() => {});
  }

  async function load(i, { autoplay = true, seek = 0 } = {}) {
    if (i < 0 || i >= queue.length) return;
    idx = i;
    const t = queue[i];
    const my = ++token;
    emit();
    try {
      const url = await urlFor(t);
      if (my !== token) return;
      loadedId = t.id;
      audio.src = url;
      pendingSeek = seek;
      updateSession();
      emit();
      if (autoplay) {
        try { await audio.play(); }
        catch (err) {
          if (err.name === 'NotAllowedError') toast('Toque em ▶ para começar');
          else if (err.name !== 'AbortError') throw err;
        }
      }
      prefetch();
      saveState(true);
    } catch (e) {
      if (e.name === 'AuthError') return App.authFail();
      toast('Não foi possível tocar: ' + e.message);
    }
  }

  function playList(list, start = 0, opts = {}) {
    if (!list.length) return;
    original = list.slice();
    source = opts.source || '';
    if (opts.shuffle !== undefined) { shuffle = opts.shuffle; lsSet('mp_shuffle', shuffle); }
    if (shuffle) {
      if (start < 0) start = Math.floor(Math.random() * original.length);
      const first = original[start];
      queue = [first, ...shuffled(original.filter((_, j) => j !== start))];
      idx = 0;
    } else {
      queue = original.slice();
      idx = Math.max(0, start);
    }
    retried = {};
    load(idx);
  }

  function toggle() {
    if (!queue.length) return;
    const cur = queue[idx];
    if (!cur) return;
    if (loadedId !== cur.id) { load(idx, { seek: restoreTime }); restoreTime = 0; return; }
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  }
  function next(auto = false) {
    if (!queue.length) return;
    if (idx < queue.length - 1) load(idx + 1);
    else if (repeat === 'all' || !auto) load(0, { autoplay: repeat === 'all' || !auto });
    else { audio.pause(); emit(); }
  }
  function prev() {
    if (!queue.length) return;
    if (audio.currentTime > 3 || idx === 0) { audio.currentTime = 0; if (loadedId !== queue[idx].id) load(idx); return; }
    load(idx - 1);
  }
  function jump(i) { load(i); }
  function seekTo(sec) { if (isFinite(sec)) audio.currentTime = sec; }

  function toggleShuffle() {
    shuffle = !shuffle; lsSet('mp_shuffle', shuffle);
    const cur = queue[idx];
    if (cur) {
      if (shuffle) { queue = [cur, ...shuffled(queue.filter((_, j) => j !== idx))]; idx = 0; }
      else { queue = original.slice(); idx = Math.max(0, queue.findIndex(t => t.id === cur.id)); }
      prefetch(); saveState(true);
    }
    emit();
    toast(shuffle ? 'Aleatório ativado' : 'Aleatório desativado');
  }
  function cycleRepeat() {
    repeat = repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off';
    lsSet('mp_repeat', repeat); emit();
    toast({ off: 'Repetir desativado', all: 'Repetir tudo', one: 'Repetir esta música' }[repeat]);
  }
  function playNext(t) {
    if (!queue.length) { playList([t], 0); return; }
    queue.splice(idx + 1, 0, t);
    const oi = original.findIndex(x => x.id === queue[idx].id);
    original.splice(oi + 1, 0, t);
    prefetch(); saveState(true); emit();
  }
  function addToQueue(t) {
    if (!queue.length) { playList([t], 0); return; }
    queue.push(t); original.push(t); saveState(true); emit();
  }

  function onEnded() {
    if (repeat === 'one') { audio.currentTime = 0; audio.play().catch(() => {}); return; }
    next(true);
  }

  function updateSession() {
    if (!('mediaSession' in navigator)) return;
    const t = queue[idx]; if (!t) return;
    const art = artOf(t);
    const artwork = art
      ? [{ src: art, sizes: '512x512', type: 'image/jpeg' }]
      : [{ src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: artistOf(t), album: t.album || '', artwork });
    } catch {}
  }
  function setupSession() {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    const h = (a, f) => { try { ms.setActionHandler(a, f); } catch {} };
    h('play', () => toggle());
    h('pause', () => audio.pause());
    h('previoustrack', () => prev());
    h('nexttrack', () => next());
    h('seekto', (d) => seekTo(d.seekTime));
    h('seekbackward', null);
    h('seekforward', null);
  }

  function saveState(force) {
    const now = Date.now();
    if (!force && now - lastSave < 5000) return;
    lastSave = now;
    lsSet('mp_state', {
      q: queue.map(t => t.id), o: original.map(t => t.id), i: idx,
      time: loadedId ? audio.currentTime : restoreTime, source
    });
  }
  function restore() {
    const st = lsGet('mp_state', null);
    if (!st || !Array.isArray(st.q)) return;
    const map = (ids) => ids.map(id => S.byId.get(id)).filter(Boolean);
    const curId = st.q[st.i];
    queue = map(st.q); original = map(st.o || st.q);
    idx = Math.max(0, queue.findIndex(t => t.id === curId));
    if (!queue.length) { idx = -1; return; }
    restoreTime = st.time || 0;
    source = st.source || '';
    emit();
  }
  /** Atualiza referências quando a biblioteca é recarregada */
  function relink() {
    const fix = (arr) => arr.map(t => S.byId.get(t.id) || t);
    queue = fix(queue); original = fix(original);
    updateSession(); emit();
  }

  audio.addEventListener('loadedmetadata', () => { if (pendingSeek) { audio.currentTime = pendingSeek; pendingSeek = 0; } });
  audio.addEventListener('play', emit);
  audio.addEventListener('pause', () => { emit(); saveState(true); });
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('timeupdate', () => {
    App.updateProgress();
    saveState(false);
    const now = Date.now();
    if (now - lastPos > 1000 && 'mediaSession' in navigator && navigator.mediaSession.setPositionState && isFinite(audio.duration)) {
      lastPos = now;
      try { navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate, position: Math.min(audio.currentTime, audio.duration) }); } catch {}
    }
  });
  audio.addEventListener('durationchange', () => App.updateProgress());
  audio.addEventListener('error', () => {
    const t = queue[idx];
    if (!t || loadedId !== t.id) return;   // erro do áudio silencioso: ignora
    if (!retried[t.id]) {                   // link expirado: pega um novo e continua de onde parou
      retried[t.id] = true;
      urls.delete(t.id);
      load(idx, { seek: audio.currentTime || 0 });
    } else {
      toast('Formato não suportado ou arquivo indisponível: ' + t.name);
      if (idx < queue.length - 1) setTimeout(() => load(idx + 1), 800);
    }
  });
  setupSession();

  return {
    audio, unlock, urlFor, playList, toggle, next, prev, jump, seekTo, toggleShuffle, cycleRepeat,
    playNext, addToQueue, restore, relink, updateSession,
    onChange: (fn) => listeners.push(fn),
    current: () => queue[idx] || null,
    queue: () => queue, index: () => idx,
    isPlaying: () => !!loadedId && !audio.paused && loadedId === (queue[idx] && queue[idx].id),
    shuffle: () => shuffle, repeat: () => repeat, source: () => source,
    time: () => (loadedId ? audio.currentTime : restoreTime), duration: () => audio.duration
  };
})();

/* ---------------- leitura das tags (capa/artista) quando o OneDrive não fornece ---------------- */
const Enrich = (() => {
  let running = false, waitedLib = 0;
  const later = debounce(() => App.render(), 1500);

  async function fetchHead(url) {
    let r = await fetch(url, { headers: { Range: 'bytes=0-1048575' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    let buf = new Uint8Array(await r.arrayBuffer());
    if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {           // "ID3"
      const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
      const need = size + 10 + 2048;
      if (need > buf.length && need < 8 * 1024 * 1024) {
        r = await fetch(url, { headers: { Range: `bytes=0-${need}` } });
        buf = new Uint8Array(await r.arrayBuffer());
      }
    }
    return new Blob([buf]);
  }
  const readTags = (blob) => new Promise((res, rej) => window.jsmediatags.read(blob, { onSuccess: res, onError: rej }));
  function toDataUrl(blob, max = 480) {
    return new Promise((res) => {
      const u = URL.createObjectURL(blob), img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        try { res(c.toDataURL('image/jpeg', 0.85)); } catch { res(''); }
      };
      img.onerror = () => { URL.revokeObjectURL(u); res(''); };
      img.src = u;
    });
  }

  async function one(t) {
    const m = { mod: t.modified };
    try {
      const blob = await fetchHead(await Player.urlFor(t));
      const tags = (await readTags(blob)).tags || {};
      m.title = tags.title || ''; m.artist = tags.artist || ''; m.album = tags.album || '';
      const pic = tags.picture;
      if (pic && pic.data && pic.data.length) m.art = await toDataUrl(new Blob([new Uint8Array(pic.data)], { type: pic.format || 'image/jpeg' }));
      if (!m.title && !m.artist && !m.art) m.failed = true;
    } catch (e) {
      if (e.name === 'AuthError') throw e;
      m.failed = true;
    }
    S.meta.set(t.id, m);
    MetaDB.put(t.id, m).catch(() => {});
    applyMeta(t);
    if (Player.current() && Player.current().id === t.id) { Player.updateSession(); App.updatePlayerUI(true); }
    later();
  }

  async function run() {
    if (running) return;
    if (!window.jsmediatags) { if (waitedLib++ < 10) setTimeout(run, 2000); return; }
    const todo = S.tracks.filter(t => (!t.hasTags || !t.thumb) && !t.art && !(S.meta.get(t.id) && S.meta.get(t.id).mod === t.modified));
    if (!todo.length) return;
    running = true;
    let i = 0;
    const worker = async () => {
      while (i < todo.length) {
        const t = todo[i++];
        if (!S.byId.has(t.id)) continue;
        try { await one(t); } catch (e) { if (e.name === 'AuthError') { i = todo.length; App.authFail(); } }
      }
    };
    await Promise.all([worker(), worker()]);
    running = false;
  }
  return { run };
})();

/* ---------------- interface ---------------- */
const App = (() => {
  const content = () => $('#content');
  let lastArtId = null, seeking = false;

  /* ---- html helpers ---- */
  function artHtml(src, cls = '', icon = 'music') {
    return `<div class="art ${cls}">${ICON[icon]}${src ? `<img loading="lazy" decoding="async" src="${esc(src)}" alt="" onerror="this.remove()">` : ''}</div>`;
  }
  function rowHtml(t, i, sub) {
    const cur = Player.current();
    return `<div class="row${cur && cur.id === t.id ? ' playing' : ''}" data-i="${i}" data-id="${esc(t.id)}">
      ${artHtml(artOf(t), 'row-art')}
      <div class="row-text"><div class="row-title ellipsis">${esc(t.title)}</div><div class="row-sub ellipsis">${esc(sub != null ? sub : artistOf(t) + (t.album ? ' · ' + t.album : ''))}</div></div>
      <span class="dur">${fmt(t.duration)}</span>
      <button class="icon-btn" data-more="${i}" aria-label="Opções">${ICON.more}</button>
    </div>`;
  }
  const navRow = (nav, key, art, title, sub, cls = '', icon = 'music') => `
    <div class="row" data-nav="${nav}" data-key="${esc(key)}">
      ${artHtml(art, 'row-art ' + cls, icon)}
      <div class="row-text"><div class="row-title ellipsis">${esc(title)}</div><div class="row-sub ellipsis">${esc(sub)}</div></div>
      <span class="chev">${ICON.chev}</span>
    </div>`;
  const playButtons = () => `<button class="btn primary" data-act="playall">${ICON.play}Tocar</button><button class="btn" data-act="shuffleall">${ICON.shuffle}Aleatório</button>`;

  function emptyHtml() {
    if (S.folderMissing) {
      return `<div class="empty">${ICON.folder}<h3>Pasta não encontrada</h3>
        <p>Não achei a pasta <b>${esc(folder())}</b> no seu OneDrive.</p>
        <button class="btn primary" data-act="createfolder">${ICON.plus}Criar a pasta</button>
        <button class="btn" data-act="settings">Escolher outra pasta</button></div>`;
    }
    if (S.scanning) return `<div class="empty"><span class="spinner"></span><p>Carregando sua biblioteca…</p></div>`;
    return `<div class="empty">${ICON.music}<h3>Nenhuma música ainda</h3>
      <p>Coloque arquivos de áudio (MP3 ou M4A) na pasta <b>${esc(folder())}</b> do seu OneDrive. Elas aparecem aqui automaticamente.</p>
      <button class="btn" data-act="refresh">${ICON.refresh}Atualizar agora</button></div>`;
  }

  /* ---- dados derivados ---- */
  const matches = (t, q) => !q || norm(`${t.title} ${t.artist} ${t.album} ${t.name} ${t.folderName}`).includes(q);
  function sortTracks(list, mode) {
    const a = list.slice();
    if (mode === 'title') a.sort((x, y) => collator.compare(x.title, y.title));
    else if (mode === 'artist') a.sort((x, y) => collator.compare(artistOf(x), artistOf(y)) || collator.compare(x.album, y.album) || (x.track - y.track) || collator.compare(x.title, y.title));
    else a.sort((x, y) => (y.added || '').localeCompare(x.added || ''));
    return a;
  }
  const albumSort = (a) => a.slice().sort((x, y) => (x.track - y.track) || collator.compare(x.name, y.name));
  function groupBy(fn) {
    const m = new Map();
    S.tracks.forEach(t => { const k = fn(t); if (!m.has(k)) m.set(k, []); m.get(k).push(t); });
    return m;
  }
  const firstArt = (list) => { for (const t of list) { const a = artOf(t); if (a) return a; } return ''; };
  function albumArtist(list) {
    const c = {}; list.forEach(t => { const a = artistOf(t); c[a] = (c[a] || 0) + 1; });
    const ks = Object.keys(c);
    return ks.length > 2 ? 'Vários artistas' : ks.sort((a, b) => c[b] - c[a]).join(', ');
  }

  /* ---- views ---- */
  function render(opts = {}) {
    const v = S.stack[S.stack.length - 1];
    const q = norm(S.query.trim());
    let html = '', list = [], title = '';

    if (!S.tracks.length && ['songs', 'artists', 'albums'].includes(v.type)) {
      html = emptyHtml();
      title = { songs: 'Músicas', artists: 'Artistas', albums: 'Álbuns' }[v.type];
    } else switch (v.type) {
      case 'songs': {
        title = 'Músicas';
        list = sortTracks(S.tracks.filter(t => matches(t, q)), S.sort);
        html = `<div class="list-head">${playButtons()}<span class="spacer"></span>
          <select id="sortSel" aria-label="Ordenar">
            <option value="recent"${S.sort === 'recent' ? ' selected' : ''}>Recentes</option>
            <option value="title"${S.sort === 'title' ? ' selected' : ''}>A–Z</option>
            <option value="artist"${S.sort === 'artist' ? ' selected' : ''}>Artista</option>
          </select></div>
          <div class="count">${plural(list.length, 'música', 'músicas')}</div>`;
        html += list.length ? list.map((t, i) => rowHtml(t, i)).join('') : `<div class="empty"><p>Nada encontrado para "${esc(S.query)}".</p></div>`;
        break;
      }
      case 'artists': {
        title = 'Artistas';
        const g = groupBy(artistOf);
        const keys = [...g.keys()].filter(k => !q || norm(k).includes(q)).sort(collator.compare);
        html = `<div class="count">${plural(keys.length, 'artista', 'artistas')}</div>` +
          keys.map(k => navRow('artist', k, firstArt(g.get(k)), k, plural(g.get(k).length, 'música', 'músicas'), 'round', 'artist')).join('');
        break;
      }
      case 'albums': {
        title = 'Álbuns';
        const g = groupBy(albumKey);
        const keys = [...g.keys()].filter(k => !q || norm(albumOf(g.get(k)[0]) + ' ' + albumArtist(g.get(k))).includes(q))
          .sort((a, b) => collator.compare(albumOf(g.get(a)[0]), albumOf(g.get(b)[0])));
        html = `<div class="count">${plural(keys.length, 'álbum', 'álbuns')}</div><div class="grid">` + keys.map(k => {
          const tl = g.get(k);
          return `<button class="card" data-nav="album" data-key="${esc(k)}">${artHtml(firstArt(tl), '', 'album')}
            <div class="t ellipsis">${esc(albumOf(tl[0]))}</div><div class="s ellipsis">${esc(albumArtist(tl))}</div></button>`;
        }).join('') + '</div>';
        break;
      }
      case 'playlists': {
        title = 'Playlists';
        const favs = S.data.favoritos.filter(id => S.byId.has(id));
        html = `<div class="list-head"><button class="btn" data-act="newpl">${ICON.plus}Nova playlist</button></div>`;
        if (!q || norm('favoritas').includes(q)) {
          html += `<div class="row" data-nav="favs" data-key="favs"><div class="art row-art" style="background:linear-gradient(135deg,#ff8a3d,#d9447a);color:#fff">${ICON.heartFill}</div>
            <div class="row-text"><div class="row-title">Favoritas</div><div class="row-sub">${plural(favs.length, 'música', 'músicas')}</div></div><span class="chev">${ICON.chev}</span></div>`;
        }
        const pls = S.data.playlists.filter(p => !q || norm(p.nome).includes(q));
        html += pls.map(p => {
          const tl = p.faixas.map(id => S.byId.get(id)).filter(Boolean);
          return navRow('playlist', p.id, firstArt(tl), p.nome, plural(tl.length, 'música', 'músicas'), '', 'playlist');
        }).join('');
        if (!S.data.playlists.length) html += `<div class="info" style="padding:18px 16px">Crie playlists aqui ou pelo menu ⋯ de qualquer música. Elas ficam salvas no arquivo <b>_player.json</b> da sua pasta no OneDrive.</div>`;
        break;
      }
      case 'artist': {
        title = v.key;
        const all = S.tracks.filter(t => artistOf(t) === v.key);
        list = sortTracks(all, 'artist').filter(t => matches(t, q));
        html = detailHead(firstArt(all), v.key, plural(all.length, 'música', 'músicas'), 'round', 'artist') + list.map((t, i) => rowHtml(t, i, t.album || '')).join('');
        break;
      }
      case 'album': {
        const all = albumSort(S.tracks.filter(t => albumKey(t) === v.key));
        title = all[0] ? albumOf(all[0]) : 'Álbum';
        list = all.filter(t => matches(t, q));
        const yr = all.find(t => t.year);
        html = detailHead(firstArt(all), title, `${albumArtist(all)}${yr ? ' · ' + yr.year : ''} · ${plural(all.length, 'música', 'músicas')}`, '', 'album')
          + list.map((t, i) => rowHtml(t, i, artistOf(t))).join('');
        break;
      }
      case 'favs': {
        title = 'Favoritas';
        const all = S.data.favoritos.map(id => S.byId.get(id)).filter(Boolean);
        list = all.filter(t => matches(t, q));
        html = detailHead(firstArt(all), 'Favoritas', plural(all.length, 'música', 'músicas'), '', 'heart');
        html += list.length ? list.map((t, i) => rowHtml(t, i)).join('') : `<div class="empty"><p>Toque no ♡ no player para favoritar músicas.</p></div>`;
        break;
      }
      case 'playlist': {
        const p = Data.get(v.key);
        if (!p) { S.stack.pop(); return render({ nav: true }); }
        title = p.nome;
        const all = p.faixas.map(id => S.byId.get(id)).filter(Boolean);
        list = all.filter(t => matches(t, q));
        html = detailHead(firstArt(all), p.nome, plural(all.length, 'música', 'músicas'), '', 'playlist', `<button class="btn" data-act="plmenu">${ICON.more}</button>`);
        html += list.length ? list.map((t, i) => rowHtml(t, i)).join('') : `<div class="empty"><p>Playlist vazia. Use o menu ⋯ de uma música para adicionar.</p></div>`;
        break;
      }
    }

    S.list = list;
    content().innerHTML = html;
    $('#viewTitle').textContent = title;
    $('#btnBack').classList.toggle('hidden', S.stack.length < 2);
    if (opts.nav) window.scrollTo(0, v.scroll || 0);
  }
  function detailHead(art, title, sub, cls, icon, extra = '') {
    return `<div class="detail-head">${artHtml(art, cls, icon)}<div class="detail-info">
      <h2>${esc(title)}</h2><div class="muted small">${esc(sub)}</div>
      <div class="detail-actions">${playButtons()}${extra}</div></div></div>`;
  }
  function sourceLabel() {
    const v = S.stack[S.stack.length - 1];
    if (v.type === 'artist') return 'Artista: ' + v.key;
    if (v.type === 'album') return 'Álbum: ' + $('#viewTitle').textContent;
    if (v.type === 'playlist') return 'Playlist: ' + $('#viewTitle').textContent;
    if (v.type === 'favs') return 'Favoritas';
    return S.query ? 'Busca: ' + S.query : 'Biblioteca';
  }

  function push(view) {
    S.stack[S.stack.length - 1].scroll = window.scrollY;
    S.stack.push(view);
    clearSearch();
    render({ nav: true });
  }
  function back() {
    if (S.stack.length < 2) return;
    S.stack.pop();
    clearSearch();
    render({ nav: true });
  }
  function goTab(tab) {
    $$('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    S.stack = [{ type: tab }];
    clearSearch();
    render({ nav: true });
  }
  function clearSearch() { S.query = ''; $('#search').value = ''; }

  /* ---- player UI ---- */
  function updatePlayerUI(forceArt) {
    const t = Player.current();
    const playing = Player.isPlaying();
    document.body.classList.toggle('has-mini', !!t);
    $('#mini').classList.toggle('hidden', !t);
    if (!t) return;
    $('#miniTitle').textContent = t.title;
    $('#miniArtist').textContent = artistOf(t);
    $('#fTitle').textContent = t.title;
    $('#fArtist').textContent = artistOf(t) + (t.album ? ' — ' + t.album : '');
    $('#fSource').textContent = Player.source() || 'Tocando';
    $('#miniPlay').innerHTML = playing ? ICON.pause : ICON.play;
    $('#fPlay').innerHTML = playing ? ICON.pause : ICON.play;
    $('#full').classList.toggle('paused', !playing);
    const fav = Data.isFav(t.id);
    $('#fFav').innerHTML = fav ? ICON.heartFill : ICON.heart;
    $('#fFav').classList.toggle('on', fav);
    $('#fShuffle').classList.toggle('on', Player.shuffle());
    const rp = Player.repeat();
    $('#fRepeat').innerHTML = rp === 'one' ? ICON.repeat1 : ICON.repeat;
    $('#fRepeat').classList.toggle('on', rp !== 'off');

    const art = artOf(t);
    if (forceArt || lastArtId !== t.id + art) {
      lastArtId = t.id + art;
      $('#miniArt').outerHTML = artHtml(art, 'sm').replace('class="art sm"', 'class="art sm" id="miniArt"');
      $('#fArt').outerHTML = artHtml(art, 'xl').replace('class="art xl"', 'class="art xl" id="fArt"');
      $('#fullBg').style.backgroundImage = art ? `url("${art.replace(/"/g, '%22')}")` : 'none';
    }
    $$('.row.playing').forEach(r => r.classList.remove('playing'));
    $$(`.row[data-id="${CSS.escape(t.id)}"]`).forEach(r => r.classList.add('playing'));
    updateProgress();
  }
  function updateProgress() {
    const cur = Player.time() || 0;
    const dur = Player.duration();
    const d = isFinite(dur) && dur > 0 ? dur : (Player.current() && Player.current().duration) || 0;
    const pct = d ? Math.min(100, (cur / d) * 100) : 0;
    $('#miniBar').style.width = pct + '%';
    if (!seeking) {
      $('#fSeek').value = Math.round(pct * 10);
      $('#fSeek').style.setProperty('--p', pct + '%');
      $('#fCur').textContent = fmt(cur) || '0:00';
    }
    $('#fDur').textContent = fmt(d) || '0:00';
  }
  const openFull = () => { $('#full').classList.add('open'); $('#full').setAttribute('aria-hidden', 'false'); };
  const closeFull = () => { $('#full').classList.remove('open'); $('#full').setAttribute('aria-hidden', 'true'); };

  /* ---- folha de ações ---- */
  function openSheet(html, handler) {
    $('#sheet').innerHTML = '<div class="sheet-grip"></div>' + html;
    $('#sheetWrap').classList.remove('hidden');
    S.sheetHandler = handler;
  }
  function closeSheet() { $('#sheetWrap').classList.add('hidden'); S.sheetHandler = null; }
  const item = (a, icon, label, cls = '') => `<button class="sheet-item ${cls}" data-a="${a}">${ICON[icon] || ''}<span class="ellipsis">${esc(label)}</span></button>`;

  function trackMenu(t) {
    if (!t) return;
    const v = S.stack[S.stack.length - 1];
    const inPl = v.type === 'playlist' ? Data.get(v.key) : null;
    const fav = Data.isFav(t.id);
    openSheet(
      `<div class="sheet-head">${artHtml(artOf(t))}<div class="ellipsis"><div class="strong ellipsis">${esc(t.title)}</div><div class="muted small ellipsis">${esc(artistOf(t))}</div></div></div>` +
      item('next', 'playnext', 'Tocar a seguir') +
      item('queue', 'addq', 'Adicionar à fila') +
      item('fav', fav ? 'heartFill' : 'heart', fav ? 'Remover das favoritas' : 'Favoritar') +
      item('addpl', 'playlist', 'Adicionar à playlist…') +
      item('artist', 'artist', 'Ver artista') +
      item('album', 'album', 'Ver álbum') +
      (inPl ? item('rmpl', 'trash', 'Remover desta playlist', 'danger') : '') +
      `<div class="info">${esc(t.folder ? t.folder + '/' : '')}${esc(t.name)}</div>`,
      (a) => {
        if (a === 'next') { Player.playNext(t); toast('Vai tocar a seguir'); }
        if (a === 'queue') { Player.addToQueue(t); toast('Adicionada à fila'); }
        if (a === 'fav') { Data.toggleFav(t); updatePlayerUI(); if (v.type === 'favs') render(); }
        if (a === 'addpl') return playlistPicker([t.id]);
        if (a === 'artist') { closeSheet(); closeFull(); push({ type: 'artist', key: artistOf(t) }); return; }
        if (a === 'album') { closeSheet(); closeFull(); push({ type: 'album', key: albumKey(t) }); return; }
        if (a === 'rmpl') { Data.removeFrom(inPl, t.id); render(); toast('Removida da playlist'); }
        closeSheet();
      }
    );
  }
  function playlistPicker(ids) {
    openSheet(
      `<div class="sheet-title">Adicionar à playlist</div>` + item('new', 'plus', 'Nova playlist…') +
      S.data.playlists.map(p => item('p:' + p.id, 'playlist', p.nome)).join(''),
      (a) => {
        if (a === 'new') {
          const nome = (prompt('Nome da nova playlist:') || '').trim();
          if (!nome) return;
          Data.addTo(Data.createPlaylist(nome), ids);
        } else Data.addTo(Data.get(a.slice(2)), ids);
        closeSheet(); render();
      }
    );
  }
  function playlistMenu(p) {
    openSheet(`<div class="sheet-title">${esc(p.nome)}</div>` + item('ren', 'edit', 'Renomear') + item('del', 'trash', 'Excluir playlist', 'danger'), (a) => {
      if (a === 'ren') { const n = (prompt('Novo nome:', p.nome) || '').trim(); if (n) { Data.rename(p, n); render(); } }
      if (a === 'del' && confirm(`Excluir a playlist "${p.nome}"? As músicas não são apagadas.`)) { Data.remove(p); back(); }
      closeSheet();
    });
  }
  function queueSheet() {
    const q = Player.queue(), cur = Player.index();
    if (!q.length) return toast('A fila está vazia');
    const start = Math.max(0, cur - 3);
    openSheet(`<div class="sheet-title">Fila de reprodução <span class="muted small">(${q.length})</span></div>` +
      q.slice(start, start + 200).map((t, k) => {
        const i = start + k;
        return `<button class="sheet-item ${i === cur ? 'current' : ''}" data-a="${i}">${i === cur ? ICON.play : `<span style="width:22px;text-align:center;color:var(--muted);font-size:13px">${i + 1}</span>`}<span class="ellipsis">${esc(t.title)} <span class="muted small">· ${esc(artistOf(t))}</span></span></button>`;
      }).join(''),
      (a) => { Player.jump(+a); closeSheet(); });
  }
  async function settingsSheet() {
    const last = S.lastScan ? new Date(S.lastScan).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';
    openSheet(
      `<div class="sheet-title">Configurações</div>
       <div class="info">Conta: <b id="accName">${esc(S.user ? (S.user.displayName + ' — ' + (S.user.mail || S.user.userPrincipalName || '')) : 'carregando…')}</b></div>
       <div class="field"><label class="small muted" for="folderInp">Pasta das músicas no OneDrive</label>
         <input id="folderInp" value="${esc(folder())}" placeholder="Musicas" autocapitalize="off" autocorrect="off"></div>
       <div class="field-actions"><button class="btn primary" data-a="savefolder">Salvar pasta</button></div>
       <div class="info">${plural(S.tracks.length, 'música', 'músicas')} · última atualização às ${last}</div>
       <div class="sheet-section">Biblioteca</div>
       ${item('rescan', 'refresh', 'Atualizar biblioteca agora')}
       ${item('clearmeta', 'trash', 'Limpar cache de capas e tags')}
       <div class="sheet-section">Conta</div>
       ${item('logout', 'logout', 'Sair', 'danger')}
       <div class="info tiny">Endereço desta página (usado no registro do app): ${esc(Auth.redirectUri())}</div>`,
      async (a) => {
        if (a === 'savefolder') {
          const f = ($('#folderInp').value || '').trim().replace(/^\/+|\/+$/g, '');
          if (!f) return toast('Informe o nome da pasta');
          lsSet('mp_folder', f);
          closeSheet();
          setTracks([]); lsSet('mp_lib', []); render();
          await Data.load().catch(() => {});
          scan();
          return;
        }
        if (a === 'rescan') { closeSheet(); scan(); return; }
        if (a === 'clearmeta') {
          await MetaDB.clear().catch(() => {});
          S.meta.clear(); S.tracks.forEach(t => { delete t.art; });
          closeSheet(); toast('Cache limpo'); scan(); return;
        }
        if (a === 'logout') {
          if (!confirm('Sair da sua conta Microsoft neste aparelho?')) return;
          Player.audio.pause();
          Auth.logout();
          closeSheet();
          showLogin();
        }
      }
    );
    if (!S.user) {
      try { S.user = await OneDrive.me(); const el = $('#accName'); if (el) el.textContent = `${S.user.displayName} — ${S.user.mail || S.user.userPrincipalName || ''}`; } catch {}
    }
  }

  /* ---- varredura do OneDrive ---- */
  async function scan({ silent = false } = {}) {
    if (S.scanning) return;
    S.scanning = true;
    if (!silent) { $('#scanBar').classList.remove('hidden'); $('#scanText').textContent = 'Procurando músicas…'; }
    $('#btnRefresh').style.opacity = .5;
    if (!S.tracks.length) render();
    try {
      const list = await OneDrive.scan(folder(), n => { $('#scanText').textContent = `Procurando músicas… ${n}`; });
      S.folderMissing = false;
      const before = new Set(S.tracks.map(t => t.id));
      lsSet('mp_lib', list);
      setTracks(list);
      S.lastScan = Date.now();
      const novas = list.filter(t => !before.has(t.id)).length;
      if (before.size && novas) toast(`${plural(novas, 'nova música', 'novas músicas')} na biblioteca`);
      else if (!silent && before.size) toast('Biblioteca atualizada');
      Player.relink();
      Enrich.run();
    } catch (e) {
      if (e.name === 'AuthError') return authFail();
      if (e.code === 'notFound') { S.folderMissing = true; setTracks([]); }
      else if (!silent) toast(navigator.onLine ? 'Erro ao ler o OneDrive: ' + e.message : 'Sem internet');
    } finally {
      S.scanning = false;
      $('#scanBar').classList.add('hidden');
      $('#btnRefresh').style.opacity = '';
      render();
      updatePlayerUI(true);
    }
  }

  /* ---- telas ---- */
  function showLogin(msg) {
    $('#app').classList.add('hidden');
    closeFull();
    $('#login').classList.remove('hidden');
    $('#loginTitle').textContent = CONFIG.APP_NAME || 'Minhas Músicas';
    const box = $('#loginMsg');
    if (!Auth.configured()) {
      box.innerHTML = `<b>Falta configurar.</b> Abra <code>js/config.js</code> e cole o <b>ID do aplicativo</b> do Microsoft Entra em <code>CLIENT_ID</code>.<br><br>Endereço de redirecionamento a cadastrar (tipo SPA):<br><code>${esc(Auth.redirectUri())}</code>`;
      box.classList.remove('hidden');
      $('#btnLogin').disabled = true; $('#btnLogin').style.opacity = .5;
    } else if (msg) {
      box.textContent = msg; box.classList.remove('hidden');
    } else box.classList.add('hidden');
  }
  function showApp() {
    $('#login').classList.add('hidden');
    $('#app').classList.remove('hidden');
    document.title = CONFIG.APP_NAME || 'Minhas Músicas';
  }
  function authFail() {
    Auth.logout();
    showLogin('Sua sessão expirou. Entre novamente.');
  }

  /* ---- eventos ---- */
  function bind() {
    $('#btnLogin').addEventListener('click', () => Auth.login());
    $('#btnBack').addEventListener('click', back);
    $('#btnRefresh').addEventListener('click', () => scan());
    $('#btnSettings').addEventListener('click', settingsSheet);
    $$('.tabbar button').forEach(b => b.addEventListener('click', () => goTab(b.dataset.tab)));
    $('#search').addEventListener('input', debounce(e => { S.query = e.target.value; render(); }, 120));

    content().addEventListener('click', (e) => {
      const more = e.target.closest('[data-more]');
      if (more) { trackMenu(S.list[+more.dataset.more]); return; }
      const act = e.target.closest('[data-act]');
      if (act) { Player.unlock(); return doAct(act.dataset.act); }
      const nav = e.target.closest('[data-nav]');
      if (nav) { push({ type: nav.dataset.nav, key: nav.dataset.key }); return; }
      const row = e.target.closest('.row[data-i]');
      if (row) { Player.unlock(); Player.playList(S.list, +row.dataset.i, { source: sourceLabel() }); }
    });
    content().addEventListener('change', (e) => {
      if (e.target.id === 'sortSel') { S.sort = e.target.value; lsSet('mp_sort', S.sort); render(); }
    });

    $('#miniOpen').addEventListener('click', (e) => {
      if (e.target.closest('#miniPlay')) { Player.unlock(); Player.toggle(); return; }
      if (e.target.closest('#miniNext')) { Player.unlock(); Player.next(); return; }
      openFull();
    });
    $('#fClose').addEventListener('click', closeFull);
    $('#fPlay').addEventListener('click', () => { Player.unlock(); Player.toggle(); });
    $('#fNext').addEventListener('click', () => { Player.unlock(); Player.next(); });
    $('#fPrev').addEventListener('click', () => { Player.unlock(); Player.prev(); });
    $('#fShuffle').addEventListener('click', () => Player.toggleShuffle());
    $('#fRepeat').addEventListener('click', () => Player.cycleRepeat());
    $('#fFav').addEventListener('click', () => { const t = Player.current(); if (t) { Data.toggleFav(t); updatePlayerUI(); } });
    $('#fMore').addEventListener('click', () => trackMenu(Player.current()));
    $('#fQueue').addEventListener('click', queueSheet);
    const seek = $('#fSeek');
    seek.addEventListener('input', () => {
      seeking = true;
      const d = Player.duration() || (Player.current() && Player.current().duration) || 0;
      seek.style.setProperty('--p', seek.value / 10 + '%');
      $('#fCur').textContent = fmt(d * seek.value / 1000) || '0:00';
    });
    seek.addEventListener('change', () => {
      const d = Player.duration();
      if (isFinite(d) && d > 0) Player.seekTo(d * seek.value / 1000);
      seeking = false;
    });

    // arrastar o player para baixo fecha
    let y0 = null;
    $('#full').addEventListener('touchstart', e => { if (!e.target.closest('input')) y0 = e.touches[0].clientY; }, { passive: true });
    $('#full').addEventListener('touchend', e => { if (y0 != null && e.changedTouches[0].clientY - y0 > 110) closeFull(); y0 = null; }, { passive: true });

    $('#sheetWrap').addEventListener('click', (e) => {
      if (e.target.id === 'sheetWrap') return closeSheet();
      const it = e.target.closest('[data-a]');
      if (it && S.sheetHandler) S.sheetHandler(it.dataset.a, it);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && Auth.isLogged() && Date.now() - S.lastScan > 2 * 60000) scan({ silent: true });
    });
    setInterval(() => { if (!document.hidden && Auth.isLogged()) scan({ silent: true }); }, 5 * 60000);
  }

  async function doAct(a) {
    if (a === 'playall' || a === 'shuffleall') {
      if (!S.list.length) return;
      Player.playList(S.list, a === 'shuffleall' ? -1 : 0, { shuffle: a === 'shuffleall', source: sourceLabel() });
    }
    if (a === 'newpl') {
      const nome = (prompt('Nome da nova playlist:') || '').trim();
      if (nome) { Data.createPlaylist(nome); render(); }
    }
    if (a === 'plmenu') { const v = S.stack[S.stack.length - 1]; const p = Data.get(v.key); if (p) playlistMenu(p); }
    if (a === 'refresh') scan();
    if (a === 'settings') settingsSheet();
    if (a === 'createfolder') {
      try { await OneDrive.ensureFolder(folder()); toast('Pasta criada'); S.folderMissing = false; scan(); }
      catch (e) { e.name === 'AuthError' ? authFail() : toast('Não foi possível criar: ' + e.message); }
    }
  }

  /* ---- início ---- */
  async function init() {
    applyIcons();
    bind();
    Player.onChange(() => updatePlayerUI());
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

    try { await Auth.handleRedirect(); }
    catch (e) { showLogin(e.message); return; }

    if (!Auth.configured() || !Auth.isLogged()) { showLogin(); return; }

    showApp();
    try { S.meta = await MetaDB.all(); } catch { S.meta = new Map(); }
    setTracks(lsGet('mp_lib', []));
    render();
    Player.restore();
    updatePlayerUI(true);
    Data.load().then(() => render()).catch(e => { if (e.name === 'AuthError') authFail(); });
    scan({ silent: S.tracks.length > 0 });
  }

  return { init, render, updatePlayerUI, updateProgress, authFail, scan };
})();

App.init();
