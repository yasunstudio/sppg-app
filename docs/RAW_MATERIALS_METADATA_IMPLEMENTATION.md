# Raw Materials Metadata Implementation

## Overview
Implementasi metadata yang komprehensif untuk sistem manajemen bahan baku dengan dukungan SEO dan Next.js 15.

## Structure

### 1. Static Metadata Pages
- **Main Page** (`/dashboard/raw-materials/page.tsx`)
  - Title: "Manajemen Bahan Baku | SPPG"
  - Optimized for inventory management keywords
  
- **Create Page** (`/dashboard/raw-materials/create/page.tsx`)
  - Title: "Tambah Bahan Baku Baru | SPPG"
  - Focus on creation/addition keywords

### 2. Dynamic Metadata Pages
- **Detail Page** (`/dashboard/raw-materials/[id]/page.tsx`)
  - Uses `generateMetadata()` function
  - Dynamic title based on raw material name
  - SEO-optimized descriptions
  
- **Edit Page** (`/dashboard/raw-materials/[id]/edit/page.tsx`)
  - Dynamic metadata generation
  - Contextual titles and descriptions

### 3. Metadata Utilities

#### File: `components/utils/raw-material-metadata.ts`

**Functions:**
- `generateRawMaterialMetadata()` - Central metadata generation
- `generateRawMaterialBreadcrumbs()` - Structured breadcrumb data
- `generateRawMaterialStructuredData()` - Schema.org structured data

**Features:**
- ✅ SEO-optimized titles and descriptions
- ✅ Open Graph metadata
- ✅ Dynamic content based on parameters
- ✅ Keywords optimization
- ✅ Robots directives for internal pages
- ✅ Canonical URLs
- ✅ Structured data support

## Implementation Details

### Permission Integration
All pages now include `PermissionGuard` components:
- Main page: `inventory.view`
- Create page: `inventory.create`
- Detail page: `inventory.view`
- Edit page: `inventory.edit`

### Next.js 15 Compatibility
- Uses `Promise<{ id: string }>` for dynamic params
- Async metadata generation functions
- Proper type safety

### SEO Features
1. **Localized Content**: All metadata in Indonesian
2. **Keyword Optimization**: Relevant keywords for each page type
3. **Social Media**: Open Graph metadata for sharing
4. **Search Engines**: Robots directives to prevent indexing internal pages
5. **Structured Data**: Schema.org markup for better search understanding

## Usage Example

```typescript
// For static pages
import { generateRawMaterialMetadata } from "../components/utils/raw-material-metadata"
export const metadata = generateRawMaterialMetadata('list')

// For dynamic pages
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return generateRawMaterialMetadata('detail', { id })
}
```

## Future Enhancements

1. **API Integration**: Connect to actual raw material data for dynamic content
2. **Multilingual Support**: Add English translations
3. **Rich Snippets**: Enhanced structured data
4. **Social Media Cards**: Custom OG images per material
5. **Performance**: Metadata caching strategies

## File Structure
```
components/utils/
├── raw-material-metadata.ts     # Metadata generation utilities
├── raw-material-types.ts        # TypeScript interfaces
└── raw-material-formatters.tsx  # UI formatting utilities
```

## Benefits
- **Better SEO**: Optimized metadata for search engines
- **User Experience**: Descriptive page titles and social sharing
- **Developer Experience**: Centralized metadata management
- **Maintainability**: Consistent structure across all pages
- **Performance**: Efficient metadata generation
