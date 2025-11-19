import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert technical interviewer. Based on the following resume and job description, generate exactly 15 tailored interview questions.

Resume:
${resume}

Job Description:
${jobDescription}

For each question, provide:
1. The question itself
2. A model answer (detailed and comprehensive)
3. Difficulty level (Easy, Medium, or Hard)
4. Category (e.g., Technical Skills, Behavioral, System Design, Problem Solving, etc.)

Also provide:
- Skill gaps: Areas where the candidate might need improvement based on the resume vs job requirements
- Preparation plan: A structured plan to address the skill gaps

Format your response as a JSON object with this structure:
{
  "questions": [
    {
      "question": "question text",
      "modelAnswer": "detailed answer",
      "difficulty": "Easy|Medium|Hard",
      "category": "category name"
    }
  ],
  "skillGaps": ["gap1", "gap2", ...],
  "preparationPlan": "detailed preparation plan in markdown format"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    
    if (!result) {
      throw new Error("No response from OpenAI");
    }

    const parsedResult = JSON.parse(result);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
