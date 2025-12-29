# HirePrep - Copilot Instructions

## Architecture Overview

HirePrep is a Next.js 14 App Router application that generates AI-powered interview preparation using OpenAI GPT-4o. The data flow is:

1. **User Input** → `app/page.tsx` (client component managing form state)
2. **File Processing** → `components/ResumeInput.tsx` / `JDInput.tsx` use react-dropzone, PDFs parsed via `/api/parse-pdf`
3. **AI Generation** → POST to `/api/generate` with resume + job description
4. **Response Rendering** → Results displayed via `QuestionCard`, `PrepPlan`, `SkillGapAnalysis` components

## Key Conventions

### Component Patterns

- All page components use `'use client'` directive - this is a client-heavy interactive app
- UI primitives live in `components/ui/` using shadcn/ui pattern with `class-variance-authority`
- Always use the `cn()` utility from `lib/utils.ts` for conditional Tailwind classes
- Icons come from `lucide-react`, not other icon libraries

### API Routes

- Routes use Next.js App Router format: `app/api/[endpoint]/route.ts`
- The generate endpoint uses Edge Runtime (`export const runtime = 'edge'`)
- OpenAI responses use `response_format: { type: 'json_object' }` for structured output
- API key configured via `OPENAI_API_KEY` environment variable

### TypeScript Interfaces

Shared response types are defined inline in both `app/page.tsx` and `app/api/generate/route.ts`:

```typescript
interface Question {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  modelAnswer: string;
  keyPoints: string[];
  followUps: string[];
}
```

### Styling

- Tailwind CSS with shadcn/ui theming via CSS variables in `globals.css`
- Color tokens: `primary`, `secondary`, `muted`, `destructive`, `accent` (HSL-based)
- Use semantic classes like `text-muted-foreground`, `bg-primary/90` over raw colors

## Development Commands

```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Environment Setup

Required in `.env.local`:

```
OPENAI_API_KEY=sk-...
```

## File Organization

| Path                         | Purpose                                                |
| ---------------------------- | ------------------------------------------------------ |
| `app/api/generate/route.ts`  | Main AI endpoint with GPT-4o prompt engineering        |
| `app/api/parse-pdf/route.ts` | PDF text extraction using `pdf-parse`                  |
| `components/ui/`             | Reusable shadcn/ui primitives (Button, Card, Textarea) |
| `components/*.tsx`           | Feature components (ResumeInput, QuestionCard, etc.)   |

## Important Patterns

### Adding New UI Components

Follow shadcn/ui conventions - see `components/ui/button.tsx` as reference:

- Use `cva()` for variant definitions
- Forward refs with `React.forwardRef`
- Export both component and variants

### Modifying AI Prompts

The system prompt in `app/api/generate/route.ts` is carefully structured to:

- Generate 12-18 tech-stack-specific questions
- Produce structured JSON with questions, prepPlan, and skillGapAnalysis
- Maintain 70%+ technology-specific (not generic) questions

### Handling File Uploads

`ResumeInput.tsx` and `JDInput.tsx` share the same pattern:

- react-dropzone for drag/drop
- PDF files → POST to `/api/parse-pdf`
- Text files → direct `file.text()` reading
