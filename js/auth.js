/* Login Microsoft (OAuth 2.0 Authorization Code + PKCE) sem bibliotecas externas */
class AuthError extends Error { constructor(msg) { super(msg || 'Sessão expirada'); this.name = 'AuthError'; } }

const Auth = (() => {
  const SCOPES = 'openid profile offline_access User.Read Files.ReadWrite';
  const KEY = 'mp_tokens';
  const PKCE_KEY = 'mp_pkce';
  const base = () => `https://login.microsoftonline.com/${CONFIG.TENANT || 'common'}/oauth2/v2.0`;
  const redirectUri = () => CONFIG.REDIRECT_URI || (location.origin + location.pathname);

  const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const randomStr = (n = 48) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return b64url(a); };
  const sha256 = (s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const save = (t) => localStorage.setItem(KEY, JSON.stringify(t));

  function configured() {
    return CONFIG.CLIENT_ID && !/COLE_AQUI/.test(CONFIG.CLIENT_ID);
  }

  async function login() {
    const verifier = randomStr(64);
    const state = randomStr(16);
    localStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state }));
    const challenge = b64url(await sha256(verifier));
    const p = new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      response_type: 'code',
      redirect_uri: redirectUri(),
      response_mode: 'query',
      scope: SCOPES,
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });
    location.assign(`${base()}/authorize?${p}`);
  }

  async function tokenRequest(params) {
    const body = new URLSearchParams({ client_id: CONFIG.CLIENT_ID, scope: SCOPES, ...params });
    const r = await fetch(`${base()}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(j.error_description || j.error || 'Falha ao obter token');
      e.code = j.error || 'http_' + r.status;
      throw e;
    }
    const t = {
      access: j.access_token,
      refresh: j.refresh_token || params.refresh_token || null,
      exp: Date.now() + ((j.expires_in || 3600) - 120) * 1000
    };
    save(t);
    return t;
  }

  /** Trata o retorno do login (?code=...). Retorna true se havia retorno. */
  async function handleRedirect() {
    const url = new URL(location.href);
    const code = url.searchParams.get('code');
    const err = url.searchParams.get('error');
    if (!code && !err) return false;
    history.replaceState(null, '', url.pathname);
    if (err) throw new Error(url.searchParams.get('error_description') || err);
    let pk = null;
    try { pk = JSON.parse(localStorage.getItem(PKCE_KEY)); } catch {}
    localStorage.removeItem(PKCE_KEY);
    if (!pk || pk.state !== url.searchParams.get('state')) {
      throw new Error('Não foi possível concluir o login (estado inválido). Tente entrar novamente.');
    }
    await tokenRequest({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      code_verifier: pk.verifier
    });
    return true;
  }

  let refreshing = null;
  /** Devolve um access token válido (renovando se preciso). Lança AuthError se precisar logar de novo. */
  async function getToken() {
    const t = load();
    if (!t) throw new AuthError();
    if (t.exp > Date.now()) return t.access;
    if (!t.refresh) throw new AuthError();
    if (!refreshing) {
      refreshing = tokenRequest({ grant_type: 'refresh_token', refresh_token: t.refresh })
        .finally(() => { refreshing = null; });
    }
    try {
      return (await refreshing).access;
    } catch (e) {
      // Erro de rede: não desloga. Token inválido/expirado: precisa entrar de novo.
      if (e.code && /invalid_grant|interaction_required|invalid_client|unauthorized_client/.test(e.code)) {
        localStorage.removeItem(KEY);
        throw new AuthError();
      }
      throw e;
    }
  }

  function logout() { localStorage.removeItem(KEY); }
  function isLogged() { return !!load(); }

  return { login, logout, handleRedirect, getToken, isLogged, configured, redirectUri };
})();
