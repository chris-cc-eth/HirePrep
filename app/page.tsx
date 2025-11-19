"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, ChevronDown, Copy, CheckCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Question {
  question: string;
  modelAnswer: string;
  difficulty: string;
  category: string;
}

interface GenerateResponse {
  questions: Question[];
  skillGaps: string[];
  preparationPlan: string;
}

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerateResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to parse PDF");
        }

        const data = await response.json();
        setResume(data.text);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Error parsing PDF file. Please try a text file or paste the content directly.");
      }
    } else {
      const text = await file.text();
      setResume(text);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!resume || !jobDescription) {
      alert("Please provide both resume and job description");
      return;
    }

    setLoading(true);
    setResults(null);

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
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">HirePrep</h1>
          <p className="text-gray-600">AI-powered interview preparation with tailored questions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload PDF/text or paste your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag & drop a PDF or text file, or click to select"}
                </p>
              </div>
              <Textarea
                placeholder="Or paste your resume here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the job description</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[320px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={loading || !resume || !jobDescription}
            size="lg"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Interview Questions"
            )}
          </Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gaps</CardTitle>
                <CardDescription>Areas to focus on based on the job requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {results.skillGaps.map((gap, index) => (
                    <li key={index} className="text-gray-700">
                      {gap}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preparation Plan</CardTitle>
                <CardDescription>Structured plan to address skill gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{results.preparationPlan}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4">Interview Questions</h2>
              <div className="space-y-4">
                {results.questions.map((q, index) => (
                  <Collapsible key={index}>
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-500">
                                  Question {index + 1}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(
                                    q.difficulty
                                  )}`}
                                >
                                  {q.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200">
                                  {q.category}
                                </span>
                              </div>
                              <CardTitle className="text-lg">{q.question}</CardTitle>
                            </div>
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">Model Answer</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      `Q: ${q.question}\n\nA: ${q.modelAnswer}`,
                                      index
                                    )
                                  }
                                >
                                  {copiedIndex === index ? (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="prose prose-sm max-w-none text-gray-700">
                                <ReactMarkdown>{q.modelAnswer}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
