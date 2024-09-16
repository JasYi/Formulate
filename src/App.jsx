import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Form from "./pages/form";
import UploadForm from "./pages/loading";
import Dashboard from "./pages/dashboard";
import Submission from "./pages/submission";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="loading" element={<UploadForm />} />
          <Route path="form" element={<Form />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submission" element={<Submission />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  );
}

export default App;
