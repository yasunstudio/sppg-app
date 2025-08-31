"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  TrendingUp,
  Package2,
  Utensils,
  Leaf,
  Apple,
  Milk,
  ChefHat,
  Droplets,
  Coffee,
  Cookie,
  MoreHorizontal
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface Item {
  id: string
  name: string
  description?: string
  category: string
  unit: string
  unitPrice?: number
  nutritionPer100g?: any
  allergens: string[]
  shelfLife?: number
  storageRequirement?: string
  supplierId?: string
  supplierName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function ItemsManagement() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  // Mock data untuk development
  const [items] = useState<Item[]>([
    {
      id: "1",
      name: "Beras Premium",
      description: "Beras premium kualitas terbaik untuk makanan sekolah",
      category: "STAPLE_FOOD",
      unit: "KG",
      unitPrice: 15000,
      allergens: [],
      shelfLife: 365,
      storageRequirement: "Tempat kering dan sejuk",
      supplierId: "supplier-1",
      supplierName: "PT Beras Sejahtera",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Daging Ayam Fillet",
      description: "Daging ayam fillet segar tanpa tulang",
      category: "PROTEIN",
      unit: "KG",
      unitPrice: 35000,
      allergens: [],
      shelfLife: 3,
      storageRequirement: "Freezer -18°C",
      supplierId: "supplier-2", 
      supplierName: "CV Ayam Fresh",
      isActive: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      name: "Wortel Segar",
      description: "Wortel segar pilihan untuk sayuran",
      category: "VEGETABLES",
      unit: "KG",
      unitPrice: 8000,
      allergens: [],
      shelfLife: 14,
      storageRequirement: "Kulkas 2-4°C",
      supplierId: "supplier-3",
      supplierName: "Tani Sejahtera",
      isActive: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      name: "Susu UHT",
      description: "Susu UHT full cream untuk konsumsi anak",
      category: "DAIRY",
      unit: "LITER",
      unitPrice: 12000,
      allergens: ["Susu"],
      shelfLife: 180,
      storageRequirement: "Tempat sejuk, hindari sinar matahari",
      supplierId: "supplier-4",
      supplierName: "PT Susu Murni",
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "5",
      name: "Minyak Goreng",
      description: "Minyak goreng kelapa sawit untuk memasak",
      category: "COOKING_OIL",
      unit: "LITER",
      unitPrice: 18000,
      allergens: [],
      shelfLife: 720,
      storageRequirement: "Tempat sejuk dan kering",
      supplierId: "supplier-5",
      supplierName: "CV Minyak Sehat",
      isActive: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  const stats = {
    total: items.length,
    active: items.filter(item => item.isActive).length,
    inactive: items.filter(item => !item.isActive).length,
    byCategory: items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    totalValue: items.reduce((sum, item) => sum + (item.unitPrice || 0), 0),
    avgPrice: items.length > 0 ? items.reduce((sum, item) => sum + (item.unitPrice || 0), 0) / items.length : 0
  }

  const getCategoryConfig = (category: string) => {
    const configs = {
      STAPLE_FOOD: { label: "Makanan Pokok", icon: Package2, color: "bg-blue-100 text-blue-800" },
      PROTEIN: { label: "Protein", icon: Utensils, color: "bg-red-100 text-red-800" },
      VEGETABLES: { label: "Sayuran", icon: Leaf, color: "bg-green-100 text-green-800" },
      FRUITS: { label: "Buah-buahan", icon: Apple, color: "bg-yellow-100 text-yellow-800" },
      DAIRY: { label: "Susu & Olahan", icon: Milk, color: "bg-purple-100 text-purple-800" },
      SPICES_SEASONING: { label: "Bumbu", icon: ChefHat, color: "bg-orange-100 text-orange-800" },
      COOKING_OIL: { label: "Minyak Goreng", icon: Droplets, color: "bg-amber-100 text-amber-800" },
      BEVERAGES: { label: "Minuman", icon: Coffee, color: "bg-cyan-100 text-cyan-800" },
      SNACKS: { label: "Camilan", icon: Cookie, color: "bg-pink-100 text-pink-800" },
      OTHERS: { label: "Lainnya", icon: Package, color: "bg-gray-100 text-gray-800" }
    }
    return configs[category as keyof typeof configs] || configs.OTHERS
  }

  const getUnitLabel = (unit: string) => {
    const units = {
      KG: "Kg",
      GRAM: "Gram", 
      LITER: "Liter",
      ML: "mL",
      PCS: "Pcs",
      PACK: "Pack",
      BOX: "Box",
      BOTTLE: "Botol",
      CAN: "Kaleng",
      SACHET: "Sachet"
    }
    return units[unit as keyof typeof units] || unit
  }

  const getShelfLifeStatus = (shelfLife?: number) => {
    if (!shelfLife) return { label: "Tidak ada info", color: "bg-gray-100 text-gray-800" }
    if (shelfLife <= 7) return { label: "Cepat rusak", color: "bg-red-100 text-red-800" }
    if (shelfLife <= 30) return { label: "Sedang", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Tahan lama", color: "bg-green-100 text-green-800" }
  }

  const filteredItems = items.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && 
        !item.description?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (categoryFilter !== "all" && item.category !== categoryFilter) {
      return false
    }
    if (statusFilter === "active" && !item.isActive) {
      return false
    }
    if (statusFilter === "inactive" && item.isActive) {
      return false
    }
    return true
  })

  const handleDelete = (itemId: string) => {
    // Implementation will be added when API is ready
    toast.success("Item berhasil dihapus")
  }

  const handleToggleStatus = (itemId: string) => {
    // Implementation will be added when API is ready
    toast.success("Status item berhasil diubah")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Item</h1>
          <p className="text-muted-foreground">
            Kelola semua item dan bahan baku untuk produksi makanan
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Laporan
          </Button>
          <Button asChild>
            <Link href="/dashboard/items/create">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} aktif, {stats.inactive} non-aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Item Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Siap untuk produksi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Nilai seluruh item
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Harga</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Per unit item
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="STAPLE_FOOD">Makanan Pokok</SelectItem>
                <SelectItem value="PROTEIN">Protein</SelectItem>
                <SelectItem value="VEGETABLES">Sayuran</SelectItem>
                <SelectItem value="FRUITS">Buah-buahan</SelectItem>
                <SelectItem value="DAIRY">Susu & Olahan</SelectItem>
                <SelectItem value="SPICES_SEASONING">Bumbu</SelectItem>
                <SelectItem value="COOKING_OIL">Minyak Goreng</SelectItem>
                <SelectItem value="BEVERAGES">Minuman</SelectItem>
                <SelectItem value="SNACKS">Camilan</SelectItem>
                <SelectItem value="OTHERS">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Non-aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Item</CardTitle>
          <CardDescription>
            {filteredItems.length} dari {items.length} item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga/Unit</TableHead>
                <TableHead>Shelf Life</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const categoryConfig = getCategoryConfig(item.category)
                const CategoryIcon = categoryConfig.icon
                const shelfLifeStatus = getShelfLifeStatus(item.shelfLife)
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        {item.allergens.length > 0 && (
                          <div className="flex gap-1">
                            {item.allergens.map((allergen, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={categoryConfig.color}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {categoryConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.unitPrice ? (
                        <div>
                          <p className="font-medium">{formatCurrency(item.unitPrice)}</p>
                          <p className="text-sm text-muted-foreground">
                            per {getUnitLabel(item.unit)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={shelfLifeStatus.color}>
                        {item.shelfLife ? `${item.shelfLife} hari` : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.supplierName ? (
                        <div className="text-sm">
                          <p className="font-medium">{item.supplierName}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.isActive ? "default" : "secondary"}
                        className={item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {item.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/items/${item.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/items/${item.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(item.id)}
                          >
                            {item.isActive ? (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Non-aktifkan
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aktifkan
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">Tidak ada item</p>
              <p className="text-muted-foreground">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Tidak ditemukan item yang sesuai dengan filter"
                  : "Belum ada item untuk ditampilkan"
                }
              </p>
              {!search && categoryFilter === "all" && statusFilter === "all" && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/items/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Item Pertama
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
