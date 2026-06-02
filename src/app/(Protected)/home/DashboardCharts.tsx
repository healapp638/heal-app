'use client'

import React from 'react';
import { FaHeart, FaUserFriends, FaHome } from 'react-icons/fa';

// -------------------------------------------------------------
// 1. REGISTRATION AREA CHART (SVG-based Line/Area Chart)
// -------------------------------------------------------------
interface DashboardDataPoint {
  count: number;
  date: string;
}

export function RegistrationAreaChart({ data }: { data: DashboardDataPoint[] }) {
  const [activePoint, setActivePoint] = React.useState<any>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white  p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center min-h-[300px]">
        <span className="text-black! font-medium">No signup activity data available</span>
      </div>
    );
  }

  // Sort by date chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Padding & SVG dimension
  const width = 600;
  const height = 250;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const counts = sortedData.map(d => d.count);
  const maxCount = Math.max(...counts, 5); // Fallback to min height scale of 5
  const minCount = 0;

  // Map data to x, y coordinates
  const points = sortedData.map((d, i) => {
    const x = paddingLeft + (i / (sortedData.length - 1 || 1)) * chartWidth;
    const y = height - paddingBottom - ((d.count - minCount) / (maxCount - minCount)) * chartHeight;
    return { x, y, ...d };
  });

  // Create path description for line and area
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }

  // Formatting date for label
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative  p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-lg font-bold text-maincolor! mb-4">User Signups Over Time</h3>
      <div className="relative w-full h-[250px]">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F66F76" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F66F76" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = height - paddingBottom - ratio * chartHeight;
            const val = Math.round(minCount + ratio * (maxCount - minCount));
            return (
              <g key={index}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="currentColor" 
                  className="text-gray-200 dark:text-gray-800" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-semibold">{val}</text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {/* Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#F66F76"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive points */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setActivePoint(p)}
              onMouseLeave={() => setActivePoint(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch target */}
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={activePoint?.date === p.date ? "6" : "4"}
                fill={activePoint?.date === p.date ? "#F66F76" : "#ffffff"}
                stroke="#F66F76"
                strokeWidth="2.5"
                className="transition-all text-black! duration-150"
              />
            </g>
          ))}

          {/* X Axis labels */}
          {points.map((p, i) => {
            const showLabel = points.length <= 6 || i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2) || (points.length <= 12 && i % 2 === 0);
            if (!showLabel) return null;
            return (
              <text key={i} x={p.x} y={height - paddingBottom + 20} textAnchor="middle" className="text-[10px] text-black! font-semibold">
                {formatDate(p.date)}
              </text>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {activePoint && (
          <div
            className="absolute bg-gray-900/90 dark:bg-gray-100/95 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-semibold shadow-xl border border-gray-700/50 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-100"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100 - 8}%`,
            }}
          >
            <div className="font-bold opacity-80">{formatDate(activePoint.date)}</div>
            <div className="text-sm mt-0.5">{activePoint.count} Signups</div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. DONUT CHART (SVG-based Pie/Donut Chart)
// -------------------------------------------------------------
interface ChartSlice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  title,
  data,
  totalLabel = "Total",
}: {
  title: string;
  data: { label: string; value: number }[];
  totalLabel?: string;
}) {
  const filteredData = data.filter(d => d.value > 0);
  const total = filteredData.reduce((acc, curr) => acc + curr.value, 0);

  // Curated modern pastel color palette that fits the Heal app branding
  const colors = [
    '#F66F76', // Main Brand Color (Salmon Pink)
    '#689A9C', // Muted Teal
    '#A8BBA2', // Sage Green
    '#FBBF24', // Amber Yellow
    '#A78BFA', // Soft Lavender
    '#FB7185', // Rose Pink
    '#38BDF8', // Sky Blue
    '#94A3B8', // Slate Gray
  ];

  const chartData: ChartSlice[] = filteredData.map((d, i) => ({
    label: d.label || "Direct / Unknown",
    value: d.value,
    color: colors[i % colors.length]
  }));

  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const center = 50; // SVG space is 100x100

  let currentOffset = 0;

  const [hoveredSlice, setHoveredSlice] = React.useState<ChartSlice | null>(null);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-bold text-maincolor! mb-4">{title}</h3>
      </div>
      
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="font-medium text-sm">No details recorded</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 my-auto">
          {/* Chart SVG */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                className="text-black!"
                strokeWidth={strokeWidth}
              />
              {chartData.map((slice, i) => {
                const percentage = slice.value / total;
                const strokeLength = percentage * circumference;
                const strokeOffset = currentOffset;
                currentOffset -= strokeLength;

                const isHovered = hoveredSlice?.label === slice.label;

                return (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(slice)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })}
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-black! uppercase tracking-widest truncate max-w-[120px]">
                {hoveredSlice ? hoveredSlice.label : totalLabel}
              </span>
              <span className="text-3xl font-black text-black!">
                {hoveredSlice ? hoveredSlice.value : total}
              </span>
              {hoveredSlice && (
                <span className="text-xs text-black! font-bold">
                  {((hoveredSlice.value / total) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          {/* Legends */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
            {chartData.map((slice, i) => {
              const isSelected = hoveredSlice?.label === slice.label;
              return (
                <div 
                  key={i} 
                  className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? 'bg-maincolor! scale-[1.02]' 
                      : ''
                  }`}
                  onMouseEnter={() => setHoveredSlice(slice)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border transition-all duration-150 ${
                        isSelected ? 'border-white' : 'border-transparent'
                      }`} 
                      style={{ backgroundColor: slice.color }} 
                    />
                    <span className={`font-semibold truncate capitalize transition-colors duration-150 ${
                      isSelected ? 'text-white!' : 'text-black!'
                    }`}>
                      {slice.label}
                    </span>
                  </div>
                  <span className={`font-bold ml-2 transition-colors duration-150 ${
                    isSelected ? 'text-white!' : 'text-black!'
                  }`}>
                    {slice.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. THEME ENGAGEMENT CHART (Horizontal Progress Bars)
// -------------------------------------------------------------
export function ThemeEngagementChart({ data }: { data: { theme_name: string; count: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white! p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center min-h-[300px]">
        <span className="text-gray-400 font-medium">No theme engagement data available</span>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Get modern UI icons for themes
  const getThemeIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'love':
        return <FaHeart className="text-rose-500 text-sm" />;
      case 'family':
        return <FaHome className="text-amber-500 text-sm" />;
      case 'friendship':
        return <FaUserFriends className="text-teal-500 text-sm" />;
      default:
        return <FaHeart className="text-[#F66F76] text-sm" />;
    }
  };

  return (
    <div className=" p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-bold text-maincolor! mb-4">Theme Engagement</h3>
      </div>
      <div className="flex flex-col gap-5 py-2 my-auto">
        {sortedData.map((item, index) => {
          const percentage = (item.count / maxCount) * 100;
          return (
            <div key={index} className="group flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white! flex items-center justify-center">
                    {getThemeIcon(item.theme_name)}
                  </span>
                  <span className="text-black! capitalize font-bold">{item.theme_name}</span>
                </div>
                <span className="font-extrabold text-black!">{item.count} responses</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
                <div
                  className="h-full rounded-full text-maincolor! transition-all duration-1000 ease-out origin-left"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundImage: item.theme_name.toLowerCase() === 'love' 
                      ? 'linear-gradient(90deg, #F472B6, #FB7185)' 
                      : item.theme_name.toLowerCase() === 'family' 
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)' 
                      : 'linear-gradient(90deg, #2DD4BF, #14B8A6)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
