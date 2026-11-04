import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const links = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/novels", label: "Novels" },
  { to: "/novelsEng", label: "Novels EN" },
];

export function Wordmark() {
  return (
    <span className={`display ${styles.wordmark}`}>
      Manga<em>Verse</em>
    </span>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function onSearch(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q").trim();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`wrap ${styles.bar}`}>
        <Link to="/" aria-label="MangaVerse — início">
          <Wordmark />
        </Link>

        <nav className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => (isActive ? styles.active : "")}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <form className={styles.search} onSubmit={onSearch} role="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input name="q" type="search" placeholder="Buscar série..." aria-label="Buscar série" />
          </form>
          <button className="btn btn-primary">Entrar</button>
          <button
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
