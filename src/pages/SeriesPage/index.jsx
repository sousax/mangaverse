import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi, STATUS, TYPE } from "../../api";
import styles from "./SeriesPage.module.css";

const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

function SeriesPage() {
  const { id } = useParams();
  const { data: s, error } = useApi(`/api/manga/${id}`);
  const [fav, setFav] = useState(false);

  if (error) return <p className="wrap empty">{error.message}</p>;
  if (!s) return <div className={`wrap skeleton ${styles.loading}`} />;

  const first = s.chapters.at(-1);
  const info = [
    ["Tipo", TYPE[s.originalLanguage]],
    ["Ano", s.year],
    ["Status", STATUS[s.status]],
    ["Autor", s.authors.join(", ")],
    ["Artista", s.artists.join(", ")],
  ].filter(([, v]) => v);

  return (
    <>
      <section className={styles.hero}>
        {s.cover && <div className={styles.backdrop} style={{ backgroundImage: `url(${s.cover})` }} />}
        <div className={`wrap ${styles.inner}`}>
          {s.cover && <img className={styles.cover} src={s.cover} alt={s.title} />}
          <div className={styles.body}>
            <Link to="/catalogo" className={styles.back}>
              ← Catálogo
            </Link>
            <h1 className="display">{s.title}</h1>
            <ul className={styles.stats}>
              <li>
                <strong>{s.chapters.length}</strong> capítulos em pt-br
              </li>
              {s.chapters[0] && (
                <li>
                  Atualizado em <strong>{date.format(new Date(s.chapters[0].readableAt))}</strong>
                </li>
              )}
            </ul>
            <ul className={styles.genres}>
              {s.tags.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            {s.description && <p className={styles.synopsis}>{s.description}</p>}
            <div className={styles.ctas}>
              {first && (
                <Link to={`/ler/${first.id}`} className="btn btn-primary">
                  Ler capítulo {first.chapter ?? "único"}
                </Link>
              )}
              <button className={`btn ${fav ? styles.faved : ""}`} aria-pressed={fav} onClick={() => setFav(!fav)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
                </svg>
                {fav ? "Favoritado" : "Favoritar"}
              </button>
            </div>
            {info.length > 0 && (
              <dl className={styles.info}>
                {info.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="wrap">
        <header className="section-head">
          <span>{s.chapters.length}</span>
          <h2 className="display">Capítulos</h2>
        </header>
        {s.chapters.length ? (
          <ol className={styles.chapters}>
            {s.chapters.map((c, i) => (
              <li key={c.id} className="reveal">
                <Link to={`/ler/${c.id}`}>
                  <span>
                    Capítulo {c.chapter ?? "único"}
                    {i === 0 && <em>Novo</em>}
                  </span>
                  <small>{c.group}</small>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty">
            <strong className="display">Sem capítulos</strong>
            Esta obra não tem capítulos em português disponíveis no MangaDex, geralmente por ser licenciada.
          </div>
        )}
      </section>
    </>
  );
}

export default SeriesPage;
