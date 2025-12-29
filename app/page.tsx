"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResumeInput } from "@/components/ResumeInput";
import { JDInput } from "@/components/JDInput";
import { QuestionCard } from "@/components/QuestionCard";
import { PrepPlan } from "@/components/PrepPlan";
import { SkillGapAnalysis } from "@/components/SkillGapAnalysis";
import { HistorySidebar } from "@/components/HistorySidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Plus,
  Zap,
  ArrowRight,
  Brain,
} from "lucide-react";
import {
  useSavedInputs,
  useHistory,
  useLastInput,
  SavedHistory,
  SavedInput,
} from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  modelAnswer: string;
  keyPoints: string[];
  followUps: string[];
}

interface PrepPlanData {
  topicsToRevise: string[];
  timeline: string;
  resources: string[];
}

interface SkillGapAnalysisData {
  strengths: string[];
  gaps: string[];
  recommendations: string;
}

interface GenerateResponse {
  questions: Question[];
  prepPlan: PrepPlanData;
  skillGapAnalysis: SkillGapAnalysisData;
}

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Storage hooks
  const {
    savedInputs,
    saveInput,
    deleteInput,
    isLoaded: inputsLoaded,
  } = useSavedInputs();
  const {
    history,
    saveToHistory,
    deleteFromHistory,
    updateHistory,
    isLoaded: historyLoaded,
  } = useHistory();
  const {
    lastInput,
    saveLastInput,
    isLoaded: lastInputLoaded,
  } = useLastInput();

  // Restore last input on mount
  useEffect(() => {
    if (lastInputLoaded && lastInput && !resume && !jobDescription) {
      setResume(lastInput.resume);
      setJobDescription(lastInput.jobDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInputLoaded, lastInput]);

  // Auto-save last input when changed
  useEffect(() => {
    if (lastInputLoaded && (resume || jobDescription)) {
      saveLastInput(resume, jobDescription);
    }
  }, [resume, jobDescription, lastInputLoaded, saveLastInput]);

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentHistoryId(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate interview prep");
      }

      const data: GenerateResponse = await response.json();
      setResult(data);

      // Save to history
      const savedHistory = saveToHistory(resume, jobDescription, data);
      setCurrentHistoryId(savedHistory.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate interview prep");
      }

      const data: GenerateResponse = await response.json();
      setResult(data);

      // Save new history entry
      const savedHistory = saveToHistory(resume, jobDescription, data);
      setCurrentHistoryId(savedHistory.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueGenerate = async () => {
    if (!result || !resume.trim() || !jobDescription.trim()) return;

    setIsContinuing(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          existingQuestions: result.questions,
          mode: "continue",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate more questions");
      }

      const data: { questions: Question[] } = await response.json();

      // Merge new questions with existing ones
      const updatedResult: GenerateResponse = {
        ...result,
        questions: [...result.questions, ...data.questions],
      };
      setResult(updatedResult);

      // Update history if we have a current history ID
      if (currentHistoryId) {
        updateHistory(currentHistoryId, { result: updatedResult });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsContinuing(false);
    }
  };

  const handleStartOver = () => {
    setResult(null);
    setResume("");
    setJobDescription("");
    setError(null);
    setCurrentHistoryId(null);
  };

  const handleLoadHistory = (item: SavedHistory) => {
    setResume(item.resume);
    setJobDescription(item.jobDescription);
    setResult(item.result);
    setCurrentHistoryId(item.id);
    setError(null);
  };

  const handleLoadInput = (item: SavedInput) => {
    setResume(item.resume);
    setJobDescription(item.jobDescription);
    setResult(null);
    setCurrentHistoryId(null);
    setError(null);
  };

  const handleSaveCurrentInput = () => {
    if (resume.trim() && jobDescription.trim()) {
      const timestamp = new Date();
      const name = `Saved input - ${timestamp.toLocaleString()}`;
      saveInput(resume, jobDescription, name);
    }
  };

  // Don't render until storage is loaded
  if (!inputsLoaded || !historyLoaded || !lastInputLoaded) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
            <div className="relative glass-card p-4 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Loading HirePrep...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        savedInputs={savedInputs}
        onLoadHistory={handleLoadHistory}
        onLoadInput={handleLoadInput}
        onDeleteHistory={deleteFromHistory}
        onDeleteInput={deleteInput}
        onSaveCurrentInput={handleSaveCurrentInput}
        canSaveInput={!!resume.trim() && !!jobDescription.trim()}
      />

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div /> {/* Spacer */}
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-50" />
                <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold gradient-text dark:gradient-text-dark">
                HirePrep
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered interview preparation tailored to your resume and target
            role
          </p>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-subtle">
              <Brain className="h-3.5 w-3.5 text-purple-500" />
              GPT-4 Powered
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-subtle">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Smart Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-subtle">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Personalized Questions
            </span>
          </div>
        </motion.div>

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card border-0 shadow-2xl mb-8 overflow-hidden">
                {/* Gradient accent */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                      <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </span>
                    Get Started
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Upload or paste your resume and job description to generate
                    personalized interview questions
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResumeInput value={resume} onChange={setResume} />
                    <JDInput
                      value={jobDescription}
                      onChange={setJobDescription}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center text-xs">
                        !
                      </span>
                      {error}
                    </motion.div>
                  )}

                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={
                        isLoading || !resume.trim() || !jobDescription.trim()
                      }
                      size="lg"
                      className={cn(
                        "min-w-[220px] h-12 text-base font-semibold rounded-xl",
                        "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
                        "hover:from-blue-700 hover:via-purple-700 hover:to-pink-700",
                        "shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30",
                        "transition-all duration-300 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Interview Prep
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse" />
                <div className="relative glass-card p-6 rounded-2xl">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
                </div>
              </div>
              <p className="text-lg text-foreground font-medium mt-6">
                Analyzing your profile...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Generating personalized questions (20-30 seconds)
              </p>

              {/* Progress indicators */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-blue-500"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-purple-500"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-pink-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header with Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h2 className="text-3xl font-bold gradient-text dark:gradient-text-dark">
                    Your Interview Prep Package
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {(result.questions || []).length} questions generated •
                    Personalized for you
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handleStartOver}
                    disabled={isLoading || isContinuing}
                    className="rounded-xl glass-subtle border-0 hover:bg-muted"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    disabled={isLoading || isContinuing}
                    className="rounded-xl glass-subtle border-0 hover:bg-muted"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Error display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bento Grid Results */}
              <div className="space-y-6">
                {/* Skill Gap Analysis */}
                <SkillGapAnalysis analysis={result.skillGapAnalysis} />

                {/* Preparation Plan */}
                <PrepPlan plan={result.prepPlan} />

                {/* Questions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card border-0 shadow-xl overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold">
                              Interview Questions
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {(result.questions || []).length} tailored
                              questions
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleContinueGenerate}
                          disabled={isLoading || isContinuing}
                          className={cn(
                            "rounded-xl",
                            "bg-gradient-to-r from-indigo-500 to-purple-500",
                            "hover:from-indigo-600 hover:to-purple-600",
                            "shadow-lg shadow-purple-500/20"
                          )}
                        >
                          {isContinuing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              More Questions
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      <div className="grid gap-4">
                        {(result.questions || []).map((question, index) => (
                          <QuestionCard
                            key={index}
                            question={question}
                            index={index}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-4 pt-8 pb-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleStartOver}
                  disabled={isLoading || isContinuing}
                  className="rounded-xl glass-subtle border-0 hover:bg-muted"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinueGenerate}
                  disabled={isLoading || isContinuing}
                  className={cn(
                    "rounded-xl",
                    "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
                    "hover:from-blue-700 hover:via-purple-700 hover:to-pink-700",
                    "shadow-lg shadow-purple-500/25"
                  )}
                >
                  {isContinuing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating More...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate More Questions
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-muted-foreground/10 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1">
              Powered by{" "}
              <span className="font-medium gradient-text dark:gradient-text-dark">
                GPT-4
              </span>
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span>Built with Next.js 14</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
