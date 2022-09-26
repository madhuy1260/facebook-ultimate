import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Profile from "./pages/Profile/Profile.js";
import Home from "./pages/Home/Home.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
