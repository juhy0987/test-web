/**
 * Extract hashtags from text
 * Matches Korean, English, and numbers after # symbol
 */
export function extractHashtags(text: string): string[] {
  const regex = /#([\w\uAC00-\uD7A3]+)/g
  const matches = text.match(regex)
  
  if (!matches) return []
  
  // Remove # symbol and get unique hashtags
  const hashtags = matches.map(tag => tag.substring(1))
  return Array.from(new Set(hashtags))
}

/**
 * Highlight hashtags in text with HTML
 */
export function highlightHashtags(text: string): string {
  return text.replace(
    /#([\w\uAC00-\uD7A3]+)/g,
    '<span class="hashtag">#$1</span>'
  )
}

/**
 * Validate hashtag count (max 10)
 */
export function validateHashtagCount(hashtags: string[]): {
  valid: boolean
  error?: string
} {
  if (hashtags.length > 10) {
    return {
      valid: false,
      error: '해시태그는 최대 10개까지만 허용됩니다.',
    }
  }
  return { valid: true }
}
