import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import ChatBotIntegration from "./ChatBotIntegration";
import CsvUploadTable from "@/components/CsvUploadTableComponent";

// Import the CSV upload table component

export const Route = createFileRoute("/")({
  component: Index,
});

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get();
  if (!result.ok) {
    throw new Error("Server error");
  }
  const data = await result.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  // Handle loading and error states
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {/* Add the CSV upload table */}
        {/* <CsvUploadTable /> */}
      {/* ChatBot Integration */}
      <div className="max-w-5xl m-auto mt-8">
        <ChatBotIntegration />
      </div>
    </>
  );
}
