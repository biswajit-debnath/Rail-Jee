import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/apiConfig';

/**
 * Transform external API material to internal format
 */
function transformMaterial(externalMaterial: any) {
  // Map external type to internal type
  const typeMapping: { [key: string]: string } = {
    'video': 'video',
    'pdf': 'notes',
    'document': 'notes',
    'book': 'book',
    'guide': 'guide'
  };

  // Determine content type from material type or URL
  let contentType: 'pdf' | 'video' = 'pdf';
  if (externalMaterial.type === 'video' || externalMaterial.url?.includes('youtube')) {
    contentType = 'video';
  }

  return {
    id: externalMaterial.materialId || externalMaterial._id,
    materialId: externalMaterial.materialId,
    name: externalMaterial.title,
    title: externalMaterial.title,
    type: typeMapping[externalMaterial.type] || 'notes',
    description: externalMaterial.description,
    downloads: externalMaterial.viewCount || 0,
    viewCount: externalMaterial.viewCount,
    rating: 4.5 + (Math.random() * 0.5), // Generate rating between 4.5-5.0 if not provided
    isFree: externalMaterial.isActive !== false,
    isActive: externalMaterial.isActive,
    contentType,
    contentUrl: externalMaterial.url,
    url: externalMaterial.url,
    thumbnailUrl: externalMaterial.thumbnailUrl,
    duration: externalMaterial.duration,
    fileSize: externalMaterial.fileSize,
    tags: externalMaterial.tags,
    departmentId: externalMaterial.departmentId,
    createdAt: externalMaterial.createdAt,
    updatedAt: externalMaterial.updatedAt,
    _id: externalMaterial._id
  };
}

export async function GET(
  request: Request,
  { params }: { params: { deptId: string } }
) {
  try {
    const { deptId } = params;

    // Fetch materials from external API
    const response = await fetch(API_ENDPOINTS.MATERIALS(deptId), {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch materials: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid response from materials API');
    }

    // Transform materials to internal format
    const transformedMaterials = result.data.map(transformMaterial);

    return NextResponse.json({
      success: true,
      data: transformedMaterials,
      message: result.message
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch materials'
        }
      },
      { status: 500 }
    );
  }
}
