import React from 'react';
import './App.css'; // Import your CSS for styling
import { Spinner } from '@shopify/polaris'; // Or any other spinner from a library like react-icons

function UploadForm() {
  return (
    <div className="container">
      {/* Left Panel: Progress Section */}
      <div className="left-panel">
        {/* Back arrow */}
        <div className="back-button">
          <span>&larr;</span>
        </div>

        {/* Title */}
        <h1 className="title">Upload form</h1>

        {/* Progress Steps */}
        <ul className="progress-list">
          <li className="progress-item">
            <span className="checkmark">✔</span>
            Detecting questions and answer fields.
          </li>
          <li className="progress-item">
            <span className="checkmark">✔</span>
            Completed JSON conversion.
          </li>
          <li className="progress-item">
            <span className="checkmark">✔</span>
            Created database.
          </li>
          <li className="progress-item">
            <Spinner accessibilityLabel="Loading..." size="small" /> Finishing touches...
          </li>
        </ul>
      </div>

      {/* Right Panel: Form Preview */}
      <div className="right-panel">
        <img
          src="https://via.placeholder.com/300x400.png" // Replace with your actual image URL or file path
          alt="Form Preview"
          className="form-preview"
        />
      </div>
    </div>
  );
}

export default UploadForm;
