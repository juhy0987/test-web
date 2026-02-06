/**
 * Format numbers for display
 * - Values over 10,000: display as "1만", "2.5만", etc.
 * - Values over 1,000: display as "1k", "1.2k", etc.
 * - Values under 1,000: display as-is
 * 
 * @param count - The number to format
 * @returns Formatted string
 */
export function formatLikeCount(count: number): string {
  if (count >= 10000) {
    const manValue = count / 10000;
    // If it's a whole number, don't show decimal
    if (manValue % 1 === 0) {
      return `${Math.floor(manValue)}만`;
    }
    // Show one decimal place
    return `${manValue.toFixed(1)}만`;
  }
  
  if (count >= 1000) {
    const kValue = count / 1000;
    // If it's a whole number, don't show decimal
    if (kValue % 1 === 0) {
      return `${Math.floor(kValue)}k`;
    }
    // Show one decimal place
    return `${kValue.toFixed(1)}k`;
  }
  
  return count.toString();
}
