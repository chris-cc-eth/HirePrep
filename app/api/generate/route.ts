import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'
export const maxDuration = 60 // Allow up to 60 seconds

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

interface ContinueResponse {
  questions: Question[]
}

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription, existingQuestions, mode } = await request.json()

    if (!resume || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume and job description are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Handle continuation mode - generate more questions without duplicates
    if (mode === 'continue' && existingQuestions && Array.isArray(existingQuestions)) {
      const existingQuestionsText = existingQuestions
        .map((q: Question, i: number) => `${i + 1}. ${q.question}`)
        .join('\n')

      const continueSystemPrompt = `You are an expert technical interview coach. Generate additional interview questions based on a candidate's resume and job description.

**CRITICAL: DO NOT REPEAT ANY OF THE EXISTING QUESTIONS. Generate completely NEW and DIFFERENT questions.**

Generate questions that are HIGHLY SPECIFIC to technologies mentioned in the job description. Focus on:
- Different aspects of the same technologies
- Edge cases and advanced scenarios
- Alternative approaches and trade-offs
- Real-world problem-solving scenarios
- System design variations

Generate a JSON response with the following structure:
{
  "questions": [
    {
      "question": "string (NEW question - MUST NOT duplicate existing ones)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "category": "string (include the specific technology)",
      "modelAnswer": "string (detailed answer with examples)",
      "keyPoints": ["array of key points to mention"],
      "followUps": ["array of common follow-up questions"]
    }
  ]
}

Generate 6-10 NEW questions that are different from the existing ones.`

      const continueUserPrompt = `Resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\n**EXISTING QUESTIONS (DO NOT REPEAT THESE):**\n${existingQuestionsText}\n\nGenerate 6-10 NEW interview questions that are COMPLETELY DIFFERENT from the existing ones. Focus on different aspects, edge cases, and advanced scenarios.`

      // Use streaming for continuation mode
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: continueSystemPrompt },
          { role: 'user', content: continueUserPrompt },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
        stream: true,
      })

      // Collect the streamed response
      let fullContent = ''
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        fullContent += content
      }

      if (!fullContent) {
        throw new Error('No response from OpenAI')
      }

      const parsed = JSON.parse(fullContent)

      // Ensure questions array exists with defaults
      const result: ContinueResponse = {
        questions: (parsed.questions || []).map((q: Partial<Question>) => ({
          question: q.question || '',
          difficulty: q.difficulty || 'Medium',
          category: q.category || 'General',
          modelAnswer: q.modelAnswer || '',
          keyPoints: q.keyPoints || [],
          followUps: q.followUps || [],
        })),
      }
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Normal generation mode
    const systemPrompt = `You are an expert technical interview coach. Your task is to analyze a candidate's resume and a job description, then generate a comprehensive interview preparation package.

**CRITICAL INSTRUCTION - Tech Stack Specific Questions:**
First, carefully identify ALL specific technologies, frameworks, libraries, tools, and tech stacks mentioned in the job description. Examples include but are not limited to:
- Programming languages (Python, Java, TypeScript, Go, Rust, etc.)
- Frontend frameworks (React, Vue, Angular, Next.js, etc.)
- Backend frameworks (Node.js, Django, Spring Boot, FastAPI, etc.)
- Databases (PostgreSQL, MongoDB, Redis, DynamoDB, etc.)
- Cloud platforms (AWS, GCP, Azure) and specific services (Lambda, S3, EC2, etc.)
- DevOps tools (Docker, Kubernetes, Terraform, CI/CD pipelines, etc.)
- Data/ML tools (Spark, TensorFlow, PyTorch, Pandas, etc.)
- Other tools (GraphQL, REST, gRPC, Kafka, RabbitMQ, Elasticsearch, etc.)

Then generate questions that are HIGHLY SPECIFIC to these identified technologies. DO NOT generate generic questions like "How do you handle errors?" Instead, ask tech-specific questions like:
- "How does React's useEffect cleanup function work and when would you use it?"
- "Explain the difference between Redis persistence modes (RDB vs AOF)"
- "How would you optimize a slow PostgreSQL query involving multiple JOINs?"
- "Describe how Kubernetes handles pod scheduling and what factors influence it"

Generate a JSON response with the following structure:
{
  "questions": [
    {
      "question": "string (the interview question - MUST be specific to tech stack mentioned in JD)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "category": "string (include the specific technology, e.g., 'React Hooks', 'PostgreSQL Optimization', 'AWS Lambda', 'Kubernetes Networking', etc.)",
      "modelAnswer": "string (detailed answer with examples, can include markdown formatting)",
      "keyPoints": ["array of key points to mention"],
      "followUps": ["array of common follow-up questions - also tech-specific"]
    }
  ],
  "prepPlan": {
    "topicsToRevise": ["array of topics to study - be specific about which technologies to focus on"],
    "timeline": "string (suggested study timeline with breakdown, can use markdown)",
    "resources": ["array of recommended resources - include official docs and tutorials for specific technologies"]
  },
  "skillGapAnalysis": {
    "strengths": ["array of candidate's strengths based on resume - highlight matching technologies"],
    "gaps": ["array of skill gaps identified between resume and JD - be specific about which technologies"],
    "recommendations": "string (detailed recommendations to bridge gaps, can use markdown - suggest specific learning paths for each technology gap)"
  }
}

Generate 12-18 diverse questions. At least 70% of technical questions MUST be directly related to specific technologies mentioned in the job description. Include a mix of:
- Technology-specific deep-dive questions (e.g., React internals, database optimization, cloud architecture)
- System design questions using the specific tech stack from the JD
- Debugging/troubleshooting scenarios with the mentioned technologies
- Best practices and patterns for the specific frameworks/tools
- Behavioral questions related to working with these technologies in a team setting`

    const userPrompt = `Resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\nPlease analyze the job description carefully, identify ALL specific technologies and tech stacks mentioned, and generate a comprehensive interview preparation package with questions that are SPECIFIC to those technologies. Avoid generic questions - focus on the actual tech stack required for this role.`

    // Use streaming to avoid timeout
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      stream: true,
    })

    // Collect the streamed response
    let fullContent = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      fullContent += content
    }

    if (!fullContent) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(fullContent)

    // Ensure all required arrays exist with defaults
    const result: GenerateResponse = {
      questions: (parsed.questions || []).map((q: Partial<Question>) => ({
        question: q.question || '',
        difficulty: q.difficulty || 'Medium',
        category: q.category || 'General',
        modelAnswer: q.modelAnswer || '',
        keyPoints: q.keyPoints || [],
        followUps: q.followUps || [],
      })),
      prepPlan: {
        topicsToRevise: parsed.prepPlan?.topicsToRevise || [],
        timeline: parsed.prepPlan?.timeline || '',
        resources: parsed.prepPlan?.resources || [],
      },
      skillGapAnalysis: {
        strengths: parsed.skillGapAnalysis?.strengths || [],
        gaps: parsed.skillGapAnalysis?.gaps || [],
        recommendations: parsed.skillGapAnalysis?.recommendations || '',
      },
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error generating interview prep:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate interview preparation. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
