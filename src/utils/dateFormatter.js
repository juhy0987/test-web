import { formatDistanceToNow, format, isToday, isYesterday, differenceInMinutes } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format date for comment display
 * Shows relative time for recent comments, absolute date for older ones
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatCommentDate = (date) => {
  const commentDate = new Date(date)
  const now = new Date()
  const minutesDiff = differenceInMinutes(now, commentDate)

  // Less than 1 hour: "X분 전"
  if (minutesDiff < 60) {
    if (minutesDiff < 1) return '방금 전'
    return `${minutesDiff}분 전`
  }

  // Less than 24 hours: "X시간 전"
  if (isToday(commentDate)) {
    const hoursDiff = Math.floor(minutesDiff / 60)
    return `${hoursDiff}시간 전`
  }

  // Yesterday: "어제 HH:MM"
  if (isYesterday(commentDate)) {
    return `어제 ${format(commentDate, 'HH:mm')}`
  }

  // Within this year: "MM월 DD일"
  if (commentDate.getFullYear() === now.getFullYear()) {
    return format(commentDate, 'M월 d일', { locale: ko })
  }

  // Older: "YYYY.MM.DD"
  return format(commentDate, 'yyyy.MM.dd')
}

/**
 * Format date with full details for tooltips
 * @param {string|Date} date - Date to format
 * @returns {string} - Full formatted date string
 */
export const formatFullDate = (date) => {
  return format(new Date(date), 'yyyy년 M월 d일 HH:mm:ss', { locale: ko })
}
