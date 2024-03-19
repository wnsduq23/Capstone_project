import { useEffect, useRef, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/diagnosis.module.css";
import "../styles/styles.css";

function SubmitForm() {
  const [isHidden, setIsHidden] = useState(false);
  const [changeCamera, setChangeCamera] = useState(false);
  let currentPosition = [0, 0];
  const CameraComponent = () => {
    const videoRef = useRef(null);
    const startCamera = (e) => {
      e.preventDefault();
      setIsHidden((current) => !current);
      setChangeCamera((current) => !current);
    };
    useEffect(() => {
      if (changeCamera === true && videoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current.srcObject = stream;
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
          });
      } else {
        videoRef.current.srcObject = null;
      }
    }, [changeCamera]);

    const capturePhoto = (e) => {
      e.preventDefault();
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const photoURL = canvas.toDataURL("image/jpeg");
      const a = document.createElement("a");
      a.href = photoURL;
      a.download = "test.jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsHidden((current) => !current);
      setChangeCamera((current) => !current);
    };

    return (
      <div
        className={
          changeCamera ? styles.changedCameraContainer : styles.cameraContainer
        }
      >
        {changeCamera ? (
          <button onClick={capturePhoto} className={styles.cameraBtn}>
            사진 촬영
          </button>
        ) : (
          <button
            onClick={startCamera}
            className={`${styles.cameraBtn} ${styles.hidedCameraBtn}`}
          >
            카메라 열기
          </button>
        )}
        <video
          ref={videoRef}
          autoPlay
          className={changeCamera ? styles.captureVideo : styles.hideCamera}
        />
      </div>
    );
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        currentPosition = [position.coords.latitude, position.coords.longitude];
      });
    } else {
      alert(
        "위치 확인을 거절하셔도 서비스 사용에는 지장이 없지만 다른 사용자가 해충 발생 현황을 확인하게 될 수 없습니다."
      );
    }
  }, []);
  async function handleSubmit(event) {
    event.preventDefault();
    const imageFile = document.getElementById("selectFileBtn").files[0];
    const agricultureType = document.getElementById("agricultureType").value;

    if (!imageFile || !agricultureType) {
      alert("이미지 파일을 선택하고 작물 종류를 선택해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    const options = {
      method: "post",
      body: formData,
    };
    try {
      const response = await fetch(
        `/diagnosis?agricultureType=${agricultureType}&lat=${currentPosition[0]}&lng=${currentPosition[1]}`,
        options
      );
      if (!response.ok) {
        console.log(response);
        throw new Error();
      }
      const data = await response.json();
      console.log(data);
      const a = document.createElement("a");
      a.href = `/result?v1=${data.v1}&v2=${data.v2}&v3=${data.v3}&v4=${data.v4}&v5=${data.v5}&p1=${data.p1}&p2=${data.p2}&p3=${data.p3}&p4=${data.p4}&p5=${data.p5}`;
      document.body.appendChild(a);
      a.click();
    } catch (e) {
      // alert("오류가 발생하였습니다");
      // const a = document.createElement("a");
      // a.href = "/diagnosis";
      // document.body.appendChild(a);
      // a.click();
    }
  }
  return (
    <div className={styles.mainContainer}>
      <form className={styles.submitForm} method="POST" action="">
        {changeCamera ? null : (
          <div className={styles.explainContainer}>
            <h1>
              이미지파일을 선택하신 후 <br />
              작물 종류를 선택하고 제출해주세요
              <br />그 후 잠시만 기다려주세요
            </h1>
          </div>
        )}
        {isHidden ? null : (
          <div className={styles.submitFileContainer}>
            <input
              id="selectFileBtn"
              className={styles.submitFile}
              type="file"
              accept="image/jpeg"
              name="imageFile"
              required
            ></input>
          </div>
        )}
        {isHidden ? null : (
          <div className={styles.selectContainer}>
            <div>
              <label htmlFor="agricultureType">작물 종류 </label>
              <select id="agricultureType" name="agricultureType">
                <option value={1}>감자</option>
                <option value={2}>고추</option>
                <option value={5}>배추</option>
                <option value={6}>벼</option>
                <option value={10}>콩</option>
                <option value={12}>파</option>
              </select>
            </div>
          </div>
        )}
        {isHidden ? null : (
          <div className={`${styles.submitBtnContainer} submitBtnContainer`}>
            <input
              className={styles.submitBtn}
              type="submit"
              onClick={handleSubmit}
            ></input>
          </div>
        )}
      </form>
    </div>
  );
}

function DiagnosisScreen() {
  return (
    <div>
      <Header title="진단" />
      <SubmitForm />
      <Footer />
    </div>
  );
}

export default DiagnosisScreen;
