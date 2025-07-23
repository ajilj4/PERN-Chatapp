/**
 * Format duration in milliseconds to human readable format
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "1:23", "12:34", "1:23:45")
 */
export function formatDuration(duration) {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Format time ago (e.g., "2 minutes ago", "1 hour ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time ago
 */
export function formatTimeAgo(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long')
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'medium') {
  const targetDate = new Date(date);
  
  const options = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  return targetDate.toLocaleDateString('en-US', options[format]);
}

/**
 * Format time for display
 * @param {Date|string} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time
 */
export function formatTime(date, includeSeconds = false) {
  const targetDate = new Date(date);
  
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return targetDate.toLocaleTimeString('en-US', options);
}

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = new Date();
  const targetDate = new Date(date);
  
  return today.toDateString() === targetDate.toDateString();
}

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  
  return yesterday.toDateString() === targetDate.toDateString();
}

/**
 * Get relative date string (Today, Yesterday, or formatted date)
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date string
 */
export function getRelativeDateString(date) {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return formatDate(date, 'short');
}
