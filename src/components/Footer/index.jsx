import styles from "./Footer.module.css";
import LogoVerse from "../../assets/MangaVerso.png";
function Footer() {
  return (
    <footer className={styles.footer}>
      <img src={LogoVerse} alt="logoManga" />
      <h3>© 2021 Mangaverse. All rights reserved.</h3>
      <p>
        Todos as comics e histórias neste site são apenas prévias dos originais,
        podendo haver muitos erros de linguagem, nomes de personagens e enredos.
        Sempre incentivamos a compra da versão oficial para incentivar o autor e
        artista, então compre o quadrinho se estiver disponível em sua cidade.
        Somos apenas um grupo de fãs com o intuito de trazer projetos que ainda
        não estão sendo lançados de forma oficial em nosso pais, nosso objetivo
        é aumentar ainda mais o conhecimento das pessoas sobre a cultura dos
        mangás, manhwas, manhuas e light novels. Contato direto para elogios,
        reclamações, sugestões de melhorias e/ou remoção de projetos:
        multiversodosmangas@gmail.com
      </p>
    </footer>
  );
}
export default Footer;
