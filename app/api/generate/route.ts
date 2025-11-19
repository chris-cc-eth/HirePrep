import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

interface Question {
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  modelAnswer: string
  keyPoints: string[]
  followUps: string[]
}

interface PrepPlan {
  topicsToRevise: string[]
  timeline: string
  resources: string[]
}

interface SkillGapAnalysis {
  strengths: string[]
  gaps: string[]
  recommendations: string
}

interface GenerateResponse {
  questions: Question[]
  prepPlan: PrepPlan
  skillGapAnalysis: SkillGapAnalysis
}

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are an expert technical interview coach. Your task is to analyze a candidate's resume and a job description, then generate a comprehensive interview preparation package.

Generate a JSON response with the following structure:
{
  "questions": [
    {
      "question": "string (the interview question)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "category": "string (e.g., System Design, Algorithms, Data Structures, Behavioral, Architecture, etc.)",
      "modelAnswer": "string (detailed answer with examples, can include markdown formatting)",
      "keyPoints": ["array of key points to mention"],
      "followUps": ["array of common follow-up questions"]
    }
  ],
  "prepPlan": {
    "topicsToRevise": ["array of topics to study"],
    "timeline": "string (suggested study timeline with breakdown, can use markdown)",
    "resources": ["array of recommended resources"]
  },
  "skillGapAnalysis": {
    "strengths": ["array of candidate's strengths based on resume"],
    "gaps": ["array of skill gaps identified between resume and JD"],
    "recommendations": "string (detailed recommendations to bridge gaps, can use markdown)"
  }
}

Generate 12-18 diverse questions covering technical (algorithms, system design, architecture, data structures) and behavioral aspects. Ensure questions are tailored to the specific role and the candidate's background.`

    const userPrompt = `Resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\nPlease generate a comprehensive interview preparation package for this candidate.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0].message.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const result: GenerateResponse = JSON.parse(responseContent)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating interview prep:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview preparation. Please try again.' },
      { status: 500 }
    )
  }
}

