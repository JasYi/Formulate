import React from "react";
import "./App.css"; // Import the CSS file
import CanvasEffect from "./CanvasEffect"; // Import CanvasEffect component

const App = () => {
  return (
    <div className="app-container">
      <CanvasEffect /> {/* The canvas background */}
      <div className="content-container">
        <h1 className="title">Formulate</h1>
        <p className="tagline">
          Design a website for your forms within seconds. No code or manual input required.
        </p>
        <div className="upload-area">
          <p>Drag and drop a file (Max size 50MB)</p>
          <input type="file" id="fileInput" className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default App;


