import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QualityCheckType, QualityStatus } from '@/generated/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    const qualityCheck = await prisma.qualityCheck.findUnique({
      where: { id }
    });

    if (!qualityCheck) {
      return NextResponse.json(
        { error: 'Quality check not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: qualityCheck });
  } catch (error) {
    console.error('Error fetching quality check:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality check' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const {
      type,
      referenceType,
      referenceId,
      checkedBy,
      color,
      taste,
      aroma,
      texture,
      temperature,
      status,
      notes
    } = body;

    // Check if quality check exists
    const existingCheck = await prisma.qualityCheck.findUnique({
      where: { id }
    });

    if (!existingCheck) {
      return NextResponse.json(
        { error: 'Quality check not found' },
        { status: 404 }
      );
    }

    // Validate enums if provided
    if (type && !Object.values(QualityCheckType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid quality check type' },
        { status: 400 }
      );
    }

    if (status && !Object.values(QualityStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid quality status' },
        { status: 400 }
      );
    }

    // Check for duplicate reference if reference details are being updated
    if ((referenceType && referenceType !== existingCheck.referenceType) || 
        (referenceId && referenceId !== existingCheck.referenceId)) {
      const duplicateCheck = await prisma.qualityCheck.findFirst({
        where: {
          referenceType: referenceType || existingCheck.referenceType,
          referenceId: referenceId || existingCheck.referenceId,
          id: { not: id }
        }
      });

      if (duplicateCheck) {
        return NextResponse.json(
          { error: 'Quality check already exists for this reference' },
          { status: 400 }
        );
      }
    }

    const qualityCheck = await prisma.qualityCheck.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(referenceType && { referenceType }),
        ...(referenceId && { referenceId }),
        ...(checkedBy !== undefined && { checkedBy }),
        ...(color !== undefined && { color }),
        ...(taste !== undefined && { taste }),
        ...(aroma !== undefined && { aroma }),
        ...(texture !== undefined && { texture }),
        ...(temperature !== undefined && { temperature: temperature ? parseFloat(temperature) : null }),
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    return NextResponse.json({
      data: qualityCheck,
      message: 'Quality check updated successfully'
    });
  } catch (error) {
    console.error('Error updating quality check:', error);
    return NextResponse.json(
      { error: 'Failed to update quality check' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    // Check if quality check exists
    const existingCheck = await prisma.qualityCheck.findUnique({
      where: { id }
    });

    if (!existingCheck) {
      return NextResponse.json(
        { error: 'Quality check not found' },
        { status: 404 }
      );
    }

    await prisma.qualityCheck.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Quality check deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quality check:', error);
    return NextResponse.json(
      { error: 'Failed to delete quality check' },
      { status: 500 }
    );
  }
}
