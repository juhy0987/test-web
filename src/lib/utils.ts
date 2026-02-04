/**
 * Extract hashtags from text (words starting with #)
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;
  const matches = text.match(hashtagRegex);
  
  if (!matches) return [];
  
  // Remove duplicates and limit to 10
  const uniqueHashtags = [...new Set(matches.map(tag => tag.slice(1)))];
  return uniqueHashtags.slice(0, 10);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG, and GIF files are allowed',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB',
    };
  }

  return { valid: true };
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Render text with clickable hashtags
 */
export function renderTextWithHashtags(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;
  let lastIndex = 0;
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    // Add text before hashtag
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add hashtag as clickable element
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}