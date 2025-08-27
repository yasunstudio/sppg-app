"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  unit: string;
  unitPrice: number | null;
  category: string;
}

interface Ingredient {
  itemId: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export default function NewRecipePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { itemId: "", quantity: 0, unit: "", notes: "" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    prepTime: 0,
    cookTime: 0,
    servingSize: 1,
    instructions: "",
    nutritionInfo: {},
    allergenInfo: [],
    cost: 0,
  });

  const categories = [
    { value: "MAIN_COURSE", label: "Makanan Utama" },
    { value: "SIDE_DISH", label: "Lauk Pauk" },
    { value: "DESSERT", label: "Dessert" },
    { value: "BEVERAGE", label: "Minuman" },
    { value: "SNACK", label: "Camilan" },
  ];

  const difficulties = [
    { value: "EASY", label: "Mudah" },
    { value: "MEDIUM", label: "Sedang" },
    { value: "HARD", label: "Sulit" },
    { value: "EXPERT", label: "Ahli" },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items?active=true");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { itemId: "", quantity: 0, unit: "", notes: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Nama resep dan kategori wajib diisi",
      });
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.itemId && ing.quantity > 0);
    if (validIngredients.length === 0) {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Minimal harus ada satu bahan",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ingredients: validIngredients,
          instructions: formData.instructions || "Belum ada instruksi",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create recipe");
      }

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Resep berhasil dibuat",
      });

      router.push("/dashboard/recipes");
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error.message || "Gagal membuat resep",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/recipes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Resep Baru</h1>
          <p className="text-muted-foreground">
            Buat resep makanan untuk program gizi sekolah
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Informasi dasar tentang resep
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Resep *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nasi Gudeg Ayam"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang resep..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">Waktu Persiapan (menit)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime">Waktu Masak (menit)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servingSize">Jumlah Porsi</Label>
              <Input
                id="servingSize"
                type="number"
                min="1"
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: parseInt(e.target.value) || 1 })}
                placeholder="4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Bahan-bahan</CardTitle>
            <CardDescription>
              Daftar bahan yang dibutuhkan untuk resep ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Bahan</Label>
                  <Select
                    value={ingredient.itemId}
                    onValueChange={(value) => {
                      updateIngredient(index, "itemId", value);
                      const item = items.find(i => i.id === value);
                      if (item) {
                        updateIngredient(index, "unit", item.unit);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bahan" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jumlah</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Satuan</Label>
                  <Input
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    placeholder="kg, gram, liter"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <div className="flex gap-2">
                    <Input
                      value={ingredient.notes || ""}
                      onChange={(e) => updateIngredient(index, "notes", e.target.value)}
                      placeholder="Catatan opsional"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Bahan
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instruksi Memasak</CardTitle>
            <CardDescription>
              Langkah-langkah untuk membuat resep ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instruksi</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="1. Siapkan semua bahan&#10;2. Panaskan minyak...&#10;3. Dst..."
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Resep"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/recipes">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
