"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Edit, 
  Save, 
  X,
  Plus,
  Eye
} from "lucide-react";
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

interface ProductionPlanDetails {
  id: string;
  planDate: string;
  targetPortions: number;
  status: string;
  plannedStartTime: string | null;
  plannedEndTime: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  menu: {
    id: string;
    name: string;
    mealType: string;
  } | null;
  batches: Array<{
    id: string;
    batchNumber: string;
    status: string;
    plannedQuantity: number;
    actualQuantity: number | null;
    startedAt: string | null;
    completedAt: string | null;
    recipe: {
      id: string;
      name: string;
      category: string;
      servingSize: number;
      prepTime: number;
      cookTime: number;
    } | null;
    qualityChecks: Array<{
      id: string;
      status: string;
      createdAt: string;
    }>;
  }>;
  qualityChecks: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
  metrics: {
    totalPlannedQuantity: number;
    totalActualQuantity: number;
    efficiency: number;
    completedBatches: number;
    totalBatches: number;
    completionRate: number;
    totalQualityChecks: number;
    targetPortions: number;
  };
}

export default function ProductionPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<ProductionPlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    planDate: "",
    targetPortions: 0,
    status: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/production/plans/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch production plan");
        }
        const data = await response.json();
        setPlan(data);
        setEditData({
          planDate: data.planDate?.split('T')[0] || "",
          targetPortions: data.targetPortions,
          status: data.status,
          notes: data.notes || "",
        });
      } catch (error) {
        console.error("Error fetching production plan:", error);
        toast({
          open: true,
          onOpenChange: () => {},
          title: "Error",
          description: "Gagal memuat data rencana produksi",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/production/plans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update production plan");
      }

      const updatedPlan = await response.json();
      setPlan(updatedPlan);
      setEditing(false);
      
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "Rencana produksi berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating production plan:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal memperbarui rencana produksi",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/production/plans/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete production plan");
      }

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Success",
        description: "Rencana produksi berhasil dihapus",
      });

      router.push("/dashboard/production/planning");
    } catch (error) {
      console.error("Error deleting production plan:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Gagal menghapus rencana produksi",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Rencana produksi tidak ditemukan</h2>
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
            <h1 className="text-3xl font-bold">Rencana Produksi {plan.id}</h1>
            <p className="text-muted-foreground">Detail rencana produksi makanan</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button asChild>
                <Link href={`/dashboard/production/planning/${id}/edit`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Kelola
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Hapus</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Rencana Produksi</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus rencana produksi ini? 
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
              <CardTitle>Informasi Rencana</CardTitle>
              <CardDescription>Status dan detail dasar rencana produksi</CardDescription>
            </div>
            {getStatusBadge(plan.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Tanggal Rencana</Label>
              {editing ? (
                <Input
                  type="date"
                  value={editData.planDate}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    planDate: e.target.value
                  }))}
                />
              ) : (
                <div className="text-lg font-medium">{formatDate(plan.planDate)}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Target Porsi</Label>
              {editing ? (
                <Input
                  type="number"
                  value={editData.targetPortions}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    targetPortions: parseInt(e.target.value) || 0
                  }))}
                />
              ) : (
                <div className="text-2xl font-bold">{plan.targetPortions}</div>
              )}
              <div className="text-sm text-muted-foreground">porsi</div>
            </div>
            
            <div className="space-y-2">
              <Label>Menu Terkait</Label>
              <div className="text-lg font-medium">
                {plan.menu ? (
                  <Link 
                    href={`/dashboard/menu-planning/${plan.menu.id}`}
                    className="text-primary hover:underline"
                  >
                    {plan.menu.name}
                  </Link>
                ) : (
                  "Belum ada menu"
                )}
              </div>
              {plan.menu && (
                <div className="text-sm text-muted-foreground">{plan.menu.mealType}</div>
              )}
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
                <div>{getStatusBadge(plan.status)}</div>
              )}
            </div>
          </div>

          {editing && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Catatan</Label>
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

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {plan.metrics.completionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Tingkat Penyelesaian</p>
            <Progress value={plan.metrics.completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {plan.metrics.efficiency.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Efisiensi Produksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {plan.metrics.completedBatches}/{plan.metrics.totalBatches}
            </div>
            <p className="text-sm text-muted-foreground">Batch Selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {plan.metrics.totalQualityChecks}
            </div>
            <p className="text-sm text-muted-foreground">Quality Checks</p>
          </CardContent>
        </Card>
      </div>

      {/* Production Batches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Batch Produksi</CardTitle>
              <CardDescription>Daftar batch dalam rencana produksi ini</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href={`/dashboard/production/batches/create?planId=${plan.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Batch
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {plan.batches.length > 0 ? (
            <div className="space-y-4">
              {plan.batches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{batch.batchNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {batch.recipe?.name || "No recipe"} • 
                      Planned: {batch.plannedQuantity} • 
                      Actual: {batch.actualQuantity || "TBD"}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(batch.status)}
                      {batch.qualityChecks.length > 0 && (
                        <Badge variant="outline">
                          {batch.qualityChecks.length} QC
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/production/batches/${batch.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada batch produksi. Klik "Tambah Batch" untuk memulai.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {(plan.notes || editing) && (
        <Card>
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <p className="text-sm">{plan.notes || "Tidak ada catatan"}</p>
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
