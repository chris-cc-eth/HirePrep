# HirePrep - AI-Powered Interview Preparation

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intelligent interview preparation platform that generates personalized technical and behavioral interview questions based on your resume and target job description.

## Features

- 🤖 **AI-Powered Question Generation**: Get 12-18 tailored interview questions using GPT-4o
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
- 🌙 **Dark/Light Mode**: Toggle between themes for comfortable viewing
- 📊 **Visual Skill Radar**: Interactive chart showing your skill levels
- 💾 **Session History**: Save and revisit previous interview prep sessions
- ✨ **Beautiful UI**:
  - Responsive design with Tailwind CSS
  - shadcn/ui components
  - Collapsible/expandable question cards
  - Copy-to-clipboard functionality
  - Loading states and error handling

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## System Requirements

### Minimum Requirements

| Component      | Requirement                                      |
| -------------- | ------------------------------------------------ |
| **Node.js**    | v18.17.0 or higher                               |
| **npm**        | v9.0.0 or higher (or yarn v1.22+, pnpm v8+)      |
| **Memory**     | 512MB RAM minimum                                |
| **Disk Space** | ~200MB for dependencies                          |
| **OS**         | Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+) |

### Recommended for Development

| Component   | Recommendation                |
| ----------- | ----------------------------- |
| **Node.js** | v20.x LTS                     |
| **Memory**  | 2GB+ RAM                      |
| **IDE**     | VS Code with ESLint extension |

### Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 90+             |
| Firefox | 90+             |
| Safari  | 14+             |
| Edge    | 90+             |

---

## Tech Stack

| Category          | Technology                  |
| ----------------- | --------------------------- |
| **Framework**     | Next.js 14+ (App Router)    |
| **Language**      | TypeScript 5.4+             |
| **Styling**       | Tailwind CSS 3.4+           |
| **UI Components** | shadcn/ui + Radix UI        |
| **Icons**         | Lucide React                |
| **AI**            | OpenAI GPT-4o               |
| **Charts**        | Recharts                    |
| **Animations**    | Framer Motion               |
| **File Handling** | react-dropzone, pdf-parse   |
| **Markdown**      | react-markdown + remark-gfm |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/chris-cc-eth/HirePrep.git
cd HirePrep

# Install dependencies
npm install

# Set up environment variables
echo "OPENAI_API_KEY=your_api_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/chris-cc-eth/HirePrep.git
cd HirePrep
```

### Step 2: Install Dependencies

Using npm (recommended):

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Custom API endpoint (for proxies or Azure OpenAI)
# OPENAI_BASE_URL=https://api.openai.com/v1
```

> **📌 Getting an OpenAI API Key:**
>
> 1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
> 2. Sign up or log in to your account
> 3. Navigate to API Keys section
> 4. Click "Create new secret key"
> 5. Copy the key (starts with `sk-`)

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Step 5: Verify Installation

1. Open your browser to `http://localhost:3000`
2. You should see the HirePrep interface
3. Try uploading a sample resume and job description
4. Click "Generate Interview Prep" to verify API connectivity

---

## Configuration

### Environment Variables

| Variable          | Description         | Required | Default        |
| ----------------- | ------------------- | -------- | -------------- |
| `OPENAI_API_KEY`  | Your OpenAI API key | ✅ Yes   | -              |
| `OPENAI_BASE_URL` | Custom API endpoint | ❌ No    | OpenAI default |

### Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Create optimized production build        |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint for code quality checks       |

## Usage

1. **Upload/Paste Resume**: Drag & drop your resume (PDF or TXT) or paste the text directly
2. **Upload/Paste Job Description**: Add the job description for the role you're targeting
3. **Generate**: Click "Generate Interview Prep" and wait 20-30 seconds
4. **Review**: Explore your personalized:
   - Skill gap analysis with visual radar chart
   - Preparation plan with timeline
   - Interview questions with model answers
5. **Practice**: Use the copy buttons to save questions for practice
6. **Save Sessions**: Your interview prep sessions are automatically saved in history

---

## Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chris-cc-eth/HirePrep&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key)

#### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key

### Option 2: Docker

#### Build and Run with Docker

1. **Create Dockerfile** (if not exists):

   ```dockerfile
   FROM node:20-alpine AS base

   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Build the application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT=3000

   CMD ["node", "server.js"]
   ```

2. **Build the image**

   ```bash
   docker build -t hireprep .
   ```

3. **Run the container**
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=your_key hireprep
   ```

### Option 3: Self-Hosted (VPS/Cloud)

#### Prerequisites

- Node.js 18+ installed on server
- PM2 for process management (recommended)
- Nginx for reverse proxy (optional)

#### Steps

1. **Clone and build**

   ```bash
   git clone https://github.com/chris-cc-eth/HirePrep.git
   cd HirePrep
   npm ci --production=false
   npm run build
   ```

2. **Set up environment**

   ```bash
   echo "OPENAI_API_KEY=your_key" > .env.local
   ```

3. **Start with PM2**

   ```bash
   npm install -g pm2
   pm2 start npm --name "hireprep" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx (optional)**

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 4: Railway / Render / Fly.io

These platforms support Next.js out of the box:

1. Connect your GitHub repository
2. Set `OPENAI_API_KEY` in environment variables
3. Deploy automatically on push

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `OPENAI_API_KEY` securely
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting (optional)
- [ ] Set up CDN for static assets (optional)
- [ ] Configure proper CORS headers if needed

---

## API Reference

### POST /api/generate

Generates interview preparation package based on resume and job description.

**Request:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Your resume text...",
    "jobDescription": "Job description text..."
  }'
```

**Response:**

```json
{
  "questions": [
    {
      "question": "Explain your experience with React hooks",
      "difficulty": "Medium",
      "category": "React",
      "modelAnswer": "...",
      "keyPoints": ["...", "..."],
      "followUps": ["...", "..."]
    }
  ],
  "prepPlan": {
    "topics": [...],
    "timeline": "...",
    "resources": [...]
  },
  "skillGapAnalysis": {
    "strengths": [...],
    "gaps": [...],
    "recommendations": [...]
  }
}
```

### POST /api/parse-pdf

Extracts text content from PDF files.

**Request:** `multipart/form-data` with `file` field

**Response:**

```json
{
  "text": "Extracted text content from PDF..."
}
```

---

## Project Structure

```
HirePrep/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts         # Main AI generation endpoint (Edge Runtime)
│   │   └── parse-pdf/
│   │       └── route.ts         # PDF text extraction endpoint
│   ├── globals.css              # Global styles + CSS variables
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── textarea.tsx
│   ├── HistorySidebar.tsx       # Session history panel
│   ├── JDInput.tsx              # Job description input
│   ├── PrepPlan.tsx             # Preparation plan display
│   ├── QuestionCard.tsx         # Interview question card
│   ├── ResumeInput.tsx          # Resume upload component
│   ├── SkillGapAnalysis.tsx     # Gap analysis display
│   ├── SkillRadarChart.tsx      # Visual skill radar
│   └── ThemeToggle.tsx          # Dark/light mode toggle
├── lib/
│   ├── storage.ts               # Local storage utilities
│   └── utils.ts                 # Helper functions (cn, etc.)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## Security

### Best Practices

1. **API Key Security**

   - Never commit `.env.local` to version control
   - Use environment variables on deployment platforms
   - Rotate keys periodically

2. **Data Privacy**

   - All processing is done in-memory
   - No data is stored on servers
   - Session history is stored locally in browser

3. **Production Security**

   - Always use HTTPS in production
   - Consider implementing rate limiting
   - Keep dependencies updated

4. **Dependency Management**

   ```bash
   # Check for vulnerabilities
   npm audit

   # Update dependencies
   npm update
   ```

---

## Troubleshooting

### Common Issues

| Issue                  | Solution                                        |
| ---------------------- | ----------------------------------------------- |
| `OPENAI_API_KEY` error | Verify key in `.env.local` and restart server   |
| PDF parsing fails      | Ensure PDF is text-based, not scanned image     |
| Build fails            | Run `npm ci` to clean install dependencies      |
| Port 3000 in use       | Use `npm run dev -- -p 3001` for different port |

### Getting Help

- Check [existing issues](https://github.com/chris-cc-eth/HirePrep/issues)
- Open a new issue with reproduction steps
- Include error messages and environment details

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for new code
- Test changes locally before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- AI powered by [OpenAI](https://openai.com/)

---

<p align="center">
  <strong>⚠️ Cost Notice</strong><br>
  This application uses the OpenAI API which incurs costs based on usage.<br>
  Monitor your usage at the <a href="https://platform.openai.com/usage">OpenAI Platform</a>.
</p>
