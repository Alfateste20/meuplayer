/* Acesso ao OneDrive via Microsoft Graph */
const OneDrive = (() => {
  const API = 'https://graph.microsoft.com/v1.0';
  const AUDIO_EXT = ['mp3', 'm4a', 'aac', 'flac', 'wav', 'ogg', 'opus', 'webm', 'alac', 'aiff', 'aif'];

  const enc = (path) => path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
  const ext = (name) => (name.split('.').pop() || '').toLowerCase();

  async function req(path, opts = {}, retry = true) {
    const token = await Auth.getToken();
    const r = await fetch(path.startsWith('http') ? path : API + path, {
      ...opts,
      headers: { Authorization: 'Bearer ' + token, ...(opts.headers || {}) }
    });
    if (r.status === 401) {
      if (retry) {
        // força renovação e tenta de novo uma vez
        const t = JSON.parse(localStorage.getItem('mp_tokens') || 'null');
        if (t) { t.exp = 0; localStorage.setItem('mp_tokens', JSON.stringify(t)); }
        return req(path, opts, false);
      }
      throw new AuthError();
    }
    if (r.status === 404) { const e = new Error('Não encontrado'); e.code = 'notFound'; throw e; }
    if (r.status === 429 || r.status === 503) {
      const wait = (parseInt(r.headers.get('Retry-After') || '3', 10)) * 1000;
      await new Promise(res => setTimeout(res, wait));
      return req(path, opts, retry);
    }
    if (!r.ok) {
      let msg = 'Erro ' + r.status;
      try { const j = await r.json(); msg = j.error?.message || msg; } catch {}
      throw new Error(msg);
    }
    if (r.status === 204) return null;
    return r.json();
  }

  async function me() { return req('/me?$select=displayName,userPrincipalName,mail'); }

  async function listChildren(path) {
    let url = path
      ? `/me/drive/root:/${enc(path)}:/children?$top=200&$expand=thumbnails`
      : `/me/drive/root/children?$top=200&$expand=thumbnails`;
    const out = [];
    while (url) {
      const j = await req(url);
      out.push(...(j.value || []));
      url = j['@odata.nextLink'] || null;
    }
    return out;
  }

  function parseFileName(name) {
    let base = name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
    base = base.replace(/^\d{1,3}\s*[-.)]\s*/, '');           // "01 - " / "01. "
    base = base.replace(/\s*[\[(](official|video|audio|lyric|lyrics|clipe|oficial|hd|4k)[^\])]*[\])]/gi, '');
    const parts = base.split(/\s+[-–—]\s+/);
    if (parts.length >= 2) return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
    return { artist: '', title: base };
  }

  function toTrack(it, folderRel) {
    const a = it.audio || {};
    const f = parseFileName(it.name);
    const th = it.thumbnails && it.thumbnails[0];
    const folderName = folderRel ? folderRel.split('/').pop() : '';
    return {
      id: it.id,
      name: it.name,
      folder: folderRel,
      title: a.title || f.title || it.name,
      artist: a.artist || a.albumArtist || f.artist || '',
      album: a.album || '',
      folderName,
      duration: a.duration ? a.duration / 1000 : 0,
      track: a.track || 0,
      year: a.year || 0,
      genre: a.genre || '',
      thumb: th ? (th.large?.url || th.medium?.url || th.small?.url || '') : '',
      size: it.size || 0,
      modified: it.lastModifiedDateTime,
      added: it.createdDateTime || it.lastModifiedDateTime,
      hasTags: !!(a.title || a.artist)
    };
  }

  /** Varre a pasta (e subpastas) e devolve a lista de faixas */
  async function scan(root, onProgress) {
    const tracks = [];
    const queue = [''];
    while (queue.length) {
      const rel = queue.shift();
      const full = [root, rel].filter(Boolean).join('/');
      const items = await listChildren(full);
      for (const it of items) {
        if (it.folder) {
          if (!/^[._]/.test(it.name)) queue.push([rel, it.name].filter(Boolean).join('/'));
        } else if (it.file && (AUDIO_EXT.includes(ext(it.name)) || (it.file.mimeType || '').startsWith('audio/'))) {
          tracks.push(toTrack(it, rel));
        }
      }
      onProgress && onProgress(tracks.length);
    }
    return tracks;
  }

  /** URL temporária (pré-autenticada, ~1h) para tocar/baixar o arquivo */
  async function downloadUrl(id) {
    const j = await req(`/me/drive/items/${encodeURIComponent(id)}`);
    const u = j['@microsoft.graph.downloadUrl'];
    if (!u) throw new Error('Arquivo sem link de download');
    return u;
  }

  async function readJson(path) {
    try {
      const j = await req(`/me/drive/root:/${enc(path)}`);
      const u = j['@microsoft.graph.downloadUrl'];
      if (!u) return null;
      const r = await fetch(u, { cache: 'no-store' });
      return r.ok ? r.json() : null;
    } catch (e) {
      if (e.code === 'notFound') return null;
      throw e;
    }
  }

  async function writeJson(path, data) {
    return req(`/me/drive/root:/${enc(path)}:/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data, null, 1)
    });
  }

  /** Cria a pasta (e as intermediárias) se não existir */
  async function ensureFolder(path) {
    const parts = path.split('/').filter(Boolean);
    let parent = '';
    for (const name of parts) {
      const cur = [parent, name].filter(Boolean).join('/');
      try {
        await req(`/me/drive/root:/${enc(cur)}`);
      } catch (e) {
        if (e.code !== 'notFound') throw e;
        const url = parent ? `/me/drive/root:/${enc(parent)}:/children` : '/me/drive/root/children';
        await req(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, folder: {}, '@microsoft.graph.conflictBehavior': 'fail' })
        });
      }
      parent = cur;
    }
  }

  return { me, scan, downloadUrl, readJson, writeJson, ensureFolder };
})();
