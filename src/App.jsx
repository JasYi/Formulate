import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

// async function handleSendImage(event) {
//   event.preventDefault();

//   // Step 1: Get a short-lived upload URL
//   const postUrl = await generateUploadUrl();
//   console.log(postUrl);
//   // Step 2: POST the file to the URL
//   const result = await fetch(postUrl, {
//     method: "POST",
//     headers: { "Content-Type": selectedImage.type },
//     body: selectedImage,
//   });
//   const { storageId } = await result.json();
//   // Step 3: Save the newly allocated storage id to the database
//   await sendImage({ storageId, author: name });

//   setSelectedImage(null);
//   imageInput.current.value = "";
// }

{
  /* <form onSubmit={handleSendImage}>
          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            onChange={(event) => setSelectedImage(event.target.files[0])}
            disabled={selectedImage !== null}
          />
          <input
            type="submit"
            value="Send Image"
            disabled={selectedImage === null}
          />
        </form> */
}

function App() {
  const tasks = useQuery(api.tasks.get);
  const [count, setCount] = useState(0);

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const imageInput = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
