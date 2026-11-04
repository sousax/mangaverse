import { Link } from "react-router-dom";
import { Wordmark } from "../Header";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <Wordmark />
          <p className={styles.tagline}>Manhwas, manhuas e novels traduzidos por fãs, para fãs.</p>
        </div>
        <nav className={styles.links} aria-label="Institucional">
          <Link to="/sobrenos">Sobre nós</Link>
          <Link to="/contatos">Contato</Link>
          <Link to="/dmca">DMCA</Link>
        </nav>
      </div>
      <div className={`wrap ${styles.legal}`}>
        <p>
          Todas as comics e histórias neste site são apenas prévias dos originais e podem conter erros de
          linguagem, nomes e enredo. Incentivamos a compra da versão oficial para apoiar autores e artistas.
          Somos um grupo de fãs que traz projetos ainda não lançados oficialmente no Brasil. Elogios, sugestões
          ou remoção de projetos: <a href="mailto:multiversodosmangas@gmail.com">multiversodosmangas@gmail.com</a>
        </p>
        <p>
          Catálogo, capas e capítulos via{" "}
          <a href="https://mangadex.org" target="_blank" rel="noreferrer">
            MangaDex
          </a>
          . Cada tradução é creditada ao seu grupo de scan.
        </p>
        <p>© {new Date().getFullYear()} MangaVerse</p>
      </div>
    </footer>
  );
}

export default Footer;
