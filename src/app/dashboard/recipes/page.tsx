"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, ChefHat, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servingSize: number;
  cost: number | null;
  totalCost: number;
  costPerServing: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    productionBatches: number;
  };
  ingredients: Array<{
    id: string;
    quantity: number;
    unit: string;
    item: {
      id: string;
      name: string;
      unit: string;
      unitPrice: number | null;
    };
  }>;
}

interface RecipesResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { toast } = useToast();

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

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) params.append("search", search);
      if (category && category !== "all") params.append("category", category);
      if (difficulty && difficulty !== "all") params.append("difficulty", difficulty);

      const response = await fetch(`/api/recipes?${params}`);
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data: RecipesResponse = await response.json();
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memuat data resep",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, search, category, difficulty]);

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete recipe");
      }

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Resep berhasil dihapus",
      });

      fetchRecipes();
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error.message || "Gagal menghapus resep",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "HARD": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "EXPERT": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulties.find(d => d.value === difficulty)?.label || difficulty;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}j ${remainingMinutes}m` : `${hours} jam`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Resep</h1>
          <p className="text-muted-foreground">
            Kelola resep makanan untuk program gizi sekolah
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/recipes/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Resep
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari resep..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Semua Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Resep</CardTitle>
          <CardDescription>
            Total {pagination.total} resep ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Belum ada resep</h3>
              <p className="text-muted-foreground">
                Mulai dengan menambahkan resep pertama
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Resep</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tingkat Kesulitan</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Porsi</TableHead>
                    <TableHead>Biaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{recipe.name}</div>
                          {recipe.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {recipe.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(recipe.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(recipe.difficulty)}>
                          {getDifficultyLabel(recipe.difficulty)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {formatTime(recipe.prepTime + recipe.cookTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3" />
                          {recipe.servingSize}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(recipe.totalCost)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(recipe.costPerServing)}/porsi
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={recipe.isActive ? "default" : "secondary"}>
                          {recipe.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/recipes/${recipe.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/recipes/${recipe.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="text-red-600 dark:text-red-400"
                              disabled={recipe._count.productionBatches > 0}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Halaman {pagination.page} dari {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
