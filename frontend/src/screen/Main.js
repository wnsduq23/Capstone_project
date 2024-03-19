import { Link } from "react-router-dom";
import "../styles/styles.css";
import styles from "../styles/main.module.css";
import Header from "../component/Header";
import Footer from "../component/Footer";

function Main() {
  return (
    <div className={styles.mainBlock}>
      <div className={styles.mainBtnsContainer}>
        <div className={styles.btnContainer}>
          <Link className={styles.anchorConatiner} to={`/diagnosis`}>
            <button className={styles.mainBtn}>해충 진단</button>
          </Link>
        </div>
        <div className={styles.btnContainer}>
          <Link className={styles.anchorConatiner} to={`/community-post-list`}>
            <button className={styles.mainBtn}>커뮤니티</button>
          </Link>
        </div>
        <div className={styles.btnContainer}>
          <Link className={styles.anchorConatiner} to={`/insectaroundme`}>
            <button className={styles.mainBtn}>내 주변 해충 정보</button>
          </Link>
        </div>
      </div>
      <div className={styles.tutorialVidContainer}>
        {/* <iframe
          frameBorder="0"
          className={styles.tutorialVid}
          src="https://youtu.be/Hi_aNWtNbYQ?si=1Gk_PCXpEp9a5b1R"
        /> */}
        <iframe
          className={styles.tutorialVid}
          src="https://youtube.com/embed/q-BLcDZXiSc?si=c9XJEma1zdGPeRJG"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Header title="AI 해충 진단 시스템" />
      <Main />
      <Footer />
    </div>
  );
}

export default Home;
