'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Copy, Check, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SkillGapAnalysisProps {
  analysis: {
    strengths: string[]
    gaps: string[]
    recommendations: string
  }
}

export function SkillGapAnalysis({ analysis }: SkillGapAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = `Skill Gap Analysis\n\nStrengths:\n${analysis.strengths.map(s => `✓ ${s}`).join('\n')}\n\nGaps to Address:\n${analysis.gaps.map(g => `• ${g}`).join('\n')}\n\nRecommendations:\n${analysis.recommendations}`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-xl">Skill Gap Analysis</CardTitle>
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
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-green-700">✓ Your Strengths:</h4>
            <ul className="space-y-1 text-sm">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-amber-700">⚠️ Gaps to Address:</h4>
            <ul className="space-y-1 text-sm">
              {analysis.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span className="text-muted-foreground">{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">💡 Recommendations:</h4>
            <div className="prose prose-sm max-w-none text-muted-foreground bg-white p-3 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.recommendations}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
