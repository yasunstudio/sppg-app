"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Users, DollarSign, ChefHat, TrendingUp, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface BatchDetails {
  id: string;
  batchNumber: string;
  status: string;
  plannedQuantity: number;
  actualQuantity: number | null;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  recipe: {
    id: string;
    name: string;
    category: string;
    servingSize: number;
    prepTime: number;
    cookTime: number;
    ingredients: Array<{
      id: string;
      quantity: number;
      unit: string;
      notes: string | null;
      item: {
        id: string;
        name: string;
        unit: string;
        unitPrice: number | null;
        category: string;
      } | null;
    }>;
  } | null;
  productionPlan: {
    id: string;
    planDate: string;
    targetPortions: number;
    status: string;
  } | null;
  qualityChecks: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
  resourceUsage: Array<{
    resource: {
      id: string;
      name: string;
      type: string;
    };
  }>;
  metrics: {
    efficiency: number;
    durationMinutes: number;
    estimatedCost: number;
    costPerPortion: number;
    isOnTime: boolean | null;
  };
  ingredientBreakdown: Array<{
    item: {
      id: string;
      name: string;
      unit: string;
      unitPrice: number | null;
      category: string;
    } | null;
    originalQuantity: number;
    scaledQuantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
    notes: string | null;
  }>;
}

export default function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    plannedQuantity: 0,
    actualQuantity: 0,
    notes: "",
  });

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch(`/api/production/batches/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch batch");
        }
        const data = await response.json();
        setBatch(data);
        setEditData({
          status: data.status,
          plannedQuantity: data.plannedQuantity,
          actualQuantity: data.actualQuantity || 0,
          notes: data.notes || "",
        });
      } catch (error) {
        console.error("Error fetching batch:", error);
        toast({
          open: true,
          onOpenChange: () => {},
          title: "Error",
          description: "Gagal memuat data batch",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [id, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/production/batches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update batch");
      }

      const updatedBatch = await response.json();
      setBatch(updatedBatch);
      setEditing(false);
      
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "Batch berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating batch:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memperbarui batch",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/production/batches/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete batch");
      }

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "Batch berhasil dihapus",
      });

      router.push("/dashboard/production/batches");
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal menghapus batch",
      });
    }
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
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Batch tidak ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Batch {batch.batchNumber}</h1>
            <p className="text-muted-foreground">Detail produksi batch</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Hapus</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Batch</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus batch {batch.batchNumber}? 
                      Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status & Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informasi Batch</CardTitle>
              <CardDescription>Status dan detail dasar batch produksi</CardDescription>
            </div>
            {getStatusBadge(batch.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Planned Quantity</Label>
              {editing ? (
                <Input
                  type="number"
                  value={editData.plannedQuantity}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    plannedQuantity: parseInt(e.target.value) || 0
                  }))}
                />
              ) : (
                <div className="text-2xl font-bold">{batch.plannedQuantity}</div>
              )}
              <div className="text-sm text-muted-foreground">porsi</div>
            </div>
            
            <div className="space-y-2">
              <Label>Actual Quantity</Label>
              {editing ? (
                <Input
                  type="number"
                  value={editData.actualQuantity}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    actualQuantity: parseInt(e.target.value) || 0
                  }))}
                />
              ) : (
                <div className="text-2xl font-bold">{batch.actualQuantity || "-"}</div>
              )}
              <div className="text-sm text-muted-foreground">porsi</div>
            </div>
            
            <div className="space-y-2">
              <Label>Created Date</Label>
              <div className="text-lg font-medium">{formatDate(batch.createdAt)}</div>
              <div className="text-sm text-muted-foreground">
                {batch.startedAt && `Dimulai: ${formatDate(batch.startedAt)}`}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              {editing ? (
                <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Direncanakan</SelectItem>
                    <SelectItem value="IN_PROGRESS">Sedang Proses</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>{getStatusBadge(batch.status)}</div>
              )}
            </div>
          </div>

          {editing && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan tambahan..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Efisiensi Produksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Quantity Efficiency</span>
                <span className="text-sm text-muted-foreground">{batch.metrics?.efficiency?.toFixed(1) || '0'}%</span>
              </div>
              <Progress value={batch.metrics?.efficiency || 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Durasi Produksi</span>
                <span className="font-medium">{batch.metrics?.durationMinutes || 0} menit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Selesai Tepat Waktu</span>
                <span className="font-medium">
                  {batch.metrics?.isOnTime === null ? 'Belum Diketahui' : batch.metrics?.isOnTime ? 'Ya' : 'Tidak'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Analisis Biaya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Cost</span>
                <span className="font-medium">{formatCurrency(batch.metrics?.estimatedCost || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cost per Portion</span>
                <span className="font-medium">{formatCurrency(batch.metrics?.costPerPortion || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quality Checks</span>
                <span className="font-medium">{batch.qualityChecks?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recipe Information */}
      {batch.recipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Recipe: {batch.recipe.name}
            </CardTitle>
            <CardDescription>Category: {batch.recipe.category} • Serving Size: {batch.recipe.servingSize} • Prep: {batch.recipe.prepTime}min • Cook: {batch.recipe.cookTime}min</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.recipe.category}</div>
                  <div className="text-sm text-muted-foreground">Kategori</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.recipe.servingSize}</div>
                  <div className="text-sm text-muted-foreground">Base Serving Size</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.recipe.prepTime + batch.recipe.cookTime} min</div>
                  <div className="text-sm text-muted-foreground">Total Cook Time</div>
                </div>
              </div>

              {/* Ingredients List */}
              {batch.ingredientBreakdown && batch.ingredientBreakdown.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Breakdown Bahan ({batch.ingredientBreakdown.length} items):</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {batch.ingredientBreakdown.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <span className="font-medium">{ingredient.item?.name || 'Unknown Item'}</span>
                          <div className="text-sm text-muted-foreground">
                            Original: {ingredient.originalQuantity} {ingredient.unit} → 
                            Scaled: {ingredient.scaledQuantity.toFixed(1)} {ingredient.unit}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(ingredient.totalCost)}</div>
                          <div className="text-sm text-muted-foreground">
                            @{formatCurrency(ingredient.unitCost || 0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Plan Link */}
      {batch.productionPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Production Plan</CardTitle>
            <CardDescription>Batch ini merupakan bagian dari production plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <div className="font-medium">Production Plan ID: {batch.productionPlan.id}</div>
                <div className="text-sm text-muted-foreground">
                  Plan Date: {formatDate(batch.productionPlan.planDate)} • 
                  Target Portions: {batch.productionPlan.targetPortions} • 
                  Status: {batch.productionPlan.status}
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/production/planning/${batch.productionPlan.id}`}>
                  Lihat Plan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {(batch.notes || editing) && (
        <Card>
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <p className="text-sm">{batch.notes || "Tidak ada catatan"}</p>
            ) : (
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Tambahkan catatan..."
                rows={4}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
