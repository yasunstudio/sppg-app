import { unlink, readdir } from 'fs/promises';
import path from 'path';
import { UPLOAD_CONFIG } from './upload';

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    // Security check: ensure file is within uploads directory
    const uploadsDir = path.resolve(UPLOAD_CONFIG.uploadDir);
    const resolvedPath = path.resolve(filePath);
    
    if (!resolvedPath.startsWith(uploadsDir)) {
      throw new Error('Access denied: File outside uploads directory');
    }
    
    await unlink(resolvedPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function cleanupTempFiles(): Promise<number> {
  try {
    const tempDir = path.join(UPLOAD_CONFIG.uploadDir, 'temp');
    const files = await readdir(tempDir);
    
    let deletedCount = 0;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await import('fs').then(fs => fs.promises.stat(filePath));
      
      if (stats.mtime.getTime() < oneDayAgo) {
        const deleted = await deleteFile(filePath);
        if (deleted) deletedCount++;
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning temp files:', error);
    return 0;
  }
}

export function extractFilenameFromUrl(url: string): string {
  // Extract filename from URLs like: /api/uploads/quality-photos/qc-3/filename.jpg
  const parts = url.split('/');
  return parts[parts.length - 1];
}

export function getLocalFilePathFromUrl(url: string): string {
  // Convert URL to local file path
  // /api/uploads/quality-photos/qc-3/filename.jpg -> uploads/quality-photos/qc-3/filename.jpg
  const pathParts = url.split('/').slice(3); // Remove '', 'api', 'uploads'
  return path.join(UPLOAD_CONFIG.uploadDir, ...pathParts);
}
