# MangaVerse

Leitor de mangás, manhwas e manhuas em português com dados do [MangaDex](https://mangadex.org). Front-end em React e um pequeno proxy em Node que respeita os limites e regras de uso da API.

## Funcionalidades

- Catálogo com busca por título, ordenação (recentes / populares) e filtro por tipo (mangá, manhwa, manhua)
- Página da série com sinopse, autores, gêneros e lista de capítulos em pt-br
- Leitor de capítulos com as páginas servidas pelo MangaDex@Home
- Crédito ao MangaDex e aos grupos de scan em cada capítulo; grupos que pedirem remoção vão em `BLOCKED_GROUPS` no `server.js`

## Como funciona

O navegador não pode chamar a API nem as imagens do MangaDex direto (sem CORS e com hotlink bloqueado), então o `server.js` faz o meio de campo:

- `GET /api/list`, `/api/manga/:id`, `/api/chapter/:id` — normaliza a resposta da API
- `GET /api/img?u=` — proxy de imagens, só para domínios do MangaDex
- Cache em memória e throttle (~4 req/s na API, ~37/min no at-home); nunca re-tenta em 429
- Reporta o resultado de cada imagem ao MD@Home, como a documentação exige

## Tecnologias

React 18, React Router 6, Vite 5, CSS Modules, Node.js (`http` nativo, sem dependências no back).

## Como rodar

Requer Node 18+.

```bash
npm install
npm run api   # proxy em http://localhost:8787
npm run dev   # front em http://localhost:5173 (repassa /api para o proxy)
```

A porta do proxy pode ser trocada com `PORT`.
