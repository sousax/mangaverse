// Proxy do MangaDex: o navegador não pode chamar a API nem as imagens direto (sem CORS, hotlink bloqueado).
// Regras de uso: https://api.mangadex.org/docs/ — sem anúncios, creditar MangaDex e grupos, ~5 req/s, at-home 40/min.
import http from "node:http";

const PORT = process.env.PORT || 8787;
const API = "https://api.mangadex.org";
const UA = "MangaVerse/0.1";
const LANG = "pt-br";
// Grupos que pediram remoção (obrigatório honrar). Adicione o ID do grupo no MangaDex.
const BLOCKED_GROUPS = new Set([]);

// ponytail: cache em memória por processo, trocar por Redis se rodar mais de uma instância
const cache = new Map();
async function cached(key, ttlMs, fn) {
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return hit.val;
  const val = await fn();
  cache.set(key, { val, exp: Date.now() + ttlMs });
  if (cache.size > 2000) cache.delete(cache.keys().next().value);
  return val;
}

// Espaça as chamadas para ficar abaixo dos limites. Nunca re-tenta em 429: insistir leva a ban de IP.
function throttle(gapMs) {
  let next = 0;
  return () => {
    const now = Date.now();
    const at = Math.max(now, next);
    next = at + gapMs;
    return new Promise((r) => setTimeout(r, at - now));
  };
}
const apiSlot = throttle(250); // 4 req/s
const atHomeSlot = throttle(1600); // ~37 req/min

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function md(path, params = [], slot = apiSlot) {
  await slot();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}${path}${qs ? `?${qs}` : ""}`, { headers: { "User-Agent": UA } });
  if (res.status === 429) throw new HttpError(503, "MangaDex está limitando as requisições, tente em instantes");
  if (res.status === 404) throw new HttpError(404, "Não encontrado");
  if (!res.ok) throw new HttpError(502, `MangaDex respondeu ${res.status}`);
  return res.json();
}

const img = (url) => `/api/img?u=${encodeURIComponent(url)}`;
const rel = (o, type) => o.relationships.filter((r) => r.type === type);

function manga(m) {
  const a = m.attributes;
  const file = rel(m, "cover_art")[0]?.attributes?.fileName;
  return {
    id: m.id,
    title: a.altTitles.find((t) => t[LANG])?.[LANG] ?? a.title.en ?? Object.values(a.title)[0],
    description: (a.description[LANG] ?? a.description.en ?? "").split(/\n-{3,}/)[0]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/(\*\*|__)/g, "")
      .trim(),
    cover: file ? img(`https://uploads.mangadex.org/covers/${m.id}/${file}.512.jpg`) : null,
    tags: a.tags.filter((t) => t.attributes.group === "genre").map((t) => t.attributes.name.en),
    status: a.status,
    year: a.year,
    originalLanguage: a.originalLanguage,
    authors: rel(m, "author").map((r) => r.attributes?.name).filter(Boolean),
    artists: rel(m, "artist").map((r) => r.attributes?.name).filter(Boolean),
  };
}

function chapter(c) {
  const g = rel(c, "scanlation_group")[0];
  return {
    id: c.id,
    chapter: c.attributes.chapter,
    title: c.attributes.title,
    group: g?.attributes?.name ?? "Sem grupo",
    groupId: g?.id,
    readableAt: c.attributes.readableAt,
  };
}
const readable = (c) => !c.attributes.externalUrl && c.attributes.pages > 0 && !c.attributes.isUnavailable;
const allowed = (c) => !BLOCKED_GROUPS.has(c.groupId);

const ORDERS = { latest: "latestUploadedChapter", popular: "followedCount" };
const ORIGINS = { manga: "ja", manhwa: "ko", manhua: "zh" };

async function list(q) {
  const limit = Math.min(Number(q.get("limit")) || 24, 48);
  const offset = Math.min(Math.max(Number(q.get("offset")) || 0, 0), 9000);
  const search = q.get("q")?.trim();
  const params = [
    ["limit", limit],
    ["offset", offset],
    ["includes[]", "cover_art"],
    ["availableTranslatedLanguage[]", LANG],
    ["hasAvailableChapters", "true"],
    ["contentRating[]", "safe"],
    ["contentRating[]", "suggestive"],
  ];
  if (search) params.push(["title", search], ["order[relevance]", "desc"]);
  else params.push([`order[${ORDERS[q.get("order")] ?? ORDERS.latest}]`, "desc"]);
  if (ORIGINS[q.get("type")]) params.push(["originalLanguage[]", ORIGINS[q.get("type")]]);

  const r = await md("/manga", params);
  const items = r.data.map(manga);
  if (q.get("order") === "popular" && items.length) {
    const s = await md("/statistics/manga", items.map((m) => ["manga[]", m.id]));
    items.forEach((m) => (m.follows = s.statistics[m.id]?.follows ?? 0));
  }
  return { total: Math.min(r.total, 10000), offset, limit, items };
}

async function mangaDetail(id) {
  const [m, chapters] = await Promise.all([
    md(`/manga/${id}`, [["includes[]", "cover_art"], ["includes[]", "author"], ["includes[]", "artist"]]),
    feed(id),
  ]);
  return { ...manga(m.data), chapters };
}

async function feed(id) {
  const out = [];
  const seen = new Set();
  // ponytail: até 2000 capítulos; uma versão por número de capítulo (fica a do grupo mais recente)
  for (let offset = 0; offset < 2000; offset += 500) {
    const r = await md(`/manga/${id}/feed`, [
      ["translatedLanguage[]", LANG],
      ["order[chapter]", "desc"],
      ["order[readableAt]", "desc"],
      ["limit", 500],
      ["offset", offset],
      ["includes[]", "scanlation_group"],
    ]);
    for (const c of r.data.filter(readable).map(chapter).filter(allowed)) {
      const key = c.chapter ?? c.id;
      if (!seen.has(key)) seen.add(key), out.push(c);
    }
    if (offset + 500 >= r.total) break;
  }
  return out;
}

async function chapterPages(id) {
  const [c, home] = await Promise.all([
    md(`/chapter/${id}`, [["includes[]", "scanlation_group"], ["includes[]", "manga"]]),
    md(`/at-home/server/${id}`, [], atHomeSlot),
  ]);
  const info = chapter(c.data);
  if (!readable(c.data) || !allowed(info)) throw new HttpError(404, "Capítulo indisponível");
  const { baseUrl, chapter: ch } = home;
  return {
    ...info,
    mangaId: rel(c.data, "manga")[0]?.id,
    pages: ch.data.map((f) => img(`${baseUrl}/data/${ch.hash}/${f}`)),
  };
}

// Só repassa imagens dos domínios do MangaDex (evita virar proxy aberto).
const IMG_HOST = /^(uploads\.mangadex\.org|[a-z0-9-]+(\.[a-z0-9-]+)*\.mangadex\.network)$/;

async function proxyImage(raw, res) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError(400, "URL inválida");
  }
  if (url.protocol !== "https:" || !IMG_HOST.test(url.hostname)) throw new HttpError(400, "Host não permitido");

  const start = Date.now();
  let upstream, body;
  try {
    upstream = await fetch(url, { headers: { "User-Agent": UA } });
    body = upstream.ok ? Buffer.from(await upstream.arrayBuffer()) : null;
  } catch {
    upstream = null;
  }
  // Exigido pelo MD@Home: reportar cada imagem de servidor que não seja mangadex.org
  if (!url.hostname.endsWith("mangadex.org")) {
    fetch("https://api.mangadex.network/report", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({
        url: url.href,
        success: Boolean(body),
        cached: (upstream?.headers.get("x-cache") ?? "").startsWith("HIT"),
        bytes: body?.length ?? 0,
        duration: Date.now() - start,
      }),
    }).catch(() => {});
  }
  if (!body) throw new HttpError(502, "Falha ao carregar imagem");
  res.writeHead(200, {
    "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
    "Cache-Control": "public, max-age=86400, immutable",
  });
  res.end(body);
}

const MIN = 60_000;
const routes = [
  [/^\/api\/list$/, (_, q) => cached(`list:${q}`, 5 * MIN, () => list(q))],
  [/^\/api\/manga\/([\w-]+)$/, ([, id]) => cached(`manga:${id}`, 10 * MIN, () => mangaDetail(id))],
  // at-home garante a URL base por 15 min; ?fresh=1 força uma nova quando uma imagem falha
  [
    /^\/api\/chapter\/([\w-]+)$/,
    ([, id], q) => {
      if (q.get("fresh")) cache.delete(`chapter:${id}`);
      return cached(`chapter:${id}`, 10 * MIN, () => chapterPages(id));
    },
  ],
];

http
  .createServer(async (req, res) => {
    const { pathname, searchParams } = new URL(req.url, "http://x");
    try {
      if (req.method !== "GET") throw new HttpError(405, "Método não permitido");
      if (pathname === "/api/img") return await proxyImage(searchParams.get("u"), res);
      for (const [re, handler] of routes) {
        const m = pathname.match(re);
        if (m) {
          const data = await handler(m, searchParams);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          return res.end(JSON.stringify(data));
        }
      }
      throw new HttpError(404, "Rota não encontrada");
    } catch (e) {
      if (!e.status) console.error(e);
      res.writeHead(e.status ?? 500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: e.status ? e.message : "Erro interno" }));
    }
  })
  .listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
