"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Clock, 
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Building,
  Calendar,
  BarChart,
  TrendingUp,
  Package2,
  Utensils,
  Leaf,
  Apple,
  Milk,
  ChefHat,
  Droplets,
  Coffee,
  Cookie
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface ItemDetailsProps {
  itemId: string
}

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

export function ItemDetails({ itemId }: ItemDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Mock data untuk development
  const [item] = useState<Item>({
    id: itemId,
    name: "Beras Premium",
    description: "Beras premium kualitas terbaik untuk makanan sekolah. Dipilih dari petani lokal dengan standar kualitas tinggi dan proses pembersihan yang higienis.",
    category: "STAPLE_FOOD",
    unit: "KG",
    unitPrice: 15000,
    allergens: [],
    shelfLife: 365,
    storageRequirement: "Simpan di tempat kering dan sejuk, hindari sinar matahari langsung. Pastikan kemasan tertutup rapat setelah dibuka.",
    supplierId: "supplier-1",
    supplierName: "PT Beras Sejahtera",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

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
      KG: "Kilogram",
      GRAM: "Gram", 
      LITER: "Liter",
      ML: "Mililiter",
      PCS: "Pieces",
      PACK: "Pack",
      BOX: "Box",
      BOTTLE: "Botol",
      CAN: "Kaleng",
      SACHET: "Sachet"
    }
    return units[unit as keyof typeof units] || unit
  }

  const getShelfLifeStatus = (shelfLife?: number) => {
    if (!shelfLife) return { label: "Tidak ada info", color: "bg-gray-100 text-gray-800", icon: AlertTriangle }
    if (shelfLife <= 7) return { label: "Cepat rusak", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    if (shelfLife <= 30) return { label: "Sedang", color: "bg-yellow-100 text-yellow-800", icon: Clock }
    return { label: "Tahan lama", color: "bg-green-100 text-green-800", icon: CheckCircle }
  }

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Item berhasil dihapus")
      router.push("/dashboard/items")
    } catch (error) {
      toast.error("Gagal menghapus item")
      console.error("Delete item error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success(`Item berhasil ${item.isActive ? "dinonaktifkan" : "diaktifkan"}`)
      // In real implementation, refetch data here
    } catch (error) {
      toast.error("Gagal mengubah status item")
      console.error("Toggle status error:", error)
    } finally {
      setLoading(false)
    }
  }

  const categoryConfig = getCategoryConfig(item.category)
  const CategoryIcon = categoryConfig.icon
  const shelfLifeStatus = getShelfLifeStatus(item.shelfLife)
  const ShelfLifeIcon = shelfLifeStatus.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/items">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-muted-foreground">
              Detail informasi item dan bahan baku
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleToggleStatus} disabled={loading}>
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
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/items/${item.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus item "{item.name}"? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                  {loading ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Item</Label>
                  <p className="text-lg font-semibold">{item.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={item.isActive ? "default" : "secondary"}
                      className={item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {item.isActive ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </div>
                </div>
              </div>

              {item.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={categoryConfig.color}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {categoryConfig.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Satuan</Label>
                  <p className="mt-1 font-medium">{getUnitLabel(item.unit)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Harga per Satuan</Label>
                  <p className="mt-1 font-medium text-lg">
                    {item.unitPrice ? formatCurrency(item.unitPrice) : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage & Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Penyimpanan & Kualitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Masa Simpan</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className={shelfLifeStatus.color}>
                      <ShelfLifeIcon className="h-3 w-3 mr-1" />
                      {item.shelfLife ? `${item.shelfLife} hari` : "N/A"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({shelfLifeStatus.label})
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Supplier</Label>
                  <p className="mt-1 font-medium">
                    {item.supplierName || "-"}
                  </p>
                </div>
              </div>

              {item.storageRequirement && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cara Penyimpanan</Label>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.storageRequirement}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allergens */}
          {item.allergens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Informasi Alergen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen, index) => (
                    <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Harga per {getUnitLabel(item.unit)}</span>
                  <span className="font-semibold">
                    {item.unitPrice ? formatCurrency(item.unitPrice) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Masa Simpan</span>
                  <span className="font-semibold">
                    {item.shelfLife ? `${item.shelfLife} hari` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Aktif" : "Non-aktif"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          {item.supplierName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Supplier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{item.supplierName}</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/suppliers/${item.supplierId}`}>
                      Lihat Detail Supplier
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dibuat</Label>
                <p className="text-sm">{formatDate(item.createdAt)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Terakhir Diubah</Label>
                <p className="text-sm">{formatDate(item.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/inventory">
                  <BarChart className="h-4 w-4 mr-2" />
                  Lihat Stok
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/purchase-orders">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Buat Order
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  )
}
