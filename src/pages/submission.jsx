import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./submission.css";

const Submission = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Navigate to a new page
    }, 3000);

    // Cleanup the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container">
      <h1 className="text main-txt">Thank you for your response!</h1>
      <h2 className="text second-txt">
        This page will redirect in 3 seconds...
      </h2>
    </div>
  );
};

export default Submission;
