// Client-side file validation utility (no Node.js dependencies)

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Client-side file validation (no fs dependency)
export function validateFileClient(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size too large. Maximum ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB allowed.`
    };
  }

  // Check MIME type
  if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${UPLOAD_CONFIG.allowedMimeTypes.join(', ')}`
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name);
  if (!UPLOAD_CONFIG.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${UPLOAD_CONFIG.allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
}

// Get file extension (client-safe)
function getFileExtension(filename: string): string {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'));
}
