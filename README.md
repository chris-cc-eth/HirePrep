# HirePrep

An AI-powered interview preparation application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. HirePrep generates tailored interview questions based on your resume and job description, complete with model answers, difficulty levels, and a personalized preparation plan.

## Features

- 📄 **Resume Upload**: Drag & drop or paste your resume (PDF or text format)
- 💼 **Job Description Analysis**: Input the job description for targeted questions
- 🤖 **AI-Powered Questions**: Generate 15 tailored interview questions using OpenAI GPT-4o
- 📊 **Skill Gap Analysis**: Identify areas where you need improvement
- 📝 **Preparation Plan**: Get a structured plan to address skill gaps
- 🎯 **Categorized Questions**: Questions organized by category (Technical Skills, Behavioral, System Design, etc.)
- 📈 **Difficulty Levels**: Questions tagged as Easy, Medium, or Hard
- 📋 **Copy Functionality**: Easily copy questions and answers for practice
- 🎨 **Beautiful UI**: Clean, responsive interface with collapsible cards

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **PDF Parsing**: pdf-parse
- **File Upload**: react-dropzone
- **Markdown Rendering**: react-markdown
- **AI**: OpenAI GPT-4o API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chris-cc-eth/HirePrep.git
cd HirePrep
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload Your Resume**: 
   - Drag and drop a PDF or text file, or
   - Paste your resume content directly into the textarea

2. **Add Job Description**:
   - Paste the job description you're applying for

3. **Generate Questions**:
   - Click "Generate Interview Questions"
   - Wait for the AI to analyze and generate personalized questions

4. **Review Results**:
   - Check identified skill gaps
   - Review the preparation plan
   - Expand each question card to see model answers
   - Copy questions for practice

## Project Structure

```
HirePrep/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # OpenAI API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── collapsible.tsx
│       └── textarea.tsx
├── lib/
│   └── utils.ts              # Utility functions
├── .env.example              # Environment variables template
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## API Routes

### POST /api/generate

Generates interview questions based on resume and job description.

**Request Body:**
```json
{
  "resume": "string",
  "jobDescription": "string"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "string",
      "modelAnswer": "string",
      "difficulty": "Easy|Medium|Hard",
      "category": "string"
    }
  ],
  "skillGaps": ["string"],
  "preparationPlan": "string (markdown)"
}
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [OpenAI](https://openai.com/)

