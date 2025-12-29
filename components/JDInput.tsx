"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  X,
  Briefcase,
  Sparkles,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Enhanced AI detection patterns for job descriptions with weighted scoring
const detectJobType = (
  text: string
): {
  role: string;
  level: string;
  techStack: string[];
  confidence: number;
} | null => {
  if (!text || text.length < 100) return null;

  const techScores: Map<string, number> = new Map();

  // Tech stack detection with context-aware weights
  const techPatterns = [
    { pattern: /\b(react|react\.js|reactjs)\b/gi, skill: "React", weight: 1 },
    { pattern: /\b(node|node\.js|nodejs)\b/gi, skill: "Node.js", weight: 1 },
    { pattern: /\b(python)\b/gi, skill: "Python", weight: 1 },
    { pattern: /\bjava\b(?!\s*script)/gi, skill: "Java", weight: 1 },
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
    { pattern: /\b(graphql)\b/gi, skill: "GraphQL", weight: 1.1 },
    { pattern: /\b(redis)\b/gi, skill: "Redis", weight: 0.9 },
    {
      pattern: /\b(spring boot|spring framework|spring)\b/gi,
      skill: "Spring",
      weight: 1.2,
    },
    { pattern: /\b(angular)\b/gi, skill: "Angular", weight: 1 },
    { pattern: /\b(vue|vue\.js|vuejs)\b/gi, skill: "Vue.js", weight: 1 },
    { pattern: /\b(next\.js|nextjs)\b/gi, skill: "Next.js", weight: 1.1 },
    { pattern: /\b(kafka)\b/gi, skill: "Kafka", weight: 1.2 },
    { pattern: /\b(elasticsearch)\b/gi, skill: "Elasticsearch", weight: 1.1 },
    { pattern: /\b(terraform)\b/gi, skill: "Terraform", weight: 1.1 },
    { pattern: /\b(jenkins|ci\/cd)\b/gi, skill: "CI/CD", weight: 0.9 },
    {
      pattern: /\b(machine learning|deep learning|ml)\b/gi,
      skill: "ML",
      weight: 1.3,
    },
    { pattern: /\b(tensorflow|pytorch|keras)\b/gi, skill: "ML", weight: 1.3 },
  ];

  // Count occurrences and apply weights
  techPatterns.forEach(({ pattern, skill, weight }) => {
    const matches = text.match(pattern);
    if (matches) {
      const count = matches.length;
      const score = Math.min(count * weight, 5);
      techScores.set(skill, (techScores.get(skill) || 0) + score);
    }
  });

  // Check for required/preferred sections (higher weight)
  const requirementsMatch = text.match(
    /(?:required|requirements|must have|qualifications)[:\s]*([^]*?)(?=(?:preferred|nice to have|bonus|responsibilities|about|$))/i
  );
  if (requirementsMatch) {
    const reqSection = requirementsMatch[1];
    techPatterns.forEach(({ pattern, skill }) => {
      if (pattern.test(reqSection)) {
        techScores.set(skill, (techScores.get(skill) || 0) + 2);
      }
    });
  }

  // Sort and get top tech stack
  const techStack = Array.from(techScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .slice(0, 8);

  // Role detection with scoring
  const roleScores: Map<string, number> = new Map();

  const rolePatterns = [
    {
      patterns: [
        /frontend engineer/gi,
        /front.?end developer/gi,
        /ui engineer/gi,
        /react engineer/gi,
        /frontend developer/gi,
      ],
      role: "Frontend Engineer",
    },
    {
      patterns: [
        /backend engineer/gi,
        /back.?end developer/gi,
        /server.?side engineer/gi,
        /api engineer/gi,
        /backend developer/gi,
      ],
      role: "Backend Engineer",
    },
    {
      patterns: [
        /full.?stack engineer/gi,
        /full.?stack developer/gi,
        /full stack/gi,
      ],
      role: "Full Stack Engineer",
    },
    {
      patterns: [
        /data scientist/gi,
        /ml engineer/gi,
        /machine learning engineer/gi,
        /ai engineer/gi,
        /applied scientist/gi,
      ],
      role: "Data/ML Engineer",
    },
    {
      patterns: [
        /devops engineer/gi,
        /\bsre\b/gi,
        /site reliability engineer/gi,
        /platform engineer/gi,
        /infrastructure engineer/gi,
        /cloud engineer/gi,
      ],
      role: "DevOps/SRE",
    },
    {
      patterns: [/product manager/gi, /product owner/gi, /technical pm/gi],
      role: "Product Manager",
    },
    {
      patterns: [
        /mobile engineer/gi,
        /ios engineer/gi,
        /android engineer/gi,
        /mobile developer/gi,
        /react native/gi,
        /flutter developer/gi,
      ],
      role: "Mobile Engineer",
    },
    {
      patterns: [
        /data engineer/gi,
        /etl developer/gi,
        /data architect/gi,
        /analytics engineer/gi,
      ],
      role: "Data Engineer",
    },
    {
      patterns: [
        /security engineer/gi,
        /cybersecurity/gi,
        /application security/gi,
        /security analyst/gi,
      ],
      role: "Security Engineer",
    },
    {
      patterns: [
        /qa engineer/gi,
        /test engineer/gi,
        /sdet/gi,
        /quality assurance/gi,
        /automation engineer/gi,
      ],
      role: "QA Engineer",
    },
    {
      patterns: [
        /software engineer/gi,
        /software developer/gi,
        /sde\b/gi,
        /engineer/gi,
        /developer/gi,
      ],
      role: "Software Engineer",
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

  // Infer role from tech stack if ambiguous
  if (
    roleScores.size === 0 ||
    (roleScores.get("Software Engineer") && roleScores.size === 1)
  ) {
    const frontendSkills = ["React", "Vue.js", "Angular", "Next.js"];
    const backendSkills = [
      "Java",
      "Spring",
      "Node.js",
      "Go",
      "Python",
      "SQL",
      "MongoDB",
      "Redis",
      "Kafka",
    ];
    const mlSkills = ["ML", "Python"];
    const devopsSkills = ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"];

    const frontendCount = techStack.filter((s) =>
      frontendSkills.includes(s)
    ).length;
    const backendCount = techStack.filter((s) =>
      backendSkills.includes(s)
    ).length;
    const mlCount = techStack.filter((s) => mlSkills.includes(s)).length;
    const devopsCount = techStack.filter((s) =>
      devopsSkills.includes(s)
    ).length;

    // More specific role inference
    if (mlCount >= 2)
      roleScores.set(
        "Data/ML Engineer",
        (roleScores.get("Data/ML Engineer") || 0) + mlCount * 2
      );
    else if (devopsCount >= 3)
      roleScores.set(
        "DevOps/SRE",
        (roleScores.get("DevOps/SRE") || 0) + devopsCount * 2
      );
    else if (frontendCount >= 2 && backendCount < 2)
      roleScores.set(
        "Frontend Engineer",
        (roleScores.get("Frontend Engineer") || 0) + frontendCount * 2
      );
    else if (backendCount >= 3 && frontendCount < 2)
      roleScores.set(
        "Backend Engineer",
        (roleScores.get("Backend Engineer") || 0) + backendCount * 2
      );
    else if (frontendCount >= 2 && backendCount >= 2)
      roleScores.set(
        "Full Stack Engineer",
        (roleScores.get("Full Stack Engineer") || 0) +
          (frontendCount + backendCount)
      );
  }

  // Get most likely role
  let role = "Software Engineer";
  let maxScore = 0;
  roleScores.forEach((score, r) => {
    if (score > maxScore) {
      maxScore = score;
      role = r;
    }
  });

  // Level detection with better patterns
  let level = "Mid-Level";
  const levelPatterns = [
    {
      patterns: [
        /senior\s+(?:software\s+)?engineer/gi,
        /sr\.\s+engineer/gi,
        /\bsenior\b/gi,
        /\blead\b/gi,
        /principal/gi,
        /staff engineer/gi,
        /\biii\b/gi,
        /level\s*[3-5]/gi,
      ],
      level: "Senior",
    },
    {
      patterns: [
        /junior\s+(?:software\s+)?engineer/gi,
        /jr\.\s+engineer/gi,
        /\bjunior\b/gi,
        /entry.?level/gi,
        /new grad/gi,
        /graduate/gi,
        /\bintern\b/gi,
        /\bi\b(?=\s+engineer|\s+developer)/gi,
      ],
      level: "Junior",
    },
    {
      patterns: [
        /engineering manager/gi,
        /tech lead/gi,
        /director/gi,
        /head of/gi,
        /vp of engineering/gi,
        /chief/gi,
      ],
      level: "Leadership",
    },
  ];

  let levelMaxScore = 0;
  levelPatterns.forEach(({ patterns, level: lvl }) => {
    let totalMatches = 0;
    patterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) totalMatches += matches.length;
    });
    if (totalMatches > levelMaxScore) {
      levelMaxScore = totalMatches;
      level = lvl;
    }
  });

  // Check for years of experience to infer level
  const yearsMatch = text.match(
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i
  );
  if (yearsMatch && levelMaxScore === 0) {
    const years = parseInt(yearsMatch[1]);
    if (years >= 7) level = "Senior";
    else if (years >= 3) level = "Mid-Level";
    else level = "Junior";
  }

  // Calculate confidence
  let confidence = 50;
  if (maxScore >= 3) confidence += 20;
  else if (maxScore >= 1) confidence += 10;
  if (techStack.length >= 5) confidence += 20;
  else if (techStack.length >= 3) confidence += 15;
  else if (techStack.length >= 1) confidence += 10;
  if (levelMaxScore >= 2) confidence += 10;
  else if (levelMaxScore >= 1) confidence += 5;
  if (text.length > 1500) confidence += 10;
  confidence = Math.min(confidence, 95);

  return techStack.length > 0 || maxScore > 0
    ? { role, level, techStack, confidence }
    : null;
};

export function JDInput({ value, onChange }: JDInputProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragHovering, setIsDragHovering] = useState(false);

  // AI detection
  const detection = useMemo(() => detectJobType(value), [value]);

  // Simulate progress
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
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <label className="text-sm font-semibold">Job Description</label>
        </div>
        <AnimatePresence>
          {fileName && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <FileText className="h-4 w-4 text-purple-500" />
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
            ? "border-purple-500 bg-purple-500/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-purple-400/50 hover:bg-purple-500/5 glass-subtle"
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-pulse" />
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
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 group-hover:shadow-lg group-hover:shadow-purple-500/20"
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
                ? "text-purple-600 dark:text-purple-400"
                : "text-foreground"
            )}
          >
            {isDragActive
              ? "Drop the job description here"
              : "Drag & drop job description"}
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
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
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

      {/* Textarea */}
      <div className="relative">
        <Textarea
          placeholder="Or paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "min-h-[180px] font-mono text-sm resize-none rounded-xl",
            "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
            "border-muted-foreground/20 focus:border-purple-400/50",
            "transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
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
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    AI Detected:
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {detection.role}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {detection.level}
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
                {detection.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {detection.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 text-muted-foreground border border-muted-foreground/10"
                      >
                        {tech}
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
