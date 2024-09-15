import React, { useState, useEffect } from "react";
import { Frame, Page, LegacyCard, DataTable, TextField, Banner, Button } from "@shopify/polaris";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BsDisplay } from "react-icons/bs";
import "./dashboard.css";
import { ClipboardIcon } from "@shopify/polaris-icons";

const Display = ({ display, action }) => {
  if (display) <Button onClick={action}>Download CSV</Button>;
};

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();

  const formID = searchParams.get("id");

  const formData = useQuery(api.dashboard.getAllEntries, {
    taskListId: formID ? formID : "",
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(
      window.location.origin + "/form?id=" + formID
    );
    setShowAlert(true);
  }

  function downloadCSV() {
    var matrix = JSON.parse(JSON.stringify(formData[1]));
    matrix.unshift(formData[0]);
    const filename = formID + ".csv";

    // Step 1: Convert the matrix to CSV format
    const csvContent = matrix.map((row) => row.join(",")).join("\n");

    // Step 2: Create a Blob object for the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Step 3: Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;

    // Step 4: Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Step 5: Cleanup (remove the link and revoke the URL object)
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  // Example usage:

  if (!formData) {
    return (
      <Frame>
        <Page title={<h1 className="main-title">Data Dashboard</h1>}>
          <LegacyCard>
            <div className="p-4 text-center">Loading...</div>
          </LegacyCard>
        </Page>
      </Frame>
    );
  }
  return (

    
    <Frame>
      <a href="/" className="block">
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
        </a>
      <Page title={<h1 className="main-title">Data Dashboard</h1>}>
      <LegacyCard>
        <div className="p-4">
          {showAlert && (
            <Banner
              title="Link copied"
              status="success"
              onDismiss={() => setShowAlert(false)}
            >
              <p>The link has been copied to your clipboard.</p>
            </Banner>
          )}
          <div className="flex-div mb-4">
            <h2 className="text-lg datsub font-semibold mr-4">
              This is your data dashboard, <b>save this link</b>!
            </h2>
            <TextField
              label={<h1 className="label">Form URL</h1>}
              value={window.location.origin + "/form?id=" + formID}
              readOnly
              connectedRight={
                <Button
                  icon={ClipboardIcon}
                  onClick={copyToClipboard}
                  accessibilityLabel="Copy link"
                >
                  Copy
                  </Button>
              }
              />
            {}
          </div>
          <DataTable
            columnContentTypes={Array.from(
              { length: formData[0].length },
              (_, x) => x
            ).map((x) => "text")}
            headings={formData[0]}
            rows={formData[1]}
          />
          {formData[0].length > 0 && (
            <Button onClick={downloadCSV} className="mt-4">
              Download CSV
            </Button>
          )}
        </div>
      </LegacyCard>
      </Page>
    </Frame>
  );
};

export default Dashboard;
