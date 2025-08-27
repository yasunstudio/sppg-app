"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";

interface BatchDetails {
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
  notes: string | null;
  recipe: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    servingSize: number;
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
  } | null;
  productionPlan: {
    id: string;
    name: string;
    description: string | null;
    targetDate: string;
    status: string;
  } | null;
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

interface BatchDetailPageProps {
  params: {
    id: string;
  };
}

export default function BatchDetailPage({ params }: BatchDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  
  // Edit form states
  const [editData, setEditData] = useState({
    targetQuantity: 0,
    actualQuantity: 0,
    actualCost: 0,
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchBatchDetails();
  }, [params.id]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/production/batches/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch batch details");
      }
      const data = await response.json();
      setBatch(data);
      
      // Initialize edit form
      setEditData({
        targetQuantity: data.targetQuantity,
        actualQuantity: data.actualQuantity || 0,
        actualCost: data.actualCost || 0,
        status: data.status,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching batch:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memuat detail batch",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/production/batches/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update batch");
      }

      await fetchBatchDetails();
      setEditing(false);
      
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Data batch berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating batch:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memperbarui data batch",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/production/batches/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete batch");
      }

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
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

  const calculateEfficiency = () => {
    if (!batch?.actualQuantity || !batch?.targetQuantity) return 0;
    return Math.round((batch.actualQuantity / batch.targetQuantity) * 100);
  };

  const calculateCostEfficiency = () => {
    if (!batch?.actualCost || !batch?.estimatedCost) return 0;
    return Math.round(((batch.estimatedCost - batch.actualCost) / batch.estimatedCost) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat detail batch...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Batch tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/production/batches">
            Kembali ke Daftar Batch
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/production/batches">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Batch {batch.batchNumber}
            </h1>
            <p className="text-muted-foreground">
              Detail production batch dan tracking
            </p>
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
              <Label>Target Quantity</Label>
              {editing ? (
                <Input
                  type="number"
                  value={editData.targetQuantity}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    targetQuantity: parseInt(e.target.value) || 0
                  }))}
                />
              ) : (
                <div className="text-2xl font-bold">{batch.targetQuantity}</div>
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
              <Label>Scheduled Date</Label>
              <div className="text-lg font-medium">{formatDate(batch.scheduledDate)}</div>
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
                <Label>Actual Cost</Label>
                <Input
                  type="number"
                  value={editData.actualCost}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    actualCost: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="Biaya aktual produksi"
                />
              </div>
              
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
                <span className="text-sm text-muted-foreground">{calculateEfficiency()}%</span>
              </div>
              <Progress value={calculateEfficiency()} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Cost Efficiency</span>
                <span className="text-sm text-muted-foreground">{calculateCostEfficiency()}%</span>
              </div>
              <Progress value={Math.max(0, calculateCostEfficiency())} className="h-2" />
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
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Estimated Cost:</span>
                <span className="font-medium">{formatCurrency(batch.estimatedCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Actual Cost:</span>
                <span className="font-medium">{batch.actualCost ? formatCurrency(batch.actualCost) : "-"}</span>
              </div>
              {batch.actualCost && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Variance:</span>
                  <span className={`font-medium ${batch.actualCost > batch.estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(batch.actualCost - batch.estimatedCost)}
                  </span>
                </div>
              )}
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
            <CardDescription>Scaling dari {batch.scalingInfo.originalServings} ke {batch.scalingInfo.targetPortions} porsi (factor: {batch.scalingInfo.scalingFactor.toFixed(1)}x)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.recipe.category}</div>
                  <div className="text-sm text-muted-foreground">Kategori</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.scalingInfo.totalIngredients}</div>
                  <div className="text-sm text-muted-foreground">Total Bahan</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-lg font-bold">{batch.scalingInfo.estimatedTime} min</div>
                  <div className="text-sm text-muted-foreground">Estimasi Waktu</div>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="font-medium mb-3">Breakdown Bahan ({batch.ingredientsList.length} items):</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {batch.ingredientsList.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">{ingredient.item.name}</span>
                        <div className="text-sm text-muted-foreground">
                          Original: {ingredient.originalQuantity} {ingredient.unit} → 
                          Scaled: {ingredient.scaledQuantity.toFixed(1)} {ingredient.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(ingredient.estimatedCost)}</div>
                        <div className="text-sm text-muted-foreground">
                          @{formatCurrency(ingredient.item.unitPrice || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                <div className="font-medium">{batch.productionPlan.name}</div>
                <div className="text-sm text-muted-foreground">
                  Target: {formatDate(batch.productionPlan.targetDate)} • 
                  Status: {batch.productionPlan.status}
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/production/plans/${batch.productionPlan.id}`}>
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
