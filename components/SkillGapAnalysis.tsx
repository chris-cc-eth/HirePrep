"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { SkillRadarChart } from "./SkillRadarChart";
import { cn } from "@/lib/utils";

interface SkillGapAnalysisProps {
  analysis: {
    strengths: string[];
    gaps: string[];
    recommendations: string;
  };
}

export function SkillGapAnalysis({ analysis }: SkillGapAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const strengths = analysis?.strengths || [];
  const gaps = analysis?.gaps || [];
  const recommendations = analysis?.recommendations || "";

  const copyToClipboard = async () => {
    const text = `Skill Gap Analysis\n\nStrengths:\n${strengths
      .map((s) => `✓ ${s}`)
      .join("\n")}\n\nGaps to Address:\n${gaps
      .map((g) => `• ${g}`)
      .join("\n")}\n\nRecommendations:\n${recommendations}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden border-0 shadow-xl">
        {/* Gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500" />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20">
                <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Skill Gap Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {strengths.length} strengths • {gaps.length} areas to improve
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-colors",
                  showChart && "bg-primary/10 text-primary"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {showChart ? "Hide Chart" : "Show Chart"}
              </Button>
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
                className="h-8 w-8 hover:bg-muted"
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
              <CardContent className="space-y-6 pt-4">
                {/* Radar Chart */}
                {showChart && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-subtle rounded-xl p-4"
                  >
                    <SkillRadarChart strengths={strengths} gaps={gaps} />
                  </motion.div>
                )}

                {/* Strengths & Gaps Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Your Strengths
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {strengths.map((strength, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-medium">
                            ✓
                          </span>
                          <span className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">
                            {strength}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Gaps */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400">
                        Gaps to Address
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {gaps.map((gap, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-medium">
                            !
                          </span>
                          <span className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                            {gap}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                      AI Recommendations
                    </h4>
                  </div>
                  <div className="prose prose-sm max-w-none text-muted-foreground bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 p-4 rounded-xl border border-purple-100/50 dark:border-purple-800/20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {recommendations}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
