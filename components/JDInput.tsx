'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface JDInputProps {
  value: string
  onChange: (value: string) => void
}

export function JDInput({ value, onChange }: JDInputProps) {
  const [fileName, setFileName] = useState<string>('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFileName(file.name)

    if (file.type === 'application/pdf') {
      // For PDF files, we'll send to API to parse
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        onChange(data.text)
      } catch (error) {
        console.error('Error parsing PDF:', error)
        alert('Failed to parse PDF. Please try pasting text instead.')
      }
    } else {
      // For text files
      const text = await file.text()
      onChange(text)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  })

  const clearFile = () => {
    setFileName('')
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Job Description</label>
        {fileName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{fileName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the job description here"
            : "Drag & drop job description (PDF or TXT), or click to browse"}
        </p>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Or paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>
    </div>
  )
}
