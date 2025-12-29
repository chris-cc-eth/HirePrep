"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  X,
  User,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Enhanced AI detection patterns for resume content with weighted scoring
const detectResumeContent = (
  text: string
): { type: string; confidence: number; skills: string[] } | null => {
  if (!text || text.length < 100) return null;

  const lowerText = text.toLowerCase();
  const skillScores: Map<string, number> = new Map();

  // Tech skills detection with context-aware scoring
  const techPatterns = [
    { pattern: /\b(react|react\.js|reactjs)\b/gi, skill: "React", weight: 1 },
    { pattern: /\b(node|node\.js|nodejs)\b/gi, skill: "Node.js", weight: 1 },
    { pattern: /\b(python)\b/gi, skill: "Python", weight: 1 },
    { pattern: /\b(java)\b(?!script)/gi, skill: "Java", weight: 1 },
    { pattern: /\b(javascript)\b/gi, skill: "JavaScript", weight: 1 },
    { pattern: /\b(typescript)\b/gi, skill: "TypeScript", weight: 1 },
    { pattern: /\b(aws|amazon web services)\b/gi, skill: "AWS", weight: 1 },
    { pattern: /\b(docker)\b/gi, skill: "Docker", weight: 1 },
    { pattern: /\b(kubernetes|k8s)\b/gi, skill: "Kubernetes", weight: 1.2 },
    {
      pattern: /\b(sql|mysql|postgresql|postgres)\b/gi,
      skill: "SQL",
      weight: 0.8,
    },
    { pattern: /\b(mongodb|mongo)\b/gi, skill: "MongoDB", weight: 1 },
    { pattern: /\b(golang)\b/gi, skill: "Go", weight: 1.2 },
    { pattern: /\b(rust)\b/gi, skill: "Rust", weight: 1.2 },
    { pattern: /\b(c\+\+|cpp)\b/gi, skill: "C++", weight: 1 },
    {
      pattern: /\b(machine learning|deep learning)\b/gi,
      skill: "ML",
      weight: 1.5,
    },
    { pattern: /\b(tensorflow|pytorch|keras)\b/gi, skill: "ML", weight: 1.3 },
    {
      pattern: /\b(spring boot|spring framework)\b/gi,
      skill: "Spring",
      weight: 1.2,
    },
    { pattern: /\b(angular)\b/gi, skill: "Angular", weight: 1 },
    { pattern: /\b(vue|vue\.js|vuejs)\b/gi, skill: "Vue.js", weight: 1 },
    { pattern: /\b(next\.js|nextjs)\b/gi, skill: "Next.js", weight: 1.1 },
    { pattern: /\b(graphql)\b/gi, skill: "GraphQL", weight: 1.1 },
    { pattern: /\b(redis)\b/gi, skill: "Redis", weight: 0.9 },
    { pattern: /\b(kafka)\b/gi, skill: "Kafka", weight: 1.2 },
    { pattern: /\b(elasticsearch)\b/gi, skill: "Elasticsearch", weight: 1.1 },
  ];

  // Count occurrences and apply weights
  techPatterns.forEach(({ pattern, skill, weight }) => {
    const matches = text.match(pattern);
    if (matches) {
      const count = matches.length;
      const score = Math.min(count * weight, 5); // Cap at 5 to prevent single skill dominance
      skillScores.set(skill, (skillScores.get(skill) || 0) + score);
    }
  });

  // Check for skills in key sections (higher weight)
  const skillsSectionMatch = text.match(
    /skills?[:\s]*([^\n]+(?:\n(?![A-Z])[^\n]+)*)/i
  );
  if (skillsSectionMatch) {
    const skillsSection = skillsSectionMatch[1].toLowerCase();
    techPatterns.forEach(({ pattern, skill }) => {
      if (pattern.test(skillsSection)) {
        skillScores.set(skill, (skillScores.get(skill) || 0) + 2);
      }
    });
  }

  // Sort skills by score and get top ones
  const sortedSkills = Array.from(skillScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 6);

  // Role detection with scoring system
  const roleScores: Map<string, number> = new Map();

  const rolePatterns = [
    {
      patterns: [/software engineer/gi, /software developer/gi, /swe\b/gi],
      role: "Software Engineer",
    },
    {
      patterns: [
        /frontend engineer/gi,
        /front.?end developer/gi,
        /ui engineer/gi,
        /react developer/gi,
      ],
      role: "Frontend Engineer",
    },
    {
      patterns: [
        /backend engineer/gi,
        /back.?end developer/gi,
        /server.?side/gi,
        /api developer/gi,
      ],
      role: "Backend Engineer",
    },
    {
      patterns: [/full.?stack engineer/gi, /full.?stack developer/gi],
      role: "Full Stack Engineer",
    },
    {
      patterns: [
        /data scientist/gi,
        /ml engineer/gi,
        /machine learning engineer/gi,
        /ai engineer/gi,
      ],
      role: "Data/ML Engineer",
    },
    {
      patterns: [
        /devops engineer/gi,
        /sre\b/gi,
        /site reliability/gi,
        /platform engineer/gi,
        /infrastructure/gi,
      ],
      role: "DevOps Engineer",
    },
    {
      patterns: [/product manager/gi, /product owner/gi, /\bpm\b/gi],
      role: "Product Manager",
    },
    {
      patterns: [
        /ux designer/gi,
        /ui designer/gi,
        /product designer/gi,
        /user experience/gi,
      ],
      role: "UX Designer",
    },
    {
      patterns: [
        /mobile engineer/gi,
        /ios developer/gi,
        /android developer/gi,
        /mobile developer/gi,
      ],
      role: "Mobile Engineer",
    },
    {
      patterns: [/data engineer/gi, /etl developer/gi, /data architect/gi],
      role: "Data Engineer",
    },
    {
      patterns: [/security engineer/gi, /cybersecurity/gi, /infosec/gi],
      role: "Security Engineer",
    },
    {
      patterns: [
        /qa engineer/gi,
        /test engineer/gi,
        /sdet/gi,
        /quality assurance/gi,
      ],
      role: "QA Engineer",
    },
  ];

  rolePatterns.forEach(({ patterns, role }) => {
    let totalMatches = 0;
    patterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) totalMatches += matches.length;
    });
    if (totalMatches > 0) {
      roleScores.set(role, totalMatches);
    }
  });

  // Infer role from skills if no explicit role mentioned
  if (roleScores.size === 0 && sortedSkills.length > 0) {
    const frontendSkills = ["React", "Vue.js", "Angular", "Next.js", "CSS"];
    const backendSkills = [
      "Java",
      "Spring",
      "Node.js",
      "Go",
      "Python",
      "SQL",
      "MongoDB",
    ];
    const mlSkills = ["ML", "Python", "TensorFlow", "PyTorch"];
    const devopsSkills = ["Docker", "Kubernetes", "AWS", "Terraform"];

    const frontendCount = sortedSkills.filter((s) =>
      frontendSkills.includes(s)
    ).length;
    const backendCount = sortedSkills.filter((s) =>
      backendSkills.includes(s)
    ).length;
    const mlCount = sortedSkills.filter((s) => mlSkills.includes(s)).length;
    const devopsCount = sortedSkills.filter((s) =>
      devopsSkills.includes(s)
    ).length;

    if (mlCount >= 2) roleScores.set("Data/ML Engineer", mlCount);
    else if (devopsCount >= 2) roleScores.set("DevOps Engineer", devopsCount);
    else if (frontendCount >= 2 && backendCount >= 2)
      roleScores.set("Full Stack Engineer", frontendCount + backendCount);
    else if (frontendCount > backendCount)
      roleScores.set("Frontend Engineer", frontendCount);
    else if (backendCount > 0) roleScores.set("Backend Engineer", backendCount);
    else roleScores.set("Software Engineer", 1);
  }

  // Get the most likely role
  let type = "Tech Professional";
  let maxScore = 0;
  roleScores.forEach((score, role) => {
    if (score > maxScore) {
      maxScore = score;
      type = role;
    }
  });

  // Calculate confidence based on multiple factors
  let confidence = 50;

  // Add confidence for role matches
  if (maxScore >= 3) confidence += 25;
  else if (maxScore >= 2) confidence += 20;
  else if (maxScore >= 1) confidence += 15;

  // Add confidence for skill matches
  if (sortedSkills.length >= 5) confidence += 20;
  else if (sortedSkills.length >= 3) confidence += 15;
  else if (sortedSkills.length >= 1) confidence += 10;

  // Add confidence for text length (more content = more reliable)
  if (text.length > 2000) confidence += 10;
  else if (text.length > 1000) confidence += 5;

  // Cap confidence
  confidence = Math.min(confidence, 95);

  return sortedSkills.length > 0 || maxScore > 0
    ? { type, confidence, skills: sortedSkills }
    : null;
};

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragHovering, setIsDragHovering] = useState(false);

  // AI detection with debounce
  const detection = useMemo(() => detectResumeContent(value), [value]);

  // Simulate progress for visual feedback
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isUploading]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      setIsUploading(true);
      setUploadProgress(10);

      if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/parse-pdf", {
            method: "POST",
            body: formData,
          });
          setUploadProgress(100);
          const data = await response.json();
          onChange(data.text);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          alert("Failed to parse PDF. Please try pasting text instead.");
        }
      } else {
        const text = await file.text();
        setUploadProgress(100);
        onChange(text);
      }

      setTimeout(() => setIsUploading(false), 300);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragHovering(true),
    onDragLeave: () => setIsDragHovering(false),
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const clearFile = () => {
    setFileName("");
    onChange("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <label className="text-sm font-semibold">Resume</label>
        </div>
        <AnimatePresence>
          {fileName && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="max-w-[150px] truncate">{fileName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden",
          "border-2 border-dashed",
          isDragActive || isDragHovering
            ? "border-blue-500 bg-blue-500/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-blue-400/50 hover:bg-blue-500/5 glass-subtle"
        )}
      >
        <input {...getInputProps()} />

        {/* Animated background gradient */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            (isDragActive || isDragHovering) && "opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        </div>

        <div className="relative p-6 text-center">
          {/* Upload icon with animation */}
          <motion.div
            animate={
              isDragActive ? { y: [0, -5, 0], scale: 1.1 } : { y: 0, scale: 1 }
            }
            transition={{ repeat: isDragActive ? Infinity : 0, duration: 1 }}
            className="mx-auto mb-3"
          >
            <div
              className={cn(
                "inline-flex p-3 rounded-2xl transition-all duration-300",
                isDragActive
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/20"
              )}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
          </motion.div>

          <p
            className={cn(
              "text-sm font-medium transition-colors duration-300",
              isDragActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-foreground"
            )}
          >
            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF or TXT files supported
          </p>

          {/* Progress bar */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 w-full"
              >
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Textarea with preview */}
      <div className="relative">
        <Textarea
          placeholder="Or paste your resume text here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "min-h-[180px] font-mono text-sm resize-none rounded-xl",
            "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
            "border-muted-foreground/20 focus:border-blue-400/50",
            "transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/10"
          )}
        />

        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md">
          {value.length.toLocaleString()} chars
        </div>
      </div>

      {/* AI Detection Banner */}
      <AnimatePresence>
        {detection && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    AI Detected:
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {detection.type}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                      detection.confidence >= 80
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : detection.confidence >= 60
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                        : "bg-slate-500/20 text-slate-700 dark:text-slate-300"
                    )}
                    title="Detection confidence based on keyword matches and context"
                  >
                    {detection.confidence}% match
                  </span>
                </div>
                {detection.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {detection.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 text-muted-foreground border border-muted-foreground/10"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
