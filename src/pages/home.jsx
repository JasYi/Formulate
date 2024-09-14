import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, SendHorizontal } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

function Home() {
  const [file, setFile] = useState(null);

  // Convex backend mutation for generating file upload URL
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  // Handle file selection and upload to backend
  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      try {
        // Step 1: Get a short-lived upload URL from Convex
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const { storageId } = await result.json();

        // Step 3: Save the uploaded file's storage ID in the Convex database
        await sendImage({ storageId, author: "user_upload" });
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  return (
    <div className="formulate">
      <header className="app-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="header-title">Formulate</h1>
      </header>

      <main>
        <h2 className="main-title">Formulate</h2>
        <p className="subtitle">
          Design a website for your forms within seconds.<br />
          No code or manual input required.
        </p>

        {/* File Upload Section */}
        <div className="file-upload">
          <input type="file" onChange={handleFileChange} id="file-input" />
          <label htmlFor="file-input">
            <span>Drag and drop a file (Max size 50MB)</span>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19L12 5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>

        {file && <p className="file-name">File selected: {file.name}</p>}
      </main>
    </div>
  );
}
export default Home;