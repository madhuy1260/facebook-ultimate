import { useState, useRef } from "react";
import "./Home.css";
import Header from "../../components/header/Header";
import ClickOutside from "../../helpers/clickOutside";
// import { ref } from "yup";

function Home() {
  const [visible, setVisible] = useState(true);
  const el = useRef(null);
  ClickOutside(el, () => {
    setVisible(false);
    // el.current.style.display = "none";
  });
  return (
    <div>
      <Header />
      {visible && <div className="card" ref={el}></div>}
    </div>
  );
}

export default Home;
