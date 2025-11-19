# InterviewForge - AI-Powered Interview Preparation

An intelligent interview preparation platform that generates personalized technical and behavioral interview questions based on your resume and target job description.

## Features

- 🤖 **AI-Powered Question Generation**: Get 12-18 tailored interview questions using GPT-4
- 📄 **Smart File Upload**: Support for PDF and text file uploads for both resume and job descriptions
- 🎯 **Personalized Analysis**: 
  - Skill gap analysis between your resume and job requirements
  - Customized preparation plan with topics to revise
  - Suggested timeline and resources
- 💡 **Comprehensive Question Details**:
  - Difficulty levels (Easy/Medium/Hard)
  - Categories (System Design, Algorithms, Behavioral, etc.)
  - Model answers with markdown support
  - Key points to mention
  - Common follow-up questions
- ✨ **Beautiful UI**: 
  - Responsive design with Tailwind CSS
  - shadcn/ui components
  - Collapsible/expandable question cards
  - Copy-to-clipboard functionality
  - Loading states and error handling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Lucide icons
- **AI**: OpenAI GPT-4o
- **File Handling**: react-dropzone, pdf-parse
- **Markdown**: react-markdown with remark-gfm

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

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

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload/Paste Resume**: Drag & drop your resume (PDF or TXT) or paste the text directly
2. **Upload/Paste Job Description**: Add the job description for the role you're targeting
3. **Generate**: Click "Generate Interview Prep" and wait 20-30 seconds
4. **Review**: Explore your personalized:
   - Skill gap analysis
   - Preparation plan
   - Interview questions with model answers
5. **Practice**: Use the copy buttons to save questions for practice

## Project Structure

```
HirePrep/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts         # Main AI generation endpoint
│   │   └── parse-pdf/
│   │       └── route.ts         # PDF parsing endpoint
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main home page
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── textarea.tsx
│   ├── ResumeInput.tsx          # Resume upload component
│   ├── JDInput.tsx              # Job description input component
│   ├── QuestionCard.tsx         # Interview question card
│   ├── PrepPlan.tsx             # Preparation plan display
│   └── SkillGapAnalysis.tsx     # Skill gap analysis display
├── lib/
│   └── utils.ts                 # Utility functions
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Security Notes

This application handles sensitive information (resumes and job descriptions). Please follow these security best practices:

1. **API Key Security**: Never commit your `.env.local` file or expose your OpenAI API key
2. **Data Privacy**: The application does not store any data permanently - all processing is done in-memory
3. **HTTPS**: Always use HTTPS in production to protect data in transit
4. **Dependencies**: Regularly update dependencies to get security patches
5. **Rate Limiting**: Consider implementing rate limiting to prevent API abuse

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## API Routes

### POST /api/generate
Generates interview preparation package based on resume and job description.

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
  "questions": [...],
  "prepPlan": {...},
  "skillGapAnalysis": {...}
}
```

### POST /api/parse-pdf
Parses PDF files and extracts text content.

**Request:** FormData with `file` field

**Response:**
```json
{
  "text": "extracted text content"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [OpenAI](https://openai.com/)

---

**Note**: This application requires an active OpenAI API key and will incur costs based on usage. Monitor your usage at the [OpenAI platform](https://platform.openai.com/usage).
