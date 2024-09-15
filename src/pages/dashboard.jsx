import React from "react";
import { Page, LegacyCard, DataTable, TextField } from "@shopify/polaris";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BsDisplay } from "react-icons/bs";
import "./dashboard.css";
import { Button } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";

const Dashboard = () => {
  const [searchParams] = useSearchParams();

  const formID = searchParams.get("id");

  const formData = useQuery(api.dashboard.getAllEntries, {
    taskListId: formID ? formID : "",
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(
      window.location.hostname + "/form?id=" + formID
    );
    alert("Copied link to clipboard");
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

  // Example usage:

  if (!formData) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Page title="Data Dashboard">
        <h2>This is your data dashboard, save this link!</h2>
        <div className="flex-div">
          <h2>Your form share link:</h2>
          <h2 className="link">
            {window.location.hostname + "/form?id=" + formID}
          </h2>
          <Button
            icon={ClipboardIcon}
            accessibilityLabel="Add theme"
            onClick={copyToClipboard}
          />
        </div>
        <LegacyCard>
          <DataTable
            columnContentTypes={Array.from(
              { length: formData[0].length },
              (_, x) => x
            ).map((x) => "text")}
            headings={formData[0]}
            rows={formData[1]}
          />
        </LegacyCard>
        <Button onClick={downloadCSV}>Download CSV</Button>
      </Page>
    </div>
  );
};

export default Dashboard;
