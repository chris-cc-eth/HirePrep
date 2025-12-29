"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BookOpen,
  Clock,
  Link2,
  Target,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrepPlanProps {
  plan: {
    topicsToRevise: string[];
    timeline: string;
    resources: string[];
  };
}

export function PrepPlan({ plan }: PrepPlanProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const topicsToRevise = plan?.topicsToRevise || [];
  const timeline = plan?.timeline || "";
  const resources = plan?.resources || [];

  const copyToClipboard = async () => {
    const text = `Preparation Plan\n\nTopics to Revise:\n${topicsToRevise
      .map((t) => `- ${t}`)
      .join(
        "\n"
      )}\n\nTimeline:\n${timeline}\n\nRecommended Resources:\n${resources
      .map((r) => `- ${r}`)
      .join("\n")}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-card overflow-hidden border-0 shadow-xl">
        {/* Gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Preparation Plan
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {topicsToRevise.length} topics • {resources.length} resources
                </p>
              </div>
            </div>
            <div className="flex gap-1">
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
              <CardContent className="pt-4">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Topics to Revise */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-subtle rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-400">
                        Topics to Revise
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {topicsToRevise.map((topic, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-blue-100/50 dark:border-blue-800/20"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground/80 leading-relaxed">
                            {topic}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Resources */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-subtle rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Link2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                        Recommended Resources
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {resources.map((resource, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-purple-100/50 dark:border-purple-800/20 group cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center">
                            <Link2 className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-foreground/80 leading-relaxed group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                            {resource}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Timeline - Full Width */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-subtle rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 className="font-semibold text-indigo-700 dark:text-indigo-400">
                        Suggested Timeline
                      </h4>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground bg-white/60 dark:bg-slate-800/40 p-4 rounded-lg border border-indigo-100/50 dark:border-indigo-800/20">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {timeline}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
