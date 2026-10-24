/* =========================================================
   CONFIGURAÇÃO DO PLAYER
   Edite apenas este arquivo (veja o LEIA-ME.md).
   ========================================================= */
window.CONFIG = {
  // "ID do aplicativo (cliente)" copiado do registro no Microsoft Entra
  CLIENT_ID: 'COLE_AQUI_O_ID_DO_APLICATIVO',

  // 'common'    -> registro com "contas pessoais + organizacionais" (recomendado)
  // 'consumers' -> registro com "somente contas pessoais da Microsoft"
  TENANT: 'common',

  // Pasta do OneDrive onde ficam as músicas (a partir da raiz).
  // Ex.: 'Musicas' ou 'Documentos/Musicas'. Pode ser alterada também nas Configurações do app.
  FOLDER: 'Musicas',

  // Deixe vazio: o endereço da própria página é usado automaticamente.
  // Só preencha se o login reclamar de "redirect_uri" diferente.
  REDIRECT_URI: '',

  // Nome exibido no topo
  APP_NAME: 'Minhas Músicas'
};
