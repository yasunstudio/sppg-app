/**
 * API utility functions to handle common patterns and errors
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Safely parse JSON response with better error handling
 */
export async function safeJsonParse<T = any>(response: Response): Promise<ApiResponse<T>> {
  try {
    // Check if response is ok
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status} ${response.statusText}`
      }
    }

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // If we get HTML instead of JSON, it's likely a redirect to login page
      const text = await response.text()
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        return {
          success: false,
          error: 'Authentication required - please log in again'
        }
      }
      
      return {
        success: false,
        error: `Expected JSON but received: ${contentType || 'unknown'}`
      }
    }

    // Parse JSON
    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse response'
    }
  }
}

/**
 * Make a safe API call with automatic error handling
 */
export async function safeApiCall<T = any>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    return await safeJsonParse<T>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

/**
 * Create API call with authentication check
 */
export async function authenticatedApiCall<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const result = await safeApiCall<T>(url, options)
  
  // If we get an authentication error, redirect to login
  if (!result.success && result.error?.includes('Authentication required')) {
    // Only redirect if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }
  
  return result
}
