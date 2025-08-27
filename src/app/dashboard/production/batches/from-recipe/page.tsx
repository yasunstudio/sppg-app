"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChefHat, Users, Clock, DollarSign, Calculator } from "lucide-react";
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

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  category: string;
  servingSize: number;
  prepTime: number;
  cookTime: number;
  ingredients: Array<{
    id: string;
    quantity: number;
    unit: string;
    item: {
      id: string;
      name: string;
      unitPrice: number | null;
    };
  }>;
}

interface BatchCreationResult {
  batch: any;
  scalingInfo: {
    originalServings: number;
    targetPortions: number;
    scalingFactor: number;
    totalIngredients: number;
    estimatedCost: number;
    estimatedTime: number;
  };
  ingredientsList: Array<{
    item: any;
    originalQuantity: number;
    scaledQuantity: number;
    unit: string;
    estimatedCost: number;
  }>;
}

export default function RecipeToBatchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [targetPortions, setTargetPortions] = useState<number>(100);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [batchResult, setBatchResult] = useState<BatchCreationResult | null>(null);

  useEffect(() => {
    fetchRecipes();
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleRecipeSelect = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (response.ok) {
        const recipe = await response.json();
        setSelectedRecipe(recipe);
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const calculateScaling = () => {
    if (!selectedRecipe || !targetPortions) return null;
    
    const scalingFactor = targetPortions / selectedRecipe.servingSize;
    const totalCost = selectedRecipe.ingredients.reduce((sum, ingredient) => {
      const itemCost = ingredient.item?.unitPrice || 0;
      return sum + (itemCost * ingredient.quantity * scalingFactor);
    }, 0);

    return {
      scalingFactor,
      totalCost,
      costPerPortion: totalCost / targetPortions,
      estimatedTime: selectedRecipe.prepTime + selectedRecipe.cookTime,
    };
  };

  const handleCreateBatch = async () => {
    if (!selectedRecipe || !targetPortions || !scheduledDate) {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/production/batches/from-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: selectedRecipe.id,
          targetPortions,
          scheduledDate,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create production batch");
      }

      const result: BatchCreationResult = await response.json();
      setBatchResult(result);

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Production batch berhasil dibuat dari resep",
      });

    } catch (error: any) {
      console.error("Error creating batch:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error.message || "Gagal membuat batch produksi",
      });
    } finally {
      setLoading(false);
    }
  };

  const scalingInfo = calculateScaling();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (batchResult) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/production/batches">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Batch Berhasil Dibuat</h1>
            <p className="text-muted-foreground">
              Production batch telah dibuat dari resep
            </p>
          </div>
        </div>

        {/* Success Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">✅ Batch Produksi Berhasil Dibuat</CardTitle>
            <CardDescription>
              Batch Number: {batchResult.batch.batchNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scaling Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{batchResult.scalingInfo.targetPortions}</div>
                <div className="text-sm text-muted-foreground">Target Porsi</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Calculator className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{batchResult.scalingInfo.scalingFactor.toFixed(1)}x</div>
                <div className="text-sm text-muted-foreground">Scaling Factor</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{formatCurrency(batchResult.scalingInfo.estimatedCost)}</div>
                <div className="text-sm text-muted-foreground">Total Biaya</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{batchResult.scalingInfo.estimatedTime} min</div>
                <div className="text-sm text-muted-foreground">Estimasi Waktu</div>
              </div>
            </div>

            {/* Ingredient Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Breakdown Bahan ({batchResult.ingredientsList.length} items)</h3>
              <div className="space-y-2">
                {batchResult.ingredientsList.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-medium">{ingredient.item.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({ingredient.originalQuantity} → {ingredient.scaledQuantity.toFixed(1)} {ingredient.unit})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(ingredient.estimatedCost)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href={`/dashboard/production/batches/${batchResult.batch.id}`}>
                  Lihat Detail Batch
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/production/batches">
                  Kembali ke Daftar Batch
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setBatchResult(null)}>
                Buat Batch Lain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/production/batches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Batch dari Resep</h1>
          <p className="text-muted-foreground">
            Konversi resep menjadi batch produksi dengan scaling otomatis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Resep</CardTitle>
            <CardDescription>
              Pilih resep yang akan dikonversi menjadi batch produksi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe">Resep *</Label>
              <Select onValueChange={handleRecipeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih resep..." />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} ({recipe.servingSize} porsi)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRecipe && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="h-4 w-4" />
                  <span className="font-medium">{selectedRecipe.name}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Kategori: {selectedRecipe.category}</div>
                  <div>Porsi asli: {selectedRecipe.servingSize}</div>
                  <div>Waktu: {selectedRecipe.prepTime + selectedRecipe.cookTime} menit</div>
                  <div>Bahan: {selectedRecipe.ingredients.length} item</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="targetPortions">Target Porsi *</Label>
              <Input
                id="targetPortions"
                type="number"
                min="1"
                value={targetPortions}
                onChange={(e) => setTargetPortions(parseInt(e.target.value) || 0)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Tanggal Produksi *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan tambahan untuk batch ini..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Scaling Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview Scaling</CardTitle>
            <CardDescription>
              Perhitungan otomatis berdasarkan target porsi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRecipe && scalingInfo ? (
              <div className="space-y-4">
                {/* Scaling Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{scalingInfo.scalingFactor.toFixed(1)}x</div>
                    <div className="text-sm text-muted-foreground">Scaling Factor</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{formatCurrency(scalingInfo.totalCost)}</div>
                    <div className="text-sm text-muted-foreground">Total Biaya</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{formatCurrency(scalingInfo.costPerPortion)}</div>
                    <div className="text-sm text-muted-foreground">Biaya per Porsi</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{scalingInfo.estimatedTime} min</div>
                    <div className="text-sm text-muted-foreground">Estimasi Waktu</div>
                  </div>
                </div>

                {/* Ingredient Preview */}
                <div>
                  <h4 className="font-medium mb-2">Bahan yang Dibutuhkan:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 border rounded">
                        <span>{ingredient.item.name}</span>
                        <span>
                          {(ingredient.quantity * scalingInfo.scalingFactor).toFixed(1)} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleCreateBatch}
                  disabled={loading || !selectedRecipe || !targetPortions || !scheduledDate}
                  className="w-full"
                >
                  {loading ? "Membuat Batch..." : "Buat Production Batch"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Pilih resep terlebih dahulu untuk melihat preview scaling
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
