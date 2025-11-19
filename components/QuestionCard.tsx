'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface Question {
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  modelAnswer: string
  keyPoints: string[]
  followUps: string[]
}

interface QuestionCardProps {
  question: Question
  index: number
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = `Question ${index + 1}: ${question.question}\n\nDifficulty: ${question.difficulty}\nCategory: ${question.category}\n\nModel Answer:\n${question.modelAnswer}\n\nKey Points:\n${question.keyPoints.map(p => `- ${p}`).join('\n')}\n\nCommon Follow-ups:\n${question.followUps.map(f => `- ${f}`).join('\n')}`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Q{index + 1}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                difficultyColors[question.difficulty]
              )}>
                {question.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {question.category}
              </span>
            </div>
            <CardTitle className="text-lg leading-tight">{question.question}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <div>
            <h4 className="font-semibold text-sm mb-2">Model Answer:</h4>
            <div className="prose prose-sm max-w-none text-muted-foreground bg-muted/30 p-3 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.modelAnswer}</ReactMarkdown>
            </div>
          </div>

          {question.keyPoints.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Points to Mention:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {question.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {question.followUps.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Common Follow-up Questions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {question.followUps.map((followUp, i) => (
                  <li key={i}>{followUp}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
