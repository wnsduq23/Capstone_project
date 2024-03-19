import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./screen/Main.js";
import ResultScreen from "./screen/Result.js";
import DiagnosisScreen from "./screen/Diagnosis.js";
import CommunityScreen from "./screen/Community-post-list.js";
import InsectInfo from "./screen/InsectInfo.js";
import InsectAroundMe from "./screen/InsectAroundMe.js";
import Community_post_form from "./screen/Community_post_form.js";
import CommunityContext from "./screen/Community-post-detail.js";
import Community_post_edit from "./screen/Community_post_edit.js";
import InsectInfoList from "./screen/InsectInfoList.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/diagnosis" element={<DiagnosisScreen />} />
        <Route path="/community-post-list" element={<CommunityScreen />} />
        <Route path="/community-post-form" element={<Community_post_form />} />
        <Route
          path="/community-post/edit/:id"
          element={<Community_post_edit />}
        />
        <Route path="/community-post/:id" element={<CommunityContext />} />
        <Route path="/insectinfolist" element={<InsectInfoList />} />
        <Route path="/insectinfo" element={<InsectInfo />} />
        <Route path="/insectaroundme" element={<InsectAroundMe />} />
      </Routes>
    </Router>
  );
}

export default App;
