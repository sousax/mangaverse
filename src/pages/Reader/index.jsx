import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../api";
import styles from "./Reader.module.css";

function Reader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fresh, setFresh] = useState(false);
  const { data: c, error } = useApi(`/api/chapter/${id}${fresh ? "?fresh=1" : ""}`);
  const { data: m } = useApi(c?.mangaId && `/api/manga/${c.mangaId}`);

  useEffect(() => {
    setFresh(false);
  }, [id]);

  // Capítulos vêm do mais novo pro mais antigo
  const i = m?.chapters.findIndex((x) => x.id === id) ?? -1;
  const prev = i >= 0 ? m.chapters[i + 1] : null;
  const next = i > 0 ? m.chapters[i - 1] : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowLeft" && prev) navigate(`/ler/${prev.id}`);
      if (e.key === "ArrowRight" && next) navigate(`/ler/${next.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, navigate]);

  if (error) return <p className="wrap empty">{error.message}</p>;

  const nav = (
    <nav className={styles.nav}>
      {prev ? (
        <Link className="btn" to={`/ler/${prev.id}`}>
          ← Cap. {prev.chapter}
        </Link>
      ) : (
        <span />
      )}
      {c?.mangaId && (
        <Link className="btn" to={`/series/${c.mangaId}`}>
          Capítulos
        </Link>
      )}
      {next ? (
        <Link className="btn btn-primary" to={`/ler/${next.id}`}>
          Cap. {next.chapter} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  return (
    <div className={styles.reader}>
      <div className={styles.progress} aria-hidden="true" />
      <header className={`wrap ${styles.head}`}>
        <p>{m?.title ?? " "}</p>
        <h1 className="display">Capítulo {c?.chapter ?? "…"}</h1>
        {c && (
          <small>
            Tradução: <strong>{c.group}</strong> · via MangaDex
          </small>
        )}
      </header>
      {nav}
      <div className={styles.pages}>
        {c
          ? c.pages.map((src, n) => (
              <img
                key={src}
                src={src}
                alt={`Página ${n + 1}`}
                loading={n < 3 ? "eager" : "lazy"}
                // URL do servidor de imagens expira; pede uma nova uma vez
                onError={() => !fresh && setFresh(true)}
              />
            ))
          : Array.from({ length: 3 }, (_, n) => <div key={n} className={`skeleton ${styles.placeholder}`} />)}
      </div>
      {c && nav}
    </div>
  );
}

export default Reader;
