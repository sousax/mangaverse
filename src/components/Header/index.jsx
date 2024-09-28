import styles from "./Header.module.css";
import LogoVerse from "../../assets/MangaVerso.png";
import Search from "../../assets/search.svg";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topNav}>
        <Link to="/">
          <img src={LogoVerse} alt="Logo" href="/home" />
        </Link>
        <input type="text" placeholder="Search..." />
        <div className={styles.divider}>
          <img src={Search} alt="Search" />
          <button className={styles.button}>Entrar</button>
        </div>
      </div>
      <div className={styles.bottomNav}>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dmca">DMCA</Link>
          <Link to="/sobrenos">Sobre Nós</Link>
          <Link to="/manhuas">Manhuas</Link>
          <Link to="/novels">Novels</Link>
          <Link to="/novelsEng">Novels em Inglês</Link>
          <Link to="/contatos">Contatos</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
