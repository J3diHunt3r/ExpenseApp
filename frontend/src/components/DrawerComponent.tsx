import React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from '@/components/ui/drawer';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Dot, LabelList, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const DrawerComponent = ({ fullChartData }: { fullChartData: any[] }) => {
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="ml-4">Meta Charts</Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-y-auto max-h-[90vh]"> {/* Adjust max-height as per needs */}
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Charts</DrawerTitle>
            <DrawerDescription>View your full expense bar and line charts below.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col lg:flex-row justify-between gap-8 mt-8">
            {/* Bar Chart */}
            <Card className="flex-1 w-full lg:w-[50%]">
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Expenses from January to June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fullChartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="#8884d8" radius={[0, 10, 10, 0]}>
                        {/* Custom Labels Inside the Bars */}
                        <LabelList dataKey="value" position="insideLeft" offset={8} fontSize={12} fill="#fff" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="flex-1 w-full lg:w-[50%]">
              <CardHeader>
                <CardTitle>Line Chart - Dot</CardTitle>
                <CardDescription>Paginated Data</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fullChartData} margin={{ top: 24, left: 24, right: 24 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                      <Line
                        dataKey="value"
                        type="monotone"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={({ payload, ...props }) => (
                          <Dot
                            key={payload.name}
                            r={5}
                            cx={props.cx}
                            cy={props.cy}
                            fill={payload.fill || "#8884d8"}
                            stroke={payload.fill || "#8884d8"}
                          />
                        )}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
