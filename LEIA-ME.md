# Minhas Músicas — player web com OneDrive

Player de músicas que lê uma pasta do seu OneDrive. Você coloca os arquivos na pasta e eles aparecem no app automaticamente. Não tem servidor, banco de dados nem custo.

- **Músicas**: ficam no seu OneDrive (pasta `Musicas`, ou a que você escolher).
- **Playlists e favoritas**: ficam no arquivo `_player.json` dentro dessa mesma pasta, sincronizadas entre os aparelhos.
- **Site**: páginas estáticas (HTML/JS) hospedadas grátis no GitHub Pages.
- **iPhone**: abra o site no Safari e use "Adicionar à Tela de Início". Ele vira um app, com controle na tela de bloqueio.

---

## Passo 1 — Pasta no OneDrive

Crie a pasta **`Musicas`** na raiz do seu OneDrive e coloque nela seus arquivos **MP3** ou **M4A**.

- Pode organizar em subpastas, por exemplo `Musicas/Artista/Álbum/01 - Faixa.mp3`.
- Arquivos sem tags são lidos pelo nome. O formato `Artista - Título.mp3` vira artista e título automaticamente.
- Pastas que começam com `_` ou `.` são ignoradas.
- Formatos que o iPhone toca: MP3, M4A/AAC, ALAC, WAV, FLAC. Prefira **MP3 ou M4A**.

## Passo 2 — Publicar o site (grátis)

### Opção A: GitHub Pages (recomendado)

1. Crie uma conta em https://github.com (grátis).
2. Clique em **New repository**, dê um nome (ex.: `musicas`) e marque **Public**.
   - O repositório público não expõe nada: o código não tem senhas, e as músicas continuam no seu OneDrive.
3. Clique em **uploading an existing file** e arraste **todo o conteúdo desta pasta** (o `index.html` precisa ficar na raiz do repositório). Clique em **Commit changes**.
4. Vá em **Settings → Pages**. Em *Branch*, escolha **main** e **/(root)** e clique em **Save**.
5. Em cerca de 1 minuto o site estará em:
   `https://SEU-USUARIO.github.io/musicas/`
   Anote esse endereço **com a barra no final**.

### Opção B: Netlify Drop

Acesse https://app.netlify.com/drop e arraste a pasta. Ele gera um endereço `https://algo.netlify.app/`. Para não expirar, crie uma conta grátis.

## Passo 3 — Registrar o app na Microsoft (grátis)

O login exige um "registro de aplicativo" no Microsoft Entra. **Uma conta pessoal (Outlook/Hotmail) sozinha não consegue criar esse registro.** Antes, crie uma **conta gratuita do Azure** em https://azure.microsoft.com/free com o mesmo e-mail.

- O cadastro pede cartão só para verificar a identidade.
- O registro de app **não gera cobrança**, nem depois que acaba o período de teste do Azure.
- Não ative nenhum serviço pago.

Depois:

1. Acesse https://entra.microsoft.com → **Aplicativos** → **Registros de aplicativo** → **Novo registro**.
2. **Nome**: `Minhas Músicas`.
3. **Tipos de conta com suporte**: *Contas em qualquer diretório organizacional e contas pessoais da Microsoft*.
4. **URI de redirecionamento**: escolha a plataforma **Aplicativo de página única (SPA)** e cole o endereço do Passo 2, com a barra no final.
   Ex.: `https://SEU-USUARIO.github.io/musicas/`
5. Clique em **Registrar**.
6. Na tela que abrir, copie o **ID do aplicativo (cliente)**, um código como `1a2b3c4d-....`.
7. (Opcional) Em **Permissões de API → Adicionar → Microsoft Graph → Permissões delegadas**, adicione `Files.ReadWrite`, `User.Read` e `offline_access`. O app pede essas permissões no primeiro login de qualquer forma.

> Se no item 3 você escolher "Somente contas pessoais da Microsoft", troque `TENANT: 'common'` por `TENANT: 'consumers'` no `config.js`.

## Passo 4 — Configurar

Abra `js/config.js` e cole o ID do aplicativo:

```js
CLIENT_ID: '1a2b3c4d-....',
FOLDER: 'Musicas',
```

Envie o `config.js` alterado para o GitHub: abra o arquivo no repositório, clique no lápis ✏️, cole e clique em *Commit*. Espere cerca de 1 minuto.

## Passo 5 — Instalar no iPhone

1. Abra o endereço do site no **Safari**.
2. Toque em **Entrar com Microsoft** e autorize o acesso aos arquivos.
3. Toque em **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início**.
4. A partir daí, abra pelo ícone. **Faça o login também pelo ícone**, porque o app instalado guarda o login separado do Safari.

---

## Como usar

- **Adicionar músicas**: jogue os arquivos na pasta do OneDrive, pelo PC, pelo app do OneDrive ou pelo app Arquivos do iPhone. O player verifica a pasta ao abrir, ao voltar para o app (após 2 min) e a cada 5 min com ele aberto. Para atualizar na hora, toque em ⟳.
- **Tocar**: toque na música. **Tocar** ou **Aleatório** tocam a lista inteira.
- **Menu ⋯**: tocar a seguir, adicionar à fila, favoritar, adicionar à playlist, ver artista ou álbum.
- **Player completo**: toque no mini player. Arraste para baixo para fechar.
- **Configurações** (⚙): trocar a pasta, atualizar a biblioteca, limpar o cache de capas, sair.

## Bom saber

- **Capas e tags**: o OneDrive costuma fornecer título, artista, álbum e capa de MP3/M4A. Quando não fornece, o app lê as tags do próprio arquivo em segundo plano e guarda no aparelho.
- **Sem internet**: o app abre e mostra a biblioteca, mas a música vem do OneDrive por streaming, então precisa de conexão.
- **Tela bloqueada**: a música continua tocando e aparece na tela de bloqueio com capa e controles.
- **Login**: a Microsoft renova a sessão automaticamente. Às vezes, depois de uns dias sem uso, ela pede para entrar de novo, com um toque.
- **Atualizar o app**: troque os arquivos no GitHub. O app pega a versão nova na próxima abertura.

## Problemas comuns

| Mensagem | Solução |
|---|---|
| `AADSTS50011` / redirect_uri não corresponde | O endereço cadastrado no Passo 3 precisa ser **idêntico** ao do site, inclusive a barra final e o `https`. |
| `AADSTS700016` / aplicativo não encontrado | O `CLIENT_ID` no `config.js` está errado, ou o tipo de conta não aceita contas pessoais (veja o `TENANT`). |
| `AADSTS9002326` / cross-origin | A plataforma do redirecionamento foi cadastrada como **Web**. Apague e cadastre como **Aplicativo de página única (SPA)**. |
| "Pasta não encontrada" | Crie a pasta pelo botão do app ou ajuste o nome em ⚙ Configurações. |
| Uma música não toca | Formato não suportado pelo iPhone (ex.: OGG/Opus antigos). Converta para MP3/M4A. |

## Arquivos

```
index.html            página do app
css/style.css         visual
js/config.js          ← única coisa que você edita
js/auth.js            login Microsoft (PKCE, sem senha guardada)
js/onedrive.js        leitura da pasta / playlists no OneDrive
js/app.js             interface e player
sw.js                 cache do app para abrir rápido
manifest.webmanifest  instalação como app
icons/                ícones
```
