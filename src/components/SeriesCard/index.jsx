import { Link } from "react-router-dom";
import { STATUS, TYPE } from "../../api";
import styles from "./SeriesCard.module.css";

function SeriesCard({ series }) {
  return (
    <Link to={`/series/${series.id}`} className={`reveal ${styles.card}`}>
      <div className={styles.cover}>
        {series.cover && <img src={series.cover} alt="" loading="lazy" />}
        <span className={styles.chip}>{TYPE[series.originalLanguage] ?? STATUS[series.status]}</span>
      </div>
      <h3>{series.title}</h3>
      <p>{series.tags.slice(0, 2).join(" · ")}</p>
    </Link>
  );
}

export function CardSkeletons({ count = 12 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i}>
      <div className={`skeleton ${styles.cover}`} />
      <div className="skeleton" style={{ height: 14, marginTop: 12, width: "80%" }} />
    </div>
  ));
}

export default SeriesCard;
