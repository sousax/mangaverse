import { Link } from "react-router-dom";
import SeriesCard, { CardSkeletons } from "../../components/SeriesCard";
import { useApi } from "../../api";
import styles from "./Home.module.css";

const fmt = new Intl.NumberFormat("pt-BR", { notation: "compact" });

function Home() {
  const latest = useApi("/api/list?order=latest&limit=12");
  const popular = useApi("/api/list?order=popular&limit=8");
  const featured = popular.data?.items[0];

  return (
    <>
      <section className={styles.hero}>
        {featured?.cover && <div className={styles.backdrop} style={{ backgroundImage: `url(${featured.cover})` }} />}
        <div className={`wrap ${styles.heroInner}`}>
          {featured ? (
            <>
              <div className={styles.heroText}>
                <p className={styles.kicker}>Mais seguido</p>
                <h1 className="display">{featured.title}</h1>
                <p className={styles.meta}>{featured.tags.slice(0, 3).join(" · ")}</p>
                <p className={styles.synopsis}>{featured.description}</p>
                <div className={styles.ctas}>
                  <Link to={`/series/${featured.id}`} className="btn btn-primary">
                    Ver capítulos
                  </Link>
                </div>
              </div>
              <Link to={`/series/${featured.id}`} className={styles.heroCover}>
                <img src={featured.cover} alt={featured.title} />
              </Link>
            </>
          ) : popular.error ? (
            <p className="empty">{popular.error.message}</p>
          ) : (
            <div className={`skeleton ${styles.heroSkeleton}`} />
          )}
        </div>
      </section>

      <div className={`wrap ${styles.columns}`}>
        <section>
          <header className="section-head">
            <span>01</span>
            <h2 className="display">Atualizados</h2>
          </header>
          {latest.error ? (
            <p className="empty">{latest.error.message}</p>
          ) : (
            <div className={styles.grid}>
              {latest.data ? latest.data.items.map((s) => <SeriesCard key={s.id} series={s} />) : <CardSkeletons />}
            </div>
          )}
        </section>

        <aside>
          <header className="section-head">
            <span>02</span>
            <h2 className="display">Ranking</h2>
          </header>
          <ol className={styles.ranking}>
            {popular.data?.items.map((s, i) => (
              <li key={s.id} className="reveal">
                <Link to={`/series/${s.id}`}>
                  <span className="display">{String(i + 1).padStart(2, "0")}</span>
                  <img src={s.cover} alt="" loading="lazy" />
                  <div>
                    <strong>{s.title}</strong>
                    <small>{fmt.format(s.follows)} seguidores</small>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}

export default Home;
