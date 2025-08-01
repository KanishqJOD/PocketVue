"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  dataKeys: {
    key: string;
    color: string;
    name?: string;
  }[];
  xAxisKey: string;
  loading?: boolean;
  error?: string | null;
  height?: number;
  formatter?: (value: number, name: string) => [string, string];
}

export default function BarChart({
  title,
  subtitle,
  data,
  dataKeys,
  xAxisKey,
  loading = false,
  error = null,
  height = 300,
  formatter = (value: number, name: string) => [`₹${value.toFixed(2)}`, name],
}: BarChartProps) {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  return (
    <Card className="bg-gradient-to-br from-[#111827] to-[#1a1f2e] text-white shadow-lg border border-gray-800 overflow-hidden">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-sm mb-4 text-muted-foreground">{subtitle}</p>
        )}

        {loading && (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <div className="animate-pulse">Loading data...</div>
          </div>
        )}

        {error && (
          <div className="h-[300px] flex items-center justify-center text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data} barGap={4}>
                <defs>
                  {dataKeys.map(({ key, color }) => (
                    <linearGradient
                      key={`gradient-${key}`}
                      id={`colorGradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#aaa" 
                  tick={{ fill: '#aaa' }} 
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  stroke="#aaa" 
                  tick={{ fill: '#aaa' }} 
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 33, 58, 0.9)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                  labelStyle={{ color: "#c3c3c3", fontWeight: "bold" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: number, name: string) => formatter(value, name)}
                  animationDuration={200}
                />
                <Legend 
                  wrapperStyle={{ color: "#fff", paddingTop: 16 }} 
                  iconType="circle"
                  iconSize={8}
                />
                {dataKeys.map(({ key, name }) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={name || key}
                    fill={`url(#colorGradient-${key})`}
                    radius={[8, 8, 0, 0]}
                    onMouseOver={() => setActiveBar(key)}
                    onMouseOut={() => setActiveBar(null)}
                    animationDuration={800}
                    className="drop-shadow-md"
                    style={{
                      filter: activeBar === key ? "drop-shadow(0 0 6px rgba(255,255,255,0.2))" : "none",
                      opacity: activeBar ? (activeBar === key ? 1 : 0.7) : 1,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}