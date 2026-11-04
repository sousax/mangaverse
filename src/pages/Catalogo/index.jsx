import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SeriesCard, { CardSkeletons } from "../../components/SeriesCard";
import { useApi } from "../../api";

const TYPES = [
  ["", "Todos"],
  ["manga", "Mangá"],
  ["manhwa", "Manhwa"],
  ["manhua", "Manhua"],
];
const PER_PAGE = 24;

function Catalogo() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const type = params.get("type") ?? "";
  const page = Math.max(Number(params.get("page")) || 1, 1);
  const [draft, setDraft] = useState(q);

  useEffect(() => {
    setDraft(q);
  }, [q]);

  // Espera o usuário parar de digitar antes de buscar
  useEffect(() => {
    if (draft === q) return;
    const t = setTimeout(() => update({ q: draft, page: "" }), 400);
    return () => clearTimeout(t);
  }, [draft]);

  function update(changes) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: "q" in changes });
  }

  const api = new URLSearchParams({ limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
  if (q) api.set("q", q);
  if (type) api.set("type", type);
  const { data, error } = useApi(`/api/list?${api}`);
  const pages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  return (
    <div className="wrap">
      <header className="page-head">
        <p>Em português</p>
        <h1 className="display">Catálogo</h1>
      </header>
      <div className="catalog-bar">
        <input
          className="catalog-search"
          type="search"
          placeholder="Buscar por título..."
          aria-label="Buscar por título"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Tipo">
          {TYPES.map(([value, label]) => (
            <button key={value} aria-pressed={type === value} onClick={() => update({ type: value, page: "" })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="empty">{error.message}</p>
      ) : data && !data.items.length ? (
        <div className="empty">
          <strong className="display">Nada por aqui</strong>
          Nenhuma série encontrada{q && ` para “${q}”`}.
        </div>
      ) : (
        <div className="catalog-grid">
          {data ? data.items.map((s) => <SeriesCard key={s.id} series={s} />) : <CardSkeletons count={PER_PAGE} />}
        </div>
      )}

      {pages > 1 && (
        <nav className="pager" aria-label="Paginação">
          <button className="btn" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>
            ← Anterior
          </button>
          <span>
            {page} / {pages}
          </span>
          <button className="btn" disabled={page >= pages} onClick={() => update({ page: page + 1 })}>
            Próxima →
          </button>
        </nav>
      )}
    </div>
  );
}

export default Catalogo;
