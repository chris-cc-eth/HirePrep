"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lightbulb,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  modelAnswer: string;
  keyPoints: string[];
  followUps: string[];
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

const difficultyConfig = {
  Easy: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/30",
    gradient: "from-emerald-500 to-green-500",
  },
  Medium: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800/30",
    gradient: "from-amber-500 to-orange-500",
  },
  Hard: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800/30",
    gradient: "from-red-500 to-rose-500",
  },
};

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const keyPoints = question.keyPoints || [];
  const followUps = question.followUps || [];
  const config = difficultyConfig[question.difficulty];

  const copyToClipboard = async () => {
    const text = `Question ${index + 1}: ${question.question}\n\nDifficulty: ${
      question.difficulty
    }\nCategory: ${question.category}\n\nModel Answer:\n${
      question.modelAnswer
    }\n\nKey Points:\n${keyPoints
      .map((p) => `- ${p}`)
      .join("\n")}\n\nCommon Follow-ups:\n${followUps
      .map((f) => `- ${f}`)
      .join("\n")}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "glass-card overflow-hidden border-0 shadow-lg transition-all duration-300",
          "hover:shadow-xl hover:scale-[1.01]",
          isExpanded && "ring-2 ring-primary/20"
        )}
      >
        {/* Difficulty indicator bar */}
        <div className={cn("h-1 w-full bg-gradient-to-r", config.gradient)} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                    "bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700",
                    "text-muted-foreground border border-muted-foreground/10"
                  )}
                >
                  Q{index + 1}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                    config.bg,
                    config.text,
                    config.border,
                    "border"
                  )}
                >
                  <Zap className="h-3 w-3" />
                  {question.difficulty}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
                    "border border-blue-200/50 dark:border-blue-800/30"
                  )}
                >
                  {question.category}
                </span>
              </div>

              {/* Question */}
              <CardTitle className="text-lg leading-relaxed font-semibold">
                {question.question}
              </CardTitle>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8 hover:bg-muted"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "h-8 w-8 transition-colors",
                  isExpanded ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="space-y-4 pt-0">
                {/* Model Answer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                      Model Answer
                    </h4>
                  </div>
                  <div className="prose prose-sm max-w-none text-muted-foreground glass-subtle p-4 rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {question.modelAnswer}
                    </ReactMarkdown>
                  </div>
                </motion.div>

                {/* Key Points */}
                {keyPoints.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30">
                        <Lightbulb className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                        Key Points to Mention
                      </h4>
                    </div>
                    <ul className="grid gap-2">
                      {keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/20"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground/80">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Follow-up Questions */}
                {followUps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                        <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-400">
                        Common Follow-up Questions
                      </h4>
                    </div>
                    <ul className="grid gap-2">
                      {followUps.map((followUp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-800/20"
                        >
                          <span className="flex-shrink-0 text-purple-500 dark:text-purple-400 font-bold text-sm">
                            →
                          </span>
                          <span className="text-sm text-foreground/80 italic">
                            {followUp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
