import Header from "../../components/Header";
import Footer from "../../components/Footer";
import book from "../../assets/book-open-text.svg";
import flame from "../../assets/flame.svg";
import WTN from "../../img/WTN.jpg";
import Blink from "../../img/MagicAcademysGeniusBlinkerCover03CUnetauto_scaleLevel3width-2000.jpg";
import Demonic from "../../img/DE.jpg";
import Lookism from "../../img/capa.jpg";
import Hua from "../../img/cover-1-1-1.jpg";
import Sword from "../../img/swordmastersyoungestCover02.png";
import { Link } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <>
      <Header />
      <section className="container">
        <div className="sectNovel">
          <div className="title_heder">
            <img src={book} alt="book" />
            <h2>Lançamentos Manhuas</h2>
          </div>

          <div className="grid-container">
            <article className="grid-item">
              <div className="image_container">
                <Link to="series">
                  <img src={WTN} alt="WTN" />

                  <h3>O Recomeço de um Noob</h3>
                </Link>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Blink} alt="Blink" />
                <h3>Gênio do Teletransporte</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Demonic} alt="Demonic Evolution" />
                <h3>Demonic Evolution</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Lookism} alt="Lookism" />
                <h3>Aparências</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Hua} alt="Mount-Hua" />
                <h3>O Retorno da Seita do Monte Hua</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Sword} alt="Sword" />
                <h3>Swordmaster</h3>
              </div>
            </article>
          </div>
        </div>
        <div className="rankingSect">
          <div className="leftSection">
            <img src={flame} alt="flame" />
            <h3>Ranking MANHUAS</h3>
          </div>
          <div className="ranking">
            <ol>
              <li>WTN</li>
              <li>Gênio do Teletransporte</li>
              <li>Demonic Evolution</li>
              <li>Aparências</li>
              <li>O Retorno da Seita do Monte Hua</li>
              <li>Swordmaster</li>
            </ol>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="sectNovel">
          <div className="title_heder">
            <img src={book} alt="book" />
            <h2>Lançamentos Manhuas</h2>
          </div>

          <div className="grid-container">
            <article className="grid-item">
              <div className="image_container">
                <img src={WTN} alt="WTN" />
                <h3>O Recomeço de um Noob</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Blink} alt="Blink" />
                <h3>Gênio do Teletransporte</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Demonic} alt="Demonic Evolution" />
                <h3>Demonic Evolution</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Lookism} alt="Lookism" />
                <h3>Aparências</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Hua} alt="Mount-Hua" />
                <h3>O Retorno da Seita do Monte Hua</h3>
              </div>
            </article>
            <article className="grid-item">
              <div className="image_container">
                <img src={Sword} alt="Sword" />
                <h3>Swordmaster</h3>
              </div>
            </article>
          </div>
        </div>
        <div className="rankingSect">
          <div className="leftSection">
            <img src={flame} alt="flame" />
            <h3>Ranking MANHUAS</h3>
          </div>
          <div className="ranking">
            <ol>
              <li>WTN</li>
              <li>Gênio do Teletransporte</li>
              <li>Demonic Evolution</li>
              <li>Aparências</li>
              <li>O Retorno da Seita do Monte Hua</li>
              <li>Swordmaster</li>
            </ol>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
