/**
 * Test API utility functions
 */

import { safeJsonParse, authenticatedApiCall } from '@/lib/api-utils'

// Test the utility functions
export async function testApiUtils() {
  console.log('Testing API utilities...')
  
  // Test 1: Valid JSON response
  try {
    const result = await authenticatedApiCall('/api/users/profile')
    console.log('✅ Profile API call result:', result)
  } catch (error) {
    console.error('❌ Profile API call failed:', error)
  }
  
  // Test 2: Non-existent endpoint (should return 404)
  try {
    const result = await authenticatedApiCall('/api/nonexistent')
    console.log('✅ Non-existent API call result:', result)
  } catch (error) {
    console.error('❌ Non-existent API call failed:', error)
  }
  
  // Test 3: HTML response simulation
  const htmlResponse = new Response('<!DOCTYPE html><html><body>Login Page</body></html>', {
    headers: { 'content-type': 'text/html' }
  })
  
  const htmlResult = await safeJsonParse(htmlResponse)
  console.log('✅ HTML response handling result:', htmlResult)
}

if (typeof window !== 'undefined') {
  // Run tests in browser console
  (window as any).testApiUtils = testApiUtils
}
