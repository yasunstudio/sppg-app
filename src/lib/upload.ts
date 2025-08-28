import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  uploadDir: path.join(process.cwd(), 'uploads'),
  qualityPhotosDir: 'quality-photos'
};

// File validation
export function validateFile(file: File): { valid: boolean; error?: string } {
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
  const extension = path.extname(file.name).toLowerCase();
  if (!UPLOAD_CONFIG.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${UPLOAD_CONFIG.allowedExtensions.join(', ')}`
    };
  }

  return { valid: true };
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const extension = path.extname(originalName);
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0]; // First part of UUID for shorter name
  return `${timestamp}-${uuid}${extension}`;
}

// Ensure directory exists
export async function ensureUploadDir(subDir: string): Promise<string> {
  const fullPath = path.join(UPLOAD_CONFIG.uploadDir, subDir);
  
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }
  
  return fullPath;
}

// Save file to local filesystem
export async function saveFile(
  file: File, 
  subDir: string, 
  filename?: string
): Promise<{ filePath: string; filename: string; url: string }> {
  try {
    // Ensure directory exists
    const uploadDir = await ensureUploadDir(subDir);
    
    // Generate filename if not provided
    const finalFilename = filename || generateUniqueFilename(file.name);
    
    // Full file path
    const filePath = path.join(uploadDir, finalFilename);
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to filesystem
    await writeFile(filePath, buffer);
    
    // Generate accessible URL
    const url = `/api/uploads/${subDir}/${finalFilename}`;
    
    return {
      filePath,
      filename: finalFilename,
      url
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}

// Get file info
export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export function getFileInfo(
  file: File, 
  savedFile: { filename: string; url: string }
): UploadedFileInfo {
  return {
    filename: savedFile.filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: savedFile.url,
    uploadedAt: new Date().toISOString()
  };
}
