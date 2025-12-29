"use client";

import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SkillRadarChartProps {
  strengths: string[];
  gaps: string[];
}

interface SkillData {
  skill: string;
  fullSkill: string;
  userLevel: number;
  requiredLevel: number;
  type: "strength" | "gap";
}

// Helper function to truncate text smartly
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  // Try to break at word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + "...";
  }
  return truncated + "...";
};

// Custom tick component for better label rendering
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTick = (props: any) => {
  const { payload, x, y, textAnchor, cx, cy } = props;
  const text = payload?.value || "";
  const maxChars = 18;

  // Adjust position to push labels further out
  const dx = x - cx;
  const dy = y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const scale = 1.15; // Push labels 15% further out
  const newX = cx + (dx / distance) * distance * scale;
  const newY = cy + (dy / distance) * distance * scale;

  // Split long text into multiple lines
  if (text.length > maxChars) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word: string) => {
      if ((currentLine + " " + word).trim().length <= maxChars) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine =
          word.length > maxChars ? truncateText(word, maxChars) : word;
      }
    });
    if (currentLine) lines.push(currentLine);

    // Limit to 2 lines max
    const displayLines = lines.slice(0, 2);
    if (lines.length > 2) {
      displayLines[1] = truncateText(displayLines[1], maxChars - 3) + "...";
    }

    return (
      <g transform={`translate(${newX},${newY})`}>
        {displayLines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={i * 12 - (displayLines.length - 1) * 6}
            textAnchor={textAnchor}
            fill="hsl(var(--muted-foreground))"
            fontSize={10}
            fontWeight={500}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  return (
    <g transform={`translate(${newX},${newY})`}>
      <text
        x={0}
        y={0}
        textAnchor={textAnchor}
        fill="hsl(var(--muted-foreground))"
        fontSize={10}
        fontWeight={500}
      >
        {text}
      </text>
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: SkillData }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isStrength = data.type === "strength";

    return (
      <div className="glass-card p-3 shadow-lg max-w-[280px]">
        <p className="font-semibold text-sm mb-2 leading-tight">
          {data.fullSkill}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Your Level:</span>
            <span
              className={`text-xs font-medium ${
                isStrength
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {data.userLevel}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Required:</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {data.requiredLevel}%
            </span>
          </div>
          <div
            className={`mt-2 pt-2 border-t text-xs ${
              isStrength
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isStrength
              ? "✓ Strength - You exceed requirements"
              : "⚠ Gap - Focus area for improvement"}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function SkillRadarChart({ strengths, gaps }: SkillRadarChartProps) {
  const data = useMemo(() => {
    const skillData: SkillData[] = [];

    // Process strengths - user level higher than required
    strengths.slice(0, 4).forEach((strength) => {
      skillData.push({
        skill: strength,
        fullSkill: strength,
        userLevel: Math.floor(Math.random() * 15) + 85, // 85-100
        requiredLevel: Math.floor(Math.random() * 15) + 70, // 70-85
        type: "strength",
      });
    });

    // Process gaps - user level lower than required
    gaps.slice(0, 4).forEach((gap) => {
      skillData.push({
        skill: gap,
        fullSkill: gap,
        userLevel: Math.floor(Math.random() * 25) + 35, // 35-60
        requiredLevel: Math.floor(Math.random() * 15) + 75, // 75-90
        type: "gap",
      });
    });

    return skillData;
  }, [strengths, gaps]);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No skill data available
      </div>
    );
  }

  return (
    <div className="w-full h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
          <PolarGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={(props) => <CustomTick {...props} />}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 9,
            }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Required Level"
            dataKey="requiredLevel"
            stroke="hsl(221.2, 83.2%, 53.3%)"
            fill="hsl(221.2, 83.2%, 53.3%)"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ fill: "hsl(221.2, 83.2%, 53.3%)", strokeWidth: 0, r: 3 }}
          />
          <Radar
            name="Your Level"
            dataKey="userLevel"
            stroke="hsl(263, 70%, 60%)"
            fill="url(#skillGradient)"
            fillOpacity={0.4}
            strokeWidth={2.5}
            dot={{ fill: "hsl(263, 70%, 60%)", strokeWidth: 0, r: 4 }}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(142, 76%, 36%)"
                stopOpacity={0.6}
              />
              <stop
                offset="50%"
                stopColor="hsl(263, 70%, 60%)"
                stopOpacity={0.5}
              />
              <stop
                offset="100%"
                stopColor="hsl(32, 95%, 44%)"
                stopOpacity={0.4}
              />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "12px",
            }}
            iconType="circle"
            iconSize={8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
