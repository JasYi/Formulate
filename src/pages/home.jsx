import React, { useState, useEffect, useRef } from "react";
import  anime from "animejs";
import Typed from "typed.js";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";


function Home() {
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const runAiCall = useAction(api.ai.chat);

  const navigate = useNavigate();

  const imageInput = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const headerRef = useRef(null);
  const mainTitleRef = useRef(null);
  const subtitleRef = useRef(null);
  const fileUploadRef = useRef(null);
  const typingTextRef = useRef(null);

  
  
  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    timeline
      .add({
        targets: headerRef.current,
        opacity: [0, 1],
        duration: 1200
      })
      .add({
        targets: mainTitleRef.current,
        opacity: [0, 1],
        duration: 1200
      }, '-=600')
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        duration: 1200
      }, '-=600')
      .add({
        targets: fileUploadRef.current,
        opacity: [0, 1],
        duration: 1200
      }, '-=600');
  

  const typed = new Typed(typingTextRef.current, {
    strings: ['W-4 forms', 'compliance forms', 'health forms', 'immigration forms'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1000,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: '●'
  });


  // Clean up function
  return () => {
    typed.destroy();
  };


  
}, []);


  async function handleSendImage(event) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    const docId = await sendImage({ storageId, author: "user_upload" });

    const formID = await runAiCall({ imageId: docId });

    console.log("form ID:", formID);

    navigate("/dashboard?id=" + formID);

    setSelectedImage(null);
    imageInput.current.value = "";
  }

  return (
    
    <div className="formulate min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">

      <header ref={headerRef} className="app-header mb-8">
        <div className="logo flex items-center space-x-2">
        <svg width="50" height="29" viewBox="0 0 50 29" fill="none" xmlns="http://www.w3.org/2000/svg">

            <path
              d="M35.4877 28.8058H26.3686C26.3686 25.8029 28.794 23.3707 31.7886 23.3707H35.5013C40.4064 23.3707 44.4985 19.4575 44.5798 14.5388C44.6611 9.52493 40.6097 5.43505 35.6368 5.43505C33.4688 5.43505 31.3821 6.22313 29.7561 7.64983L17.8862 18.3569C15.664 20.3679 12.2359 20.1776 10.2305 17.9493L25.9756 3.75018C26.0298 3.69583 26.0976 3.64148 26.1518 3.58713L26.7209 3.11157C29.2547 1.1006 32.3983 0 35.6368 0C43.5907 0 50.0405 6.50847 49.9998 14.4844C49.9592 22.4332 43.401 28.8058 35.4877 28.8058Z"
              fill="#191919"
            />
            <path
              d="M14.3632 28.8058C6.40936 28.8058 -0.040459 22.2973 0.000191099 14.3214C0.0408412 6.3726 6.59906 0 14.5258 0H23.645C23.645 3.00287 21.2196 5.43505 18.225 5.43505H14.4987C9.59362 5.43505 5.50151 9.34829 5.42021 14.267C5.33891 19.2808 9.39037 23.3707 14.3632 23.3707C16.5312 23.3707 18.6179 22.5826 20.2439 21.1559L32.1138 10.4489C34.336 8.43792 37.7641 8.62814 39.7696 10.8565L23.3198 25.6942H23.2792C20.7453 27.7052 17.6152 28.8058 14.3632 28.8058Z"
              fill="#191919"
            />
          </svg>
          <h1 className="header-title text-2x1 font-bold">Formulate</h1>
        </div>
        
      </header>

      <main>
        
        <h2 ref={mainTitleRef} className="main-title">Formulate</h2>
        <p className="inline-block">Make beautiful </p>
        <div ref={typingTextRef} className="type text-lg font-semibold text-blue-600 h-8 mb-8"></div>
        <p ref={subtitleRef} className="subtitle">
          Design a website for your forms within seconds.
          <br />
          No code or manual input required.
        </p>
        {/* File Upload Section */}
        <div ref={fileUploadRef} className="file-upload">
          <form onSubmit={handleSendImage}>
            <input
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(event) => setSelectedImage(event.target.files[0])}
              disabled={selectedImage !== null}
              id="file-input"
            />
            <label htmlFor="file-input">
              <span>Drag and drop a file (Max size 50MB)</span>
              <svg
                className="upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 19L12 5M12 5L5 12M12 5L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            <input
              type="submit"
              value="Send Image"
              disabled={selectedImage === null}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
export default Home;
