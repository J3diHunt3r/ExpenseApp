import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table"; // Import ShadCN Table components
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Dot, Line, LineChart, Area, AreaChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DownloadIcon, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas";

const CsvUploadTable = () => {
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
  });


  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any>(null); // To hold column names dynamically
  const [filters, setFilters] = useState<Record<string, string>>({}); // To handle column filters
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        const file = acceptedFiles[0];
        handleFileUpload(file);
      }
    },
  });

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      complete: (result) => {
        const data = result.data;
        setCsvData(data);
        const headerColumns = result.meta.fields;
        setColumns(headerColumns);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  // Handle changes to filter inputs
  const handleFilterChange = (column: string, value: string) => {
    setFilters({
      ...filters,
      [column]: value,
    });
  };

  // Filter data based on the filters
  const getFilteredData = () => {
    return csvData.filter((row) => {
      return columns?.every((col: string) => {
        const filterValue = filters[col]?.toLowerCase() || "";
        return row[col]?.toString().toLowerCase().includes(filterValue);
      });
    });
  };

  // Pagination logic
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

    // Find columns dynamically based on header (assuming "title" and "amount" are in the CSV)
    const getChartData = () => {
        // Assume we are looking for columns named "title" and "amount"
        const titleColumn = columns?.find((col: string) => col.toLowerCase().includes("title"));
        const amountColumn = columns?.find((col: string) => col.toLowerCase().includes("amount"));
    
        // If columns are found, map the data accordingly
        if (titleColumn && amountColumn) {
          return csvData.map((row: any) => ({
            name: row[titleColumn], // Dynamic name based on the title column
            value: parseFloat(row[amountColumn]), // Dynamic value based on the amount column
          }));
        }
        return []; // Return empty array if columns are not found
      };
    
      // Prepare chart data based on CSV data
      const chartData = getChartData();

      // Function to download the page content as PDF
        const downloadPDF = () => {
          const content = document.getElementById("dashboardContent");
      
          if (content) {
            html2canvas(content, {
              scale: 2, // Increase resolution
              useCORS: true, // Handle CORS issues (for images)
              logging: true, // For debugging, you can log canvas issues
              backgroundColor: "#fff", // Background color to ensure white background
            }).then((canvas) => {
              // Create a new jsPDF instance
              const doc = new jsPDF();
              
              // Calculate the dimensions to scale it to A4 size
              const imgData = canvas.toDataURL("image/png");
              const imgWidth = 210; // A4 width in mm
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
              // Set margins
              const marginLeft = 10;
              const marginRight = 10;
              const availableWidth = imgWidth - marginLeft - marginRight;
              const scaledWidth = Math.min(imgWidth, availableWidth); // Ensure image does not overflow
              const offsetX = (imgWidth - scaledWidth) / 2; // Center image horizontally
              const offsetY = 10; // Starting vertical position
              let pageHeight = doc.internal.pageSize.height;
      
              // Initial page rendering
              doc.addImage(imgData, "PNG", offsetX, offsetY, scaledWidth, imgHeight);
              
              // Check if the content overflows the page height
              let contentHeight = offsetY + imgHeight;
              let currentHeight = contentHeight;
      
              // Add additional pages if content exceeds current page height
              while (currentHeight > pageHeight) {
                // Add a new page
                doc.addPage();
                // Reset the vertical offset for the new page
                doc.addImage(imgData, "PNG", offsetX, offsetY, scaledWidth, imgHeight);
                currentHeight -= pageHeight;
              }
      
              // Save the PDF
              doc.save("dashboard.pdf");
            });
          } else {
            console.error("Content not found for PDF download.");
          }
        };

  return (
    <div>
      <div className="p-2 max-w-1xl flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <Button className="flex items-center gap-2" onClick={downloadPDF}>
          <DownloadIcon className="w-5 h-5"/>
          Download to PDF
        </Button>
      </div>
      {/* File upload drop area */}
      <div className="p-2 max-w-1xl">
        <h2 className="text-xl font-semibold mb-4">Upload CSV Data</h2>
        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag & drop a CSV file here, or click to select one</p>
        </div>
      </div>
      <div id="dashboardContent">
      <div className="p-4 max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lowest Result</CardTitle>
            <CardDescription>Student with the least result</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {isPending
                ? "...Loading"
                : (() => {
                    // Find the column that represents the "amount" (or your desired numeric field)
                    const amountColumn = columns?.find((col: string) => col.toLowerCase().includes("amount"));
                    // If the column exists, find the row with the lowest value
                    if (amountColumn) {
                      const amountName = columns.find((col: string) => col.toLowerCase().includes("title"))
                      const lowestValueRow = csvData.reduce((lowest, current) => {
                        const currentValue = parseFloat(current[amountColumn] || 0);
                        const lowestValue = parseFloat(lowest[amountColumn] || 0);
                        return currentValue < lowestValue ? current : lowest;
                      }, csvData[0]);

                      return lowestValueRow
                        ? `Name: ${lowestValueRow[amountName] || "Unknown"}, Value: ${lowestValueRow[amountColumn]}`
                        : "No data available.";
                    }

                    return "No valid column found.";
                  })()}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Average Result</CardTitle>
            <CardDescription>Average of all results</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {isPending
                ? "...Loading"
                : (() => {
                    const amountColumn = columns?.find((col: string) => col.toLowerCase().includes("amount"));
                    if (amountColumn) {
                      const total = csvData.reduce((sum, current) => sum + parseFloat(current[amountColumn] || 0), 0);
                      const count = csvData.length;
                      const average = count > 0 ? (total / count).toFixed(2) : "No data";
                      return `Average Value: ${average}`;
                    }
                    return "No valid column found.";
                  })()}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Highest Result</CardTitle>
            <CardDescription>Student with the highest result</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {isPending
                ? "...Loading"
                : (() => {
                    const amountColumn = columns?.find((col: string) => col.toLowerCase().includes("amount"));
                    if (amountColumn) {
                      const amountName = columns.find((col: string) => col.toLowerCase().includes("title"));
                      const highestValueRow = csvData.reduce((highest, current) => {
                        const currentValue = parseFloat(current[amountColumn] || 0);
                        const highestValue = parseFloat(highest[amountColumn] || 0);
                        return currentValue > highestValue ? current : highest;
                      }, csvData[0]);

                      return highestValueRow
                        ? `Name: ${highestValueRow[amountName] || "Unknown"}, Value: ${highestValueRow[amountColumn]}`
                        : "No data available.";
                    }
                    return "No valid column found.";
                  })()}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Top 3 highest results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {isPending
                ? "...Loading"
                : (() => {
                    const amountColumn = columns?.find((col: string) => col.toLowerCase().includes("amount"));
                    if (amountColumn) {
                      const amountName = columns.find((col: string) => col.toLowerCase().includes("title"));
                      const sortedData = [...csvData].sort((a, b) => parseFloat(b[amountColumn] || 0) - parseFloat(a[amountColumn] || 0));
                      const topEntries = sortedData.slice(0, 3); // Adjust the number as needed
                      return topEntries.map(
                        (entry, index) =>
                          <li key={index}>
                            {`${entry[amountName] || "Unknown"}: ${entry[amountColumn]}`}
                          </li>
                      );
                    }
                    return "No valid column found.";
                  })()}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="flex max-w-full flex-col lg:flex-row gap-4 p-4">
      {/* Display CSV data in a DataTable */}
      {csvData.length > 0 && (
        <Card className="flex-1 w-full lg:w-[48%]">
          <CardHeader>
            <CardTitle>CSV Data Table</CardTitle>
            <CardDescription>Paginated and Filtered CSV Data</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="mb-4">
      {/* Table Filters */}
              <div className="flex flex-wrap gap-4">
                {columns?.map((col: string, index: number) => (
                  <div key={index} className="flex flex-col w-full sm:w-auto">
                    <label className="block text-sm font-medium mb-2">{col}</label>
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded text-black"
                      placeholder={`Filter by ${col}`}
                      value={filters[col] || ""}
                      onChange={(e) => handleFilterChange(col, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>


            <Table>
              <TableHeader>
                <TableRow>
                  {columns?.map((col: string, index: number) => (
                    <TableCell key={index}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    {columns?.map((col: string, i: number) => (
                      <TableCell key={i}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing filtered and paginated CSV data
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Display Line Chart based on CSV data */}
      {csvData.length > 0 && (
        <Card className="flex-1 w-full lg:w-[48%]">
          <CardHeader>
            <CardTitle>Line Chart - Dot</CardTitle>
            <CardDescription>Paginated Data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={500}>
              <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      top: 24, 
                      left: 74, 
                      right: 74, 
                      bottom: 150
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      minTickGap={20}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="value"
                      type="monotone"
                      stroke="var(--color-line)" // Line/border color
                      fill="#add8e6" // Area fill color
                      fillOpacity={0.4} // Adjust opacity as needed
                    />
                  </AreaChart>
                </ChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Student Results this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total Expenses for the last 6 months.
              Way's of improving blah blah blah
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
    </div>
    </div>
  );
};

export default CsvUploadTable;
function html2pdf() {
  throw new Error("Function not implemented.");
}

