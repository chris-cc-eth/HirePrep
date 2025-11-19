'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PrepPlanProps {
  plan: {
    topicsToRevise: string[]
    timeline: string
    resources: string[]
  }
}

export function PrepPlan({ plan }: PrepPlanProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = `Preparation Plan\n\nTopics to Revise:\n${plan.topicsToRevise.map(t => `- ${t}`).join('\n')}\n\nTimeline:\n${plan.timeline}\n\nRecommended Resources:\n${plan.resources.map(r => `- ${r}`).join('\n')}`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">📚 Preparation Plan</CardTitle>
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
            <h4 className="font-semibold mb-2">Topics to Revise:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {plan.topicsToRevise.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Suggested Timeline:</h4>
            <div className="prose prose-sm max-w-none text-muted-foreground bg-background p-3 rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan.timeline}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recommended Resources:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {plan.resources.map((resource, i) => (
                <li key={i}>{resource}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
