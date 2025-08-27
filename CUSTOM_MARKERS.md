# Custom Map Markers Documentation

## Overview
Custom SVG markers untuk aplikasi SPPG yang menampilkan sekolah dengan visual yang lebih baik dan informatif.

## Marker Types

### 1. Default School Icon (`default`)
- **Size**: 32x32px
- **Color**: Blue (#3b82f6)
- **Use**: Sekolah umum tanpa rute spesifik
- **Features**: School building icon dengan windows dan door

### 2. Start Point Icon (`start`)
- **Size**: 40x40px  
- **Color**: Green (#10b981)
- **Use**: Titik awal distribusi
- **Features**: School icon + green "S" badge
- **Badge**: Green circle dengan text "S"

### 3. End Point Icon (`end`)
- **Size**: 40x40px
- **Color**: Red (#ef4444) 
- **Use**: Titik akhir distribusi
- **Features**: School icon + red "E" badge
- **Badge**: Red circle dengan text "E"

### 4. Route Point Icon (`route`)
- **Size**: 36x36px
- **Color**: Purple (#8b5cf6)
- **Use**: Titik dalam rute distribusi
- **Features**: School icon + route number badge
- **Badge**: Purple circle dengan nomor urutan

### 5. Depot Icon (`depot`) - Future Use
- **Size**: 44x44px
- **Color**: Orange (#f59e0b)
- **Use**: Pusat distribusi/depot
- **Features**: Warehouse icon + truck symbol

## Implementation

```tsx
// Basic usage
<Marker icon={createSchoolIcon('default')} />

// With route number
<Marker icon={createSchoolIcon('route', 3)} />

// Start/End points  
<Marker icon={createSchoolIcon('start')} />
<Marker icon={createSchoolIcon('end')} />
```

## Visual Features

✅ **Responsive Design**: Icons scale dengan zoom level
✅ **Shadow Effects**: Drop shadow untuk depth
✅ **High Contrast**: White background untuk legibility
✅ **Color Coding**: Berbeda warna untuk status yang berbeda
✅ **Route Numbers**: Nomor urutan yang jelas
✅ **Professional Look**: Clean, modern design

## CSS Styling

Custom CSS classes:
- `.custom-marker-icon`: Removes default leaflet styling
- `.custom-depot-icon`: Styling untuk depot markers
- Enhanced popup styling dengan rounded corners dan shadows

## Benefits

1. **Better UX**: Visual hierarchy yang jelas
2. **Information Dense**: Nomor urutan dan status dalam icon
3. **Brand Consistent**: Menggunakan color scheme aplikasi
4. **Accessibility**: High contrast untuk readability
5. **Scalable**: SVG-based untuk quality di semua zoom levels
