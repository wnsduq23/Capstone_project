import React, { Component, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/result.module.css";
import "../styles/styles.css";

class Donut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: [
          props.label1,
          props.label2,
          props.label3,
          props.label4,
          props.label5,
        ],
        dataLabels: { style: { fontSize: "20px" } },
        legend: {
          fontSize:
            window.innerWidth < 768
              ? "16px"
              : window.innerWidth < 1280
              ? "20px"
              : "24px",
          horizontalAlign: "center",
          position: "right",
        },
      },
      series: [
        Number(props.percent1),
        Number(props.percent2),
        Number(props.percent3),
        Number(props.percent4),
        Number(props.percent5),
      ],
    };
  }
  render() {
    return (
      <div className="donut">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          width={
            window.innerWidth < 768
              ? "450"
              : window.innerWidth < 1280
              ? "525"
              : "600"
          }
        />
      </div>
    );
  }
}

function ResultScreen() {
  //src 이미지 받는 패치 추가해야하고, 그에 따른 controller 필요함
  const search = window.location.search;
  const v = new Array(6);
  const p = new Array(6);
  const params = new URLSearchParams(search);
  const insectName = [
    "정상",
    "검거세미밤나방(알)",
    "꽃노랑총채벌레(알)",
    "담배가루이(알)",
    "담배거세미나방(알)",
    "담배나방(알)",
    "도둑나방(알)",
    "먹노린재(알)",
    "목화바둑명나방(알)",
    "무잎벌(알)",
    "배추좀나방(알)",
    "배추흰나비(알)",
    "벼룩잎벌레(알)",
    null,
    "복숭아혹진딧물(알)",
    "비단노린재(알)",
    "썩덩나무노린재(알)",
    "알락수염노린재(알)",
    "열대거세미나방(알)",
    "큰28점박이 무당벌레(알)",
    "톱다리개미허리노린재(알)",
    "파밤나방(알)",
    "검거세미밤나방(유충)",
    "꽃노랑총채벌레(유충)",
    "담배가루이(유충)",
    "담배거세미나방(유충)",
    "담배나방(유충)",
    "도둑나방(유충)",
    "먹노린재(유충)",
    "목화바둑명나방(유충)",
    "무잎벌(유충)",
    "배추좀나방(유충)",
    "배추흰나비(유충)",
    "벼룩잎벌레(유충)",
    null,
    "복숭아혹진딧물(유충)",
    "비단노린재(유충)",
    "썩덩나무노린재(유충)",
    "알락수염노린재(유충)",
    "열대거세미나방(유충)",
    "큰28점박이 무당벌레(유충)",
    "톱다리개미허리노린재(유충)",
    "파밤나방(유충)",
    "검거세미밤나방(성충)",
    "꽃노랑총채벌레(성충)",
    "담배가루이(성충)",
    "담배거세미나방(성충)",
    "담배나방(성충)",
    "도둑나방(성충)",
    "먹노린재(성충)",
    "목화바둑명나방(성충)",
    "무잎벌(성충)",
    "배추좀나방(성충)",
    "배추흰나비(성충)",
    "벼룩잎벌레(성충)",
    null,
    "복숭아혹진딧물(성충)",
    "비단노린재(성충)",
    "썩덩나무노린재(성충)",
    "알락수염노린재(성충)",
    "열대거세미나방(성충)",
    "큰28점박이 무당벌레(성충)",
    "톱다리개미허리노린재(성충)",
    "파밤나방(성충)",
  ];

  try {
    v[1] = Number(params.get("v1"));
    v[2] = Number(params.get("v2"));
    v[3] = Number(params.get("v3"));
    v[4] = Number(params.get("v4"));
    v[5] = Number(params.get("v5"));
    p[1] = Number(params.get("p1"));
    p[2] = Number(params.get("p2"));
    p[3] = Number(params.get("p3"));
    p[4] = Number(params.get("p4"));
    p[5] = Number(params.get("p5"));

    for (let i = 1; i < 6; i++) {
      if (v[i] < 0 || v[i] > 63 || v[i] === null) {
        throw new Error();
      } else if (p[i] < 0 || p[i] > 100 || p[i] === null) {
        throw new Error();
      }
    }
  } catch (e) {
    console.log("error occured");
    alert("잘못된 접근입니다");
    const a = document.createElement("a");
    a.href = "/diagnosis";
    document.body.appendChild(a);
    a.click();
  }
  const [resultData, setResultData] = useState({
    label1: "검거세미밤나방",
    label2: "담배거세미나방",
    label3: "담배나방",
    label4: "도둑나방",
    label5: "기타",
    percent1: 92.5,
    percent2: 3,
    percent3: 2.5,
    percent4: 1,
    percent5: 1,
  });
  const [chartReady, setChartReady] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const chartReady = async () => {
      setTimeout(() => {
        setChartReady(true);
      }, 50);
    };
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(
          `/result?insectCode=${
            v[1] > 42 ? v[1] - 42 : v[1] > 21 ? v[1] - 21 : v[1]
          }`
        );
        if (!response.ok) {
          // 위에 baseurl가 엔드포인트 url로 바껴야됨 url 뒷 부분은 추가 정보
          throw new Error();
        }
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (e) {
        // alert("오류가 발생했습니다");
        // const a = document.createElement("a");
        // a.href = "/diagnosis"; //나중에 getMapping 컨트롤러 구현 되면 주석 제거해야함
        // document.body.appendChild(a);
        // a.click();
      }
    };
    setResultData({
      label1: insectName[Number(v[1])],
      label2: insectName[Number(v[2])],
      label3: insectName[Number(v[3])],
      label4: insectName[Number(v[4])],
      label5: insectName[Number(v[5])],
      percent1: p[1],
      percent2: p[2],
      percent3: p[3],
      percent4: p[4],
      percent5: p[5],
    });
    chartReady();
    fetchImageUrl();
  }, []);
  return (
    <div>
      <Header
        title={`${resultData.label1}: ${
          Math.round(resultData.percent1 * 10000) / 100
        }%`}
      />
      <div className={styles.mainContainer}>
        <div className={styles.imgContainer}>
          <img
            className={styles.resultImg}
            src={"data:image/jpg;base64," + imageUrl}
            alt=""
          />
        </div>
        <div className={styles.chartDiv}>
          {chartReady ? (
            <Donut
              width="600"
              className="chart"
              label1={resultData.label1}
              label2={resultData.label2}
              label3={resultData.label3}
              label4={resultData.label4}
              label5={resultData.label5}
              percent1={resultData.percent1}
              percent2={resultData.percent2}
              percent3={resultData.percent3}
              percent4={resultData.percent4}
              percent5={resultData.percent5}
            />
          ) : null}
        </div>
        <div className={styles.btnsContainer}>
          <Link
            to={`/insectinfo?insectCode=${
              v[1] > 42 ? v[1] - 42 : v[1] > 21 ? v[1] - 21 : v[1]
            }`}
          >
            <button className={styles.moreInfoBtn}>해충 상세 정보</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ResultScreen;
