'use client'

import { useEffect, useRef } from 'react'
import { extractHashtags, highlightHashtags } from '@/lib/hashtags'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
}

export default function TextEditor({
  value,
  onChange,
  maxLength = 2000,
  placeholder = '내용을 입력하세요',
}: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  const hashtags = extractHashtags(value)
  const isOverLimit = value.length > maxLength

  // Sync scroll between textarea and display
  const handleScroll = () => {
    if (textareaRef.current && displayRef.current) {
      displayRef.current.scrollTop = textareaRef.current.scrollTop
      displayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          내용
        </label>
        <div className="flex items-center gap-4">
          {hashtags.length > 0 && (
            <span className="text-xs text-gray-500">
              해시태그: {hashtags.length}/10
            </span>
          )}
          <span
            className={`text-sm ${
              isOverLimit ? 'text-red-600 font-bold' : 'text-gray-500'
            }`}
          >
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Hidden Display Layer with Highlighted Hashtags */}
        <div
          ref={displayRef}
          className="absolute inset-0 px-3 py-2 pointer-events-none overflow-auto whitespace-pre-wrap break-words"
          style={{
            color: 'transparent',
            caretColor: 'black',
            font: 'inherit',
          }}
          dangerouslySetInnerHTML={{
            __html: highlightHashtags(value) || placeholder,
          }}
        />

        {/* Actual Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="relative w-full min-h-[200px] px-3 py-2 bg-transparent resize-none focus:outline-none focus:ring-0"
          style={{
            caretColor: 'black',
          }}
        />
      </div>

      {/* Helper Text */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">
          '#'로 시작하는 단어는 자동으로 해시태그로 변환됩니다. (최대 10개)
        </p>
        {hashtags.length > 10 && (
          <p className="text-xs text-red-600">
            해시태그가 10개를 초과했습니다. 일부 해시태그를 제거해주세요.
          </p>
        )}
        {isOverLimit && (
          <p className="text-xs text-red-600">
            최대 글자 수를 초과했습니다.
          </p>
        )}
      </div>
    </div>
  )
}
