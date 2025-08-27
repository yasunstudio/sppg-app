"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, Users, DollarSign, Clock, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface ProductionBatch {
  id: string;
  batchNumber: string;
  status: string;
  targetQuantity: number;
  actualQuantity: number | null;
  scheduledDate: string;
  startedAt: string | null;
  completedAt: string | null;
  estimatedCost: number;
  actualCost: number | null;
  recipe: {
    id: string;
    name: string;
    category: string;
  } | null;
  productionPlan: {
    id: string;
    name: string;
  } | null;
}

export default function ProductionBatchesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<ProductionBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    filterBatches();
  }, [batches, searchTerm, statusFilter, categoryFilter]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/production/batches");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        throw new Error("Failed to fetch batches");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memuat daftar batch",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBatches = () => {
    let filtered = batches;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(batch =>
        batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.recipe?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(batch => batch.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(batch => batch.recipe?.category === categoryFilter);
    }

    setFilteredBatches(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PLANNED: { label: "Direncanakan", variant: "secondary" as const },
      IN_PROGRESS: { label: "Sedang Proses", variant: "default" as const },
      COMPLETED: { label: "Selesai", variant: "default" as const },
      CANCELLED: { label: "Dibatalkan", variant: "destructive" as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: "secondary" as const 
    };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateEfficiency = (batch: ProductionBatch) => {
    if (!batch.actualQuantity || !batch.targetQuantity) return 0;
    return Math.round((batch.actualQuantity / batch.targetQuantity) * 100);
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(
    batches.map(batch => batch.recipe?.category).filter(Boolean)
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Batches</h1>
          <p className="text-muted-foreground">
            Kelola batch produksi untuk operasional dapur
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/production/batches/from-recipe">
              <ChefHat className="h-4 w-4 mr-2" />
              Dari Resep
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/production/batches/new">
              <Plus className="h-4 w-4 mr-2" />
              Batch Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{batches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {batches.filter(b => b.status === "IN_PROGRESS").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Portions</p>
                <p className="text-2xl font-bold">
                  {batches.reduce((sum, batch) => sum + (batch.actualQuantity || batch.targetQuantity), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(batches.reduce((sum, batch) => sum + (batch.actualCost || batch.estimatedCost), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari batch number atau nama resep..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PLANNED">Direncanakan</SelectItem>
                <SelectItem value="IN_PROGRESS">Sedang Proses</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category || ""}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batch List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Production Batches ({filteredBatches.length})</CardTitle>
          <CardDescription>
            Klik pada batch untuk melihat detail dan mengelola
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Memuat daftar batch...</p>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                {batches.length === 0 
                  ? "Belum ada batch produksi. Mulai dengan membuat batch pertama Anda." 
                  : "Tidak ada batch yang sesuai dengan filter."
                }
              </p>
              {batches.length === 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button asChild>
                    <Link href="/dashboard/production/batches/from-recipe">
                      Buat dari Resep
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/production/batches/new">
                      Buat Manual
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBatches.map((batch) => (
                <Link
                  key={batch.id}
                  href={`/dashboard/production/batches/${batch.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold">{batch.batchNumber}</h3>
                            {getStatusBadge(batch.status)}
                            {batch.recipe && (
                              <Badge variant="outline">{batch.recipe.category}</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Recipe:</span>
                              <div className="font-medium">
                                {batch.recipe?.name || "Manual Batch"}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Quantity:</span>
                              <div className="font-medium">
                                {batch.actualQuantity || batch.targetQuantity} porsi
                                {batch.actualQuantity && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({calculateEfficiency(batch)}% efisiensi)
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Scheduled:</span>
                              <div className="font-medium">{formatDate(batch.scheduledDate)}</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Cost:</span>
                              <div className="font-medium">
                                {formatCurrency(batch.actualCost || batch.estimatedCost)}
                                {batch.actualCost && batch.actualCost !== batch.estimatedCost && (
                                  <span className={`text-xs ml-1 ${batch.actualCost > batch.estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                                    ({batch.actualCost > batch.estimatedCost ? '+' : ''}{formatCurrency(batch.actualCost - batch.estimatedCost)})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {batch.productionPlan && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Production Plan: {batch.productionPlan.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
