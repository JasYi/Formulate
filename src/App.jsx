import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="form" element={<Form />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
