import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import { saveFile, validateFile } from "@/lib/upload"
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id, photoId } = await params

    // Get the quality checkpoint
    const checkpoint = await prisma.qualityCheckpoint.findUnique({
      where: { id },
      include: {
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!checkpoint) {
      return NextResponse.json(
        { error: "Quality checkpoint not found" },
        { status: 404 }
      )
    }

    // Find the photo by ID in the photos array
    const photoIndex = checkpoint.photos.findIndex((_, index) => 
      `${checkpoint.id}-photo-${index + 1}` === photoId
    )

    if (photoIndex === -1) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate the file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Get old photo URL to delete old file
    const oldPhotoUrl = checkpoint.photos[photoIndex]
    
    // Save new file
    const result = await saveFile(file, `quality-photos/${checkpoint.id}`)

    // Update photos array with new URL
    const updatedPhotos = [...checkpoint.photos]
    updatedPhotos[photoIndex] = result.url

    // Update checkpoint with new photos array
    await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        photos: updatedPhotos
      }
    })

    // Try to delete old file (if it exists locally)
    try {
      if (oldPhotoUrl.startsWith('/api/uploads/')) {
        const oldFilePath = oldPhotoUrl.replace('/api/uploads/', '')
        const fullOldPath = path.join(process.cwd(), 'uploads', oldFilePath)
        await fs.unlink(fullOldPath)
      }
    } catch (deleteError) {
      console.warn('Could not delete old file:', deleteError)
      // Continue anyway, file might not exist or be external
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Photo replaced successfully",
      newUrl: result.url,
      photo: {
        id: photoId,
        filename: result.filename,
        url: result.url,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: checkpoint.checker,
        description: "", // Will keep existing metadata
        tags: [], // Will keep existing metadata
        checkpointId: id,
        checkpointType: checkpoint.checkpointType
      }
    })

  } catch (error) {
    console.error("Error replacing photo:", error)
    return NextResponse.json(
      { error: "Failed to replace photo" },
      { status: 500 }
    )
  }
}
