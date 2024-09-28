import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WTN from "../../img/WTN.jpg";
import Eyes from "../../assets/eyes.svg";
import Troph from "../../assets/troph.svg";
import King from "../../img/banner-knight.png";
import styles from "./Page.module.css";
function SeriesPage() {
  return (
    <>
      <Header />
      <section className={styles.container}>
        <div className="image-container">
          <img src={WTN} alt="WTN" className={styles.capa} />
        </div>
        <div className={styles.info_description}>
          <h2>O Recomeço de um Noob</h2>
          <div className={styles.firstLine}>
            <img src={Eyes} alt="views" />
            <p>Visualizações: 203.2k</p>
            <img src={Troph} alt="rank" />
            <p>Rank: 6º</p>
          </div>
          <div className={styles.genres}>
            <button>Ação</button>
            <button>Aventura</button>
            <button>Regressão</button>
            <button>Comédia</button>
            <button>Fantasia</button>
            <button>Shounen</button>
          </div>
          <div className={styles.infos}>
            <p>Alternativa: Worn and Torn Newbie</p>
            <p>Ano: 2021</p>
            <p>Status: Em andamento</p>
            <p>Tipo: Manhwa</p>
            <p>Autor: Step on Leggo</p>
            <p>Artista: Step on Leggo</p>
            <h4>Sinopse:</h4>
          </div>
          <div className={styles.sinopse}>
            <p>
              Do mesmo autor de [Revenge of The Iron-Blooded Sword Hound!] 15
              anos até o fim do jogo, e apenas eu sei como termina.” “Eu sou um
              dos viciados”
            </p>
          </div>
        </div>
      </section>
      <section className={styles.buttonsContainer}>
        <button>Ler Agora</button>
        <button>Favoritar</button>
        <button>Ler Depois</button>
      </section>
      <section className={styles.capContainer}>
        <div className="cap_container">
          <h2>Capítulos</h2>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SeriesPage;
