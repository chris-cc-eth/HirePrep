'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResumeInput } from '@/components/ResumeInput'
import { JDInput } from '@/components/JDInput'
import { QuestionCard } from '@/components/QuestionCard'
import { PrepPlan } from '@/components/PrepPlan'
import { SkillGapAnalysis } from '@/components/SkillGapAnalysis'
import { HistorySidebar } from '@/components/HistorySidebar'
import { Loader2, Sparkles, RefreshCw, RotateCcw, Plus } from 'lucide-react'
import { useSavedInputs, useHistory, useLastInput, SavedHistory, SavedInput } from '@/lib/storage'

interface Question {
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  modelAnswer: string
  keyPoints: string[]
  followUps: string[]
}

interface PrepPlanData {
  topicsToRevise: string[]
  timeline: string
  resources: string[]
}

interface SkillGapAnalysisData {
  strengths: string[]
  gaps: string[]
  recommendations: string
}

interface GenerateResponse {
  questions: Question[]
  prepPlan: PrepPlanData
  skillGapAnalysis: SkillGapAnalysisData
}

export default function Home() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isContinuing, setIsContinuing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null)

  // Storage hooks
  const { savedInputs, saveInput, deleteInput, isLoaded: inputsLoaded } = useSavedInputs()
  const { history, saveToHistory, deleteFromHistory, updateHistory, isLoaded: historyLoaded } = useHistory()
  const { lastInput, saveLastInput, isLoaded: lastInputLoaded } = useLastInput()

  // Restore last input on mount
  useEffect(() => {
    if (lastInputLoaded && lastInput && !resume && !jobDescription) {
      setResume(lastInput.resume)
      setJobDescription(lastInput.jobDescription)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInputLoaded, lastInput])

  // Auto-save last input when changed
  useEffect(() => {
    if (lastInputLoaded && (resume || jobDescription)) {
      saveLastInput(resume, jobDescription)
    }
  }, [resume, jobDescription, lastInputLoaded, saveLastInput])

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setCurrentHistoryId(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate interview prep')
      }

      const data: GenerateResponse = await response.json()
      setResult(data)

      // Save to history
      const savedHistory = saveToHistory(resume, jobDescription, data)
      setCurrentHistoryId(savedHistory.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate interview prep')
      }

      const data: GenerateResponse = await response.json()
      setResult(data)

      // Save new history entry
      const savedHistory = saveToHistory(resume, jobDescription, data)
      setCurrentHistoryId(savedHistory.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueGenerate = async () => {
    if (!result || !resume.trim() || !jobDescription.trim()) return

    setIsContinuing(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          existingQuestions: result.questions,
          mode: 'continue',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate more questions')
      }

      const data: { questions: Question[] } = await response.json()

      // Merge new questions with existing ones
      const updatedResult: GenerateResponse = {
        ...result,
        questions: [...result.questions, ...data.questions],
      }
      setResult(updatedResult)

      // Update history if we have a current history ID
      if (currentHistoryId) {
        updateHistory(currentHistoryId, { result: updatedResult })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsContinuing(false)
    }
  }

  const handleStartOver = () => {
    setResult(null)
    setResume('')
    setJobDescription('')
    setError(null)
    setCurrentHistoryId(null)
  }

  const handleLoadHistory = (item: SavedHistory) => {
    setResume(item.resume)
    setJobDescription(item.jobDescription)
    setResult(item.result)
    setCurrentHistoryId(item.id)
    setError(null)
  }

  const handleLoadInput = (item: SavedInput) => {
    setResume(item.resume)
    setJobDescription(item.jobDescription)
    setResult(null)
    setCurrentHistoryId(null)
    setError(null)
  }

  const handleSaveCurrentInput = () => {
    if (resume.trim() && jobDescription.trim()) {
      const timestamp = new Date()
      const name = `Saved input - ${timestamp.toLocaleString()}`
      saveInput(resume, jobDescription, name)
    }
  }

  // Don't render until storage is loaded
  if (!inputsLoaded || !historyLoaded || !lastInputLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HirePrep
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered interview preparation tailored to your resume and target role
          </p>
        </div>

        {/* Input Section */}
        {!result && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Upload or paste your resume and the job description to generate personalized interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ResumeInput value={resume} onChange={setResume} />
                <JDInput value={jobDescription} onChange={setJobDescription} />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !resume.trim() || !jobDescription.trim()}
                  size="lg"
                  className="min-w-[200px]"
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
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">
              Analyzing your profile and generating personalized questions...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take 20-30 seconds
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Header with Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Your Interview Prep Package</h2>
                <p className="text-muted-foreground mt-1">
                  {(result.questions || []).length} questions generated • Personalized for you
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                  disabled={isLoading || isContinuing}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={isLoading || isContinuing}
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
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Skill Gap Analysis */}
            <SkillGapAnalysis analysis={result.skillGapAnalysis} />

            {/* Preparation Plan */}
            <PrepPlan plan={result.prepPlan} />

            {/* Questions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Interview Questions</h3>
                <Button
                  variant="secondary"
                  onClick={handleContinueGenerate}
                  disabled={isLoading || isContinuing}
                >
                  {isContinuing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate More Questions
                    </>
                  )}
                </Button>
              </div>
              <div className="grid gap-4">
                {(result.questions || []).map((question, index) => (
                  <QuestionCard key={index} question={question} index={index} />
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center gap-4 pt-8 pb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleStartOver}
                disabled={isLoading || isContinuing}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleContinueGenerate}
                disabled={isLoading || isContinuing}
              >
                {isContinuing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating More...
                  </>
                ) : (
                  <>
                    Generate More Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t text-sm text-muted-foreground">
          <p>Powered by GPT-4 • Built with Next.js 14</p>
        </footer>
      </div>
    </div>
  )
}
