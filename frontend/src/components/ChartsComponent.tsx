// components/ChartsComponent.tsx
"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, Dot } from "recharts";
import { TrendingUp } from "lucide-react";

const ChartsComponent = ({ chartData }: { chartData: any[] }) => {
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 mt-8">
      {/* Bar Chart */}
      <Card className="lg:w-[450px] w-full m-auto">
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
          <CardDescription>Just a basic bar chart</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            width={400}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip contentStyle={{ color: "black" }} />
            <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="lg:w-[450px] w-full m-auto">
        <CardHeader>
          <CardTitle>Line Chart - Dot</CardTitle>
          <CardDescription>Paginated Data</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
                top: 24,
                left: 24,
                right: 24,
            }}
            >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
                cursor={false}
                content={
                <ChartTooltipContent
                    indicator="line"
                />
                }
            />
            <Line
                dataKey="value"
                type="monotone" // Ensures a smooth curve
                stroke="#8884d8" // Use a fallback color if CSS variable fails
                strokeWidth={2}
                dot={({ payload, ...props }) => (
                <Dot
                    key={payload.name}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill || "#8884d8"} // Default to fallback color
                    stroke={payload.fill || "#8884d8"}
                />
                )}
            />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total Expenses for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChartsComponent;
