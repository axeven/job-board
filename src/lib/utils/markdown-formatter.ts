/**
 * Utility functions for formatting markdown-style text to HTML
 * This matches the formatting used in the RichTextEditor component
 */

/**
 * Convert markdown-style formatting to HTML
 * Matches the same formatting rules used in RichTextEditor preview
 */
export function formatMarkdownToHtml(text: string): string {
  if (!text) return ''
  
  // First handle line breaks and paragraphs
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
  
  // Handle bullet lists - convert lines starting with "- " to list items
  const lines = formatted.split('\n')
  let result = ''
  let inList = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isListItem = line.trim().startsWith('- ')
    
    if (isListItem) {
      if (!inList) {
        result += '<ul class="list-disc ml-4 space-y-1 my-4">'
        inList = true
      }
      result += `<li class="ml-4">${line.trim().substring(2)}</li>`
    } else {
      if (inList) {
        result += '</ul>'
        inList = false
      }
      if (line.trim()) {
        result += `<p class="mb-4">${line}</p>`
      } else if (i < lines.length - 1) {
        result += '<br>'
      }
    }
  }
  
  if (inList) {
    result += '</ul>'
  }
  
  return result
}

/**
 * Sanitize HTML content to prevent XSS while preserving basic formatting
 */
export function sanitizeHtml(html: string): string {
  // For now, we'll implement basic sanitization
  // In production, consider using a library like DOMPurify
  let sanitized = html
  
  // Remove any script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove any on* event attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // Remove any javascript: links
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  return sanitized
}

/**
 * Format job description content for display
 * Converts markdown formatting to HTML and sanitizes the result
 */
export function formatJobDescription(description: string): string {
  if (!description) return ''
  
  const formatted = formatMarkdownToHtml(description)
  return sanitizeHtml(formatted)
}

/**
 * Strip markdown formatting from text for plain text display (like cards)
 * Converts markdown syntax to plain text while preserving readability
 */
export function stripMarkdownFormatting(text: string): string {
  if (!text) return ''
  
  return text
    // Remove bold formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic formatting
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code formatting
    .replace(/`(.*?)`/g, '$1')
    // Convert bullet lists to simple text with dashes
    .replace(/^- /gm, '• ')
    // Clean up multiple newlines
    .replace(/\n\s*\n/g, '\n')
    // Trim whitespace
    .trim()
}