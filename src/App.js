import ImageUploader from "./components/ImageUploader";
import "./App.css";
import "lightbox.js-react/dist/index.css";
import { useEffect } from "react";
import { initLightboxJS } from "lightbox.js-react";

function App() {
  useEffect(() => {
    initLightboxJS("Insert your License Key here", "individual");
  }, []);

  return (
    <div className="App">
      <ImageUploader />
    </div>
  );
}

export default App;
