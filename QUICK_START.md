# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up OpenAI API Key
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run the Development Server
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Using the Application

1. **Add Your Resume**
   - Drag & drop a PDF or TXT file, OR
   - Paste your resume text directly into the textarea

2. **Add Job Description**
   - Drag & drop a PDF or TXT file, OR
   - Paste the job description text directly into the textarea

3. **Generate Interview Prep**
   - Click the "Generate Interview Prep" button
   - Wait 20-30 seconds while AI analyzes and generates questions

4. **Review Your Results**
   - **Skill Gap Analysis**: See your strengths and gaps
   - **Preparation Plan**: Get a customized study plan
   - **Interview Questions**: 12-18 tailored questions with:
     - Difficulty levels (Easy/Medium/Hard)
     - Categories (Algorithms, System Design, Behavioral, etc.)
     - Model answers
     - Key points to mention
     - Common follow-up questions

5. **Use Copy Buttons**
   - Click the copy icon on any card to save content to clipboard

6. **Start Over**
   - Click "Start Over" button to generate prep for a different role

## Production Build

To create a production build:
```bash
npm run build
npm start
```

## Troubleshooting

### "OpenAI API key not configured"
- Make sure you created `.env.local` file
- Ensure your API key is correct
- Restart the dev server after creating `.env.local`

### PDF Upload Not Working
- Ensure the file is a valid PDF
- Try pasting text directly instead
- Check browser console for errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Cost Information

Each generation costs approximately $0.01-0.03 depending on:
- Length of resume and job description
- Number of questions generated (12-18)
- Complexity of the role

Monitor your usage at: https://platform.openai.com/usage

## Support

For issues or questions:
1. Check the full README.md
2. Review IMPLEMENTATION_SUMMARY.md
3. Check OpenAI API status: https://status.openai.com/
