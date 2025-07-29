"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface DonutChartProps {
  title: string;
  subtitle?: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  colors?: string[];
  loading?: boolean;
  error?: string | null;
  centerText?: string;
  centerSubText?: string;
  height?: number;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => [string, string];
}

export default function DonutChart({
  title,
  subtitle,
  data,
  colors = ["#4361ee", "#3a0ca3", "#4cc9f0", "#4895ef", "#560bad"],
  loading = false,
  error = null,
  centerText,
  centerSubText,
  height = 300,
  showLegend = true,
  formatter = (value: number, name: string) => [`₹${value.toFixed(2)}`, name],
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

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
          <div style={{ height: `${height}px`, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {colors.map((color, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`colorGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={color}
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor={color}
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  isAnimationActive
                  animationDuration={800}
                  className="drop-shadow-lg"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={`url(#colorGradient-${index % colors.length})`}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={activeIndex === index ? 2 : 0}
                      style={{
                        filter: activeIndex === index ? "drop-shadow(0 0 6px rgba(255,255,255,0.3))" : "none",
                        transform: activeIndex === index ? "scale(1.03)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Pie>
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
                {showLegend && (
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ color: "#fff", paddingTop: 16 }}
                    iconType="circle"
                    iconSize={8}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text with enhanced styling */}
            {centerText && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                className="transition-all duration-300 ease-in-out"
              >
                <div className="text-2xl font-bold">{centerText}</div>
                {centerSubText && (
                  <div className="text-xs text-muted-foreground mt-1">{centerSubText}</div>
                )}
              </div>
            )}
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