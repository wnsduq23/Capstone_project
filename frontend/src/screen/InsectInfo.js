import { useEffect, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/insectInfo.module.css";
import "../styles/styles.css";

function InsectInfo() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const insectName = [
    "정상",
    "검거세미밤나방",
    "꽃노랑총채벌레",
    "담배가루이",
    "담배거세미나방",
    "담배나방",
    "도둑나방",
    "먹노린재",
    "목화바둑명나방",
    "무잎벌",
    "배추좀나방",
    "배추흰나비",
    "벼룩잎벌레",
    null,
    "복숭아혹진딧물",
    " 비단노린재",
    "썩덩나무노린재",
    "알락수염노린재",
    "열대거세미나방",
    "큰28점박이 무당벌레",
    "톱다리개미허리노린재",
    "파밤나방",
  ];
  const insectCode = Number(params.get("insectCode"));
  function MainBlock() {
    const [imgUrls, setImgUrls] = useState(["", "", ""]);
    const [imgUrl, setImgUrl] = useState("");
    const [insectInfoText, setInsectInfoText] = useState("");
    const [insectCM, setInsectCM] = useState("");
    useEffect(() => {
      setImgUrl(imgUrls[2]); // 초기 이미지 설정
    }, [imgUrls]);
    const fetchInsectInfo = async () => {
      try {
        const response = await fetch(`/insectInfo?insectCode=${insectCode}`); //여기는 이미지 url 알 유충 성충 순으로 3개, 해충 상세정보 글 하나 받아와야됨
        if (!response.ok) {
          // 위에 baseurl가 엔드포인트 url로 바껴야됨 baseurl 뒷 부분은 추가, fetch 형식은 get 형식
          throw new Error();
        }
        const data = await response.json();
        setImgUrls([data.url1, data.url2, data.url3]);
        setInsectInfoText(data.insectInfoText);
        setInsectCM(data.insectCM);
      } catch (e) {
        alert("오류가 발생했습니다"); //getController 연결 후 이 부분 주석 취소
        const a = document.createElement("a");
        a.href = "/";
        document.body.appendChild(a);
        a.click();
      }
    };
    useEffect(() => {
      fetchInsectInfo();
    }, []);
    function onClick(e) {
      e.preventDefault();
      setImgUrl(imgUrls[e.currentTarget.value]);
    }
    return (
      <div className={styles.mainContainer}>
        <div className={styles.imgsContainer}>
          <div className={styles.elementImgBlock}>
            <img src={"data:image/jpeg;base64," + imgUrl} alt="" />
          </div>
          <div className={styles.btnsContainer}>
            <button value={0} onClick={onClick}>
              알
            </button>
            <button value={1} onClick={onClick}>
              유충
            </button>
            <button value={2} onClick={onClick}>
              성충
            </button>
          </div>
        </div>
        <ul className={styles.mainInformation}>
          <li>
            <h2 className={styles.semiTitle}>해충 상세정보</h2>
            <p>{insectInfoText}</p>
          </li>
          <br />
          <li>
            <h2 className={styles.semiTitle}>해충 방제법</h2>
            <p>{insectCM}</p>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div>
      {/* title 내용 검출 해충명 */}
      <Header title={insectName[insectCode]} />
      <MainBlock />
      <Footer />
    </div>
  );
}

export default InsectInfo;
