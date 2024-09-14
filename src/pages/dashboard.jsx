import React from "react";
import { Page, LegacyCard, DataTable } from "@shopify/polaris";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Dashboard = () => {
  const [searchParams] = useSearchParams();

  const formID = searchParams.get("id");

  const formData = useQuery(api.dashboard.getAllEntries, {
    taskListId: formID ? formID : "",
  });

  console.log(formData);

  const rows = [
    ["Emerald Silk Gown", "$875.00", 124689, 140, "$122,500.00"],
    ["Mauve Cashmere Scarf", "$230.00", 124533, 83, "$19,090.00"],
    [
      "Navy Merino Wool Blazer with khaki chinos and yellow belt",
      "$445.00",
      124518,
      32,
      "$14,240.00",
    ],
  ];

  return (
    <div>
      <h1>Data Dashboard</h1>
      <Page title="Sales by product">
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              "text",
              "numeric",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={[
              "Product",
              "Price",
              "SKU Number",
              "Net quantity",
              "Net sales",
            ]}
            rows={rows}
            totals={["", "", "", 255, "$155,830.00"]}
          />
        </LegacyCard>
      </Page>
    </div>
  );
};

export default Dashboard;
