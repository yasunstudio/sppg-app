import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { saveFile, validateFile, getFileInfo, UPLOAD_CONFIG } from "@/lib/upload"

// prisma imported from lib

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get the quality checkpoint with photos
    const qualityCheckpoint = await prisma.qualityCheckpoint.findUnique({
      where: { id },
      include: {
        productionPlan: {
          select: {
            id: true,
            planDate: true,
            targetPortions: true,
            menu: {
              select: {
                id: true,
                name: true,
                mealType: true
              }
            }
          }
        },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true
          }
        },
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!qualityCheckpoint) {
      return NextResponse.json(
        { error: "Quality checkpoint not found" },
        { status: 404 }
      )
    }

    // Transform photos array into more detailed photo objects
    // In a real implementation, you would have a separate Photo model/table
    // For now, we'll enhance the simple string array with metadata
    const enhancedPhotos = qualityCheckpoint.photos.map((photoUrl, index) => {
      const photoId = `${id}-photo-${index + 1}`
      const filename = photoUrl.split('/').pop() || `photo-${index + 1}.jpg`
      
      // Generate realistic metadata based on checkpoint type and timing
      const uploadedAt = new Date(qualityCheckpoint.checkedAt.getTime() + (index * 300000)) // 5 min intervals
      const checkpointType = qualityCheckpoint.checkpointType
      
      // Check if there's stored metadata for this photo
      const storedMetadata = ((qualityCheckpoint.metrics as any)?.photoMetadata?.[photoId]) || null
      
      // Generate default tags and description based on checkpoint type if no stored metadata
      let tags = []
      let description = ""
      
      if (storedMetadata) {
        // Use stored metadata
        tags = storedMetadata.tags || []
        description = storedMetadata.description || ""
      } else {
        // Generate default metadata based on checkpoint type
        switch (checkpointType) {
          case "RAW_MATERIAL_INSPECTION":
          case "RAW_MATERIAL":
            tags = ["raw_materials", "inspection", "freshness", "quality"]
            description = `Raw material inspection photo ${index + 1}`
            break
          case "COOKING_PROCESS":
            tags = ["cooking", "process", "temperature", "monitoring"]
            description = `Cooking process documentation ${index + 1}`
            break
          case "FINAL_INSPECTION":
            tags = ["final_inspection", "plating", "portion_control", "presentation"]
            description = `Final inspection and plating check ${index + 1}`
            break
          case "FINAL_PRODUCT":
            // Use consistent simple tags for final product
            tags = ["final_product", "quality_check"]
            description = `Final product quality photo ${index + 1}`
            break
          case "PACKAGING":
            tags = ["packaging", "labeling", "final_check", "delivery_prep"]
            description = `Packaging and labeling verification ${index + 1}`
            break
          case "HYGIENE_CHECK":
            tags = ["hygiene", "cleanliness", "safety", "sanitation"]
            description = `Hygiene and cleanliness verification ${index + 1}`
            break
          default:
            tags = ["quality", "checkpoint", "documentation"]
            description = `Quality checkpoint photo ${index + 1}`
        }
      }

      return {
        id: photoId,
        filename: filename,
        url: photoUrl,
        mimeType: "image/jpeg",
        size: Math.floor(Math.random() * 500000) + 100000, // Random size between 100KB-600KB
        uploadedAt: uploadedAt.toISOString(),
        uploadedBy: {
          id: qualityCheckpoint.checker.id,
          name: qualityCheckpoint.checker.name,
          email: qualityCheckpoint.checker.email
        },
        description: description,
        tags: tags,
        checkpointId: id,
        checkpointType: checkpointType
      }
    })

    const result = {
      checkpoint: {
        id: qualityCheckpoint.id,
        checkpointType: qualityCheckpoint.checkpointType,
        status: qualityCheckpoint.status,
        checkedAt: qualityCheckpoint.checkedAt.toISOString(),
        checker: qualityCheckpoint.checker,
        productionPlan: qualityCheckpoint.productionPlan,
        batch: qualityCheckpoint.batch,
        temperature: qualityCheckpoint.temperature,
        notes: qualityCheckpoint.notes
      },
      photos: enhancedPhotos
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching quality checkpoint photos:", error)
    return NextResponse.json(
      { error: "Failed to fetch quality checkpoint photos" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get current checkpoint
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
    });

    if (!checkpoint) {
      return NextResponse.json(
        { error: "Quality checkpoint not found" },
        { status: 404 }
      );
    }

    // Handle multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const description = formData.get('description') as string || '';
    const tags = formData.get('tags') as string || '';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate and upload files
    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        // Create checkpoint-specific subdirectory
        const subDir = `${UPLOAD_CONFIG.qualityPhotosDir}/${id}`;
        
        // Save file
        const savedFile = await saveFile(file, subDir);
        
        // Get file info
        const fileInfo = getFileInfo(file, savedFile);
        
        uploadedFiles.push(fileInfo);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errors.push(`${file.name}: Upload failed`);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { 
          error: "No files were uploaded successfully", 
          details: errors 
        },
        { status: 400 }
      );
    }

    // Get current photos and add new ones
    const currentPhotos = checkpoint.photos || [];
    const newPhotoUrls = uploadedFiles.map(file => file.url);
    const updatedPhotos = [...currentPhotos, ...newPhotoUrls];

    // Update checkpoint with new photos
    const updatedCheckpoint = await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        photos: updatedPhotos
      },
      include: {
        checker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Photos uploaded successfully",
      uploadedCount: uploadedFiles.length,
      totalPhotos: updatedPhotos.length,
      uploadedFiles: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      checkpoint: updatedCheckpoint
    });

  } catch (error) {
    console.error("Error uploading photos:", error);
    return NextResponse.json(
      { error: "Failed to upload photos" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { photoUrl } = await request.json()

    // Get current checkpoint
    const checkpoint = await prisma.qualityCheckpoint.findUnique({
      where: { id }
    })

    if (!checkpoint) {
      return NextResponse.json(
        { error: "Quality checkpoint not found" },
        { status: 404 }
      )
    }

    // Remove photo from photos array
    const updatedPhotos = checkpoint.photos.filter(url => url !== photoUrl)

    // Update checkpoint
    const updatedCheckpoint = await prisma.qualityCheckpoint.update({
      where: { id },
      data: {
        photos: updatedPhotos
      }
    })

    return NextResponse.json({
      message: "Photo deleted successfully",
      photosCount: updatedPhotos.length
    })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    )
  }
}
