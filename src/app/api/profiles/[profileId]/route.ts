import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  return NextResponse.json({ message: 'Profile detail API not implemented yet' }, { status: 501 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  return NextResponse.json({ message: 'Profile update API not implemented yet' }, { status: 501 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  return NextResponse.json({ message: 'Profile delete API not implemented yet' }, { status: 501 })
}
