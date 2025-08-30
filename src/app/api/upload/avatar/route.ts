import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { saveFile, validateFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Save file to avatars directory
    const result = await saveFile(file, 'avatars')

    return NextResponse.json({
      success: true,
      filename: result.filename,
      url: result.url,
      message: 'Avatar uploaded successfully'
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
