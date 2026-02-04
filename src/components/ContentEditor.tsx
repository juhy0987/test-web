'use client';

import { useState, useEffect } from 'react';
import { extractHashtags } from '@/lib/utils';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  maxLength?: number;
}

export default function ContentEditor({ content, onChange, maxLength = 2000 }: ContentEditorProps) {
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    const tags = extractHashtags(content);
    setHashtags(tags);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      onChange(newContent);
    }
  };

  const remainingChars = maxLength - content.length;
  const isNearLimit = remainingChars <= 100;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Content
        </label>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your review here... Use # to create hashtags (max 10 hashtags)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={10}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-600">
            {hashtags.length > 0 && (
              <span>
                {hashtags.length} hashtag{hashtags.length !== 1 ? 's' : ''} detected
                {hashtags.length > 10 && (
                  <span className="text-amber-600 ml-1">
                    (only first 10 will be saved)
                  </span>
                )}
              </span>
            )}
          </div>
          <div className={`text-sm font-medium ${
            isNearLimit ? 'text-red-600' : 'text-gray-600'
          }`}>
            {remainingChars} characters remaining
          </div>
        </div>
      </div>

      {hashtags.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Detected Hashtags:</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.slice(0, 10).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}