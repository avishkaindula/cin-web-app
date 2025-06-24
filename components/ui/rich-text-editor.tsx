"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Link } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  // Simple markdown-like formatting
  const insertFormat = (format: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ""
    switch (format) {
      case "bold":
        newText = `**${selectedText}**`
        break
      case "italic":
        newText = `*${selectedText}*`
        break
      case "list":
        newText = `\n- ${selectedText}`
        break
      case "orderedList":
        newText = `\n1. ${selectedText}`
        break
      case "link":
        newText = `[${selectedText}](url)`
        break
      default:
        newText = selectedText
    }

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$1. $2</li>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
  }

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-2">
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("list")}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => insertFormat("link")}>
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {isPreview ? (
        <div
          className="min-h-[120px] p-3 border rounded-md bg-gray-50 dark:bg-gray-800"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px]"
          rows={6}
        />
      )}
    </div>
  )
}
