// Simple in-memory rate limiting for AI requests
// In production, you'd want to use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // 10 requests per 15 minutes per user
}

export function checkRateLimit(userId: string, config: RateLimitConfig = DEFAULT_CONFIG): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    cleanupExpiredEntries()
  }

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitMap.set(userId, newEntry)
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitMap.set(userId, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [userId, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(userId)
    }
  }
}

export function getRemainingRequests(userId: string, config: RateLimitConfig = DEFAULT_CONFIG): number {
  const entry = rateLimitMap.get(userId)
  if (!entry || Date.now() > entry.resetTime) {
    return config.maxRequests
  }
  return Math.max(0, config.maxRequests - entry.count)
}