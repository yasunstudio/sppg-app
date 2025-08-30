import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// prisma imported from lib

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id, photoId } = await params
    const body = await request.json()
    const { description, tags } = body

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

    // Since we don't have separate photo metadata storage in the current schema,
    // we'll store metadata in the checkpoint's metrics JSON field
    
    // Get existing metrics or create new one
    const existingMetrics = (checkpoint.metrics as any) || {}
    const photoMetadata = existingMetrics.photoMetadata || {}
    
    // Update metadata for this specific photo
    photoMetadata[photoId] = {
      description: description || "",
      tags: tags || [],
      updatedAt: new Date().toISOString(),
      updatedBy: checkpoint.checker.id
    }
    
    // Update the checkpoint with new metadata
    await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        metrics: {
          ...existingMetrics,
          photoMetadata: photoMetadata
        }
      }
    })
    
    // Return the photo data with updated metadata
    const photoUrl = checkpoint.photos[photoIndex]
    const photo = {
      id: photoId,
      filename: photoUrl.split('/').pop() || 'photo.jpg',
      url: photoUrl,
      mimeType: "image/jpeg",
      size: Math.floor(Math.random() * 500000) + 100000,
      uploadedAt: checkpoint.checkedAt.toISOString(),
      uploadedBy: checkpoint.checker,
      description: description || "",
      tags: tags || [],
      checkpointId: id,
      checkpointType: 'QUALITY'
    }

    return NextResponse.json({
      success: true,
      photo: photo
    })

  } catch (error) {
    console.error("Error updating photo:", error)
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id, photoId } = await params

    // Get the quality checkpoint
    const checkpoint = await prisma.qualityCheckpoint.findUnique({
      where: { id }
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

    // Remove the photo from the array
    const photoUrl = checkpoint.photos[photoIndex]
    const updatedPhotos = checkpoint.photos.filter((_, index) => index !== photoIndex)

    // Update the checkpoint
    await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        photos: updatedPhotos
      }
    })

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    )
  }
}
