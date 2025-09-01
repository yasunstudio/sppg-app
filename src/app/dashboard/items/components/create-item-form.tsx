"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Save, 
  Package, 
  DollarSign, 
  Clock, 
  Thermometer,
  AlertTriangle,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"

export function CreateItemForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [allergenInput, setAllergenInput] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    unit: "",
    unitPrice: "",
    allergens: [] as string[],
    shelfLife: "",
    storageRequirement: "",
    supplierId: "",
    isActive: true
  })

  const categories = [
    { value: "STAPLE_FOOD", label: "Makanan Pokok" },
    { value: "PROTEIN", label: "Protein" },
    { value: "VEGETABLES", label: "Sayuran" },
    { value: "FRUITS", label: "Buah-buahan" },
    { value: "DAIRY", label: "Susu & Olahan" },
    { value: "SPICES_SEASONING", label: "Bumbu & Penyedap" },
    { value: "COOKING_OIL", label: "Minyak Goreng" },
    { value: "BEVERAGES", label: "Minuman" },
    { value: "SNACKS", label: "Camilan" },
    { value: "OTHERS", label: "Lainnya" }
  ]

  const units = [
    { value: "KG", label: "Kilogram (Kg)" },
    { value: "GRAM", label: "Gram" },
    { value: "LITER", label: "Liter" },
    { value: "ML", label: "Mililiter (mL)" },
    { value: "PCS", label: "Pieces/Buah" },
    { value: "PACK", label: "Pack/Kemasan" },
    { value: "BOX", label: "Box/Kotak" },
    { value: "BOTTLE", label: "Botol" },
    { value: "CAN", label: "Kaleng" },
    { value: "SACHET", label: "Sachet" }
  ]

  // Mock suppliers data
  const suppliers = [
    { value: "supplier-1", label: "PT Beras Sejahtera" },
    { value: "supplier-2", label: "CV Ayam Fresh" },
    { value: "supplier-3", label: "Tani Sejahtera" },
    { value: "supplier-4", label: "PT Susu Murni" },
    { value: "supplier-5", label: "CV Minyak Sehat" }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()]
      }))
      setAllergenInput("")
    }
  }

  const handleRemoveAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.unit) {
      toast.error("Harap lengkapi field yang wajib diisi")
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const itemData = {
        ...formData,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : null,
        shelfLife: formData.shelfLife ? parseInt(formData.shelfLife) : null
      }
      
      console.log("Creating item:", itemData)
      
      toast.success("Item berhasil ditambahkan")
      router.push("/dashboard/items")
    } catch (error) {
      toast.error("Gagal menambahkan item")
      console.error("Create item error:", error)
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Tambah Item Baru</h1>
            <p className="text-muted-foreground">
              Tambahkan item atau bahan baku baru ke dalam sistem
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informasi Dasar
                </CardTitle>
                <CardDescription>
                  Informasi umum tentang item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nama Item <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Masukkan nama item"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Deskripsi detail tentang item"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="unit">
                      Satuan <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Harga per Satuan</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="unitPrice"
                        type="number"
                        value={formData.unitPrice}
                        onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                        placeholder="0"
                        className="pl-8"
                        min="0"
                        step="0.01"
                      />
                    </div>
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
                <CardDescription>
                  Informasi tentang cara penyimpanan dan masa simpan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shelfLife">Masa Simpan (hari)</Label>
                    <div className="relative">
                      <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="shelfLife"
                        type="number"
                        value={formData.shelfLife}
                        onChange={(e) => handleInputChange("shelfLife", e.target.value)}
                        placeholder="365"
                        className="pl-8"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={formData.supplierId} onValueChange={(value) => handleInputChange("supplierId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.value} value={supplier.value}>
                            {supplier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Cara Penyimpanan</Label>
                  <Textarea
                    id="storage"
                    value={formData.storageRequirement}
                    onChange={(e) => handleInputChange("storageRequirement", e.target.value)}
                    placeholder="Contoh: Simpan di tempat kering dan sejuk, hindari sinar matahari langsung"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Allergens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Informasi Alergen
                </CardTitle>
                <CardDescription>
                  Daftar alergen yang terkandung dalam item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    placeholder="Tambah alergen (contoh: Kacang, Susu, Telur)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddAllergen()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddAllergen} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergens.map((allergen, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {allergen}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleRemoveAllergen(allergen)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>
                  Konfigurasi status dan pengaturan item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Item Aktif</Label>
                    <p className="text-sm text-muted-foreground">
                      Item dapat digunakan untuk produksi
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Item
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full">
                    <Link href="/dashboard/items">
                      Batal
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
