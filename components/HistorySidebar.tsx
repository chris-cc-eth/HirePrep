'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  History,
  Save,
  Trash2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Clock,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SavedHistory, SavedInput } from '@/lib/storage'

interface HistorySidebarProps {
  history: SavedHistory[]
  savedInputs: SavedInput[]
  onLoadHistory: (item: SavedHistory) => void
  onLoadInput: (item: SavedInput) => void
  onDeleteHistory: (id: string) => void
  onDeleteInput: (id: string) => void
  onSaveCurrentInput: () => void
  canSaveInput: boolean
}

export function HistorySidebar({
  history,
  savedInputs,
  onLoadHistory,
  onLoadInput,
  onDeleteHistory,
  onDeleteInput,
  onSaveCurrentInput,
  canSaveInput,
}: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history')

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'fixed top-4 right-4 z-50 shadow-lg transition-all duration-300',
          isOpen && 'right-[340px]'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <History className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[320px] bg-background border-l shadow-xl z-40 transition-transform duration-300 overflow-hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Saved Data</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'history' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('history')}
            >
              <Clock className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('saved')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Inputs
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No history yet</p>
                  <p className="text-xs mt-1">Generated prep packages will appear here</p>
                </div>
              ) : (
                history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onLoadHistory(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.result.questions.length} questions
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteHistory(item.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {/* Save Current Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={onSaveCurrentInput}
                disabled={!canSaveInput}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Current Input
              </Button>

              {savedInputs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No saved inputs</p>
                  <p className="text-xs mt-1">Save your resume & JD for quick access</p>
                </div>
              ) : (
                savedInputs.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onLoadInput(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {item.jobDescription.slice(0, 50)}...
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteInput(item.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
