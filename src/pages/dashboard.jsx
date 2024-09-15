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
      </Page>
    </div>
  );
};

export default Dashboard;
