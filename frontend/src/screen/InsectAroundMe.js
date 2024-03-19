import { useEffect, useState } from "react";
import {
  InfoWindow,
  Container as MapDiv,
  Marker,
  NaverMap,
  NavermapsProvider,
  useNavermaps,
} from "react-naver-maps";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/insectAroundme.module.css";
function MyMap() {
  const navermaps = useNavermaps();

  const [map, setMap] = useState(null);
  const [infowindow, setInfoWindow] = useState(null);
  const [markerData, setMarkerData] = useState([]);
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
  useEffect(() => {
    const loadMarkerData = async () => {
      try {
        const response = await fetch(`/insectAroundMe`);
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setMarkerData(data);
        console.log(markerData);
      } catch (e) {
        console.log("에러");
      }
    };
    loadMarkerData();
  }, []);

  function onSuccessGeolocation(position) {
    if (!map || !infowindow) return;

    const location = new navermaps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    map.setCenter(location);
    map.setZoom(14);
    infowindow.setContent(
      '<div style="padding:20px;">' +
        "지도상의 표시들을 클릭하여 해충 발생 날짜와 해충명을 알 수 있습니다." +
        "</div>"
    );
    infowindow.open(map, location);
  }

  function onErrorGeolocation() {
    if (!map || !infowindow) return;

    const center = map.getCenter();
    infowindow.setContent(
      '<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>' +
        "latitude: " +
        center.lat() +
        "<br />longitude: " +
        center.lng() +
        "</div>"
    );
    infowindow.open(map, center);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onSuccessGeolocation,
        onErrorGeolocation
      );
    } else {
      const center = map.getCenter();
      infowindow.setContent(
        '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>'
      );
      infowindow.open(map, center);
    }
  }

  useEffect(() => {
    if (!map || !infowindow) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onSuccessGeolocation,
        onErrorGeolocation
      );
    } else {
      var center = map.getCenter();
      infowindow.setContent(
        `<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</div>`
      );
      infowindow.open(map, center);
    }
  }, [map, infowindow]);
  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(37.5666805, 126.9784147)}
      defaultZoom={10}
      defaultMapTypeId={navermaps.MapTypeId.NORMAL}
      ref={setMap}
    >
      {markerData.map((marker) => {
        const dateObj = new Date(marker.date);
        const formattedDate = `${
          dateObj.getMonth() + 1
        }월 ${dateObj.getDate()}일`;
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => {
              infowindow.setContent(
                '<div style="padding:20px; line-height:1.5">' +
                  "해충 명: " +
                  insectName[marker.insectCode] +
                  "<br/>" +
                  "해충 발생 날짜: " +
                  formattedDate +
                  "<br/>" +
                  `<a href=/insectinfo?insectCode=${marker.insectCode} >해충 상세 정보 확인</a>` +
                  "</div>"
              );
              infowindow.open(
                map,
                new navermaps.LatLng(marker.position.lat, marker.position.lng)
              );
            }}
          />
        );
      })}
      <InfoWindow ref={setInfoWindow} />
    </NaverMap>
  );
}
function Map() {
  const apikey = process.env.PUBLIC_URL;

  return (
    <div className={styles.mapLoader}>
      <div className="map">
        <NavermapsProvider ncpClientId={apikey}>
          <MapDiv
            style={{
              width: "100%",
              height: window.innerWidth < 768 ? "80vh" : "70vh",
            }}
          >
            <MyMap />
          </MapDiv>
        </NavermapsProvider>
      </div>
    </div>
  );
}

function InsectAroundMe() {
  return (
    <div>
      <Header title="내 주변 해충 정보" />
      <Map />
      <Footer />
    </div>
  );
}

export default InsectAroundMe;
