"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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
import { toast } from "@/lib/toast";
import Link from "next/link";

export default function NewBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    batchNumber: "",
    targetQuantity: "",
    scheduledDate: "",
    estimatedCost: "",
    status: "PLANNED",
    notes: "",
  });

  // Set default date to tomorrow
  useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      scheduledDate: tomorrow.toISOString().split('T')[0]
    }));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchNumber || !formData.targetQuantity || !formData.scheduledDate) {
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
      const response = await fetch("/api/production/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchNumber: formData.batchNumber,
          targetQuantity: parseInt(formData.targetQuantity),
          scheduledDate: formData.scheduledDate,
          estimatedCost: parseFloat(formData.estimatedCost) || 0,
          status: formData.status,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create batch");
      }

      const result = await response.json();

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Production batch berhasil dibuat",
      });

      router.push(`/dashboard/production/batches/${result.id}`);

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

  const generateBatchNumber = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 5).replace(':', '');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `BATCH-${date}-${time}-${random}`;
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Buat Batch Manual</h1>
          <p className="text-muted-foreground">
            Buat batch produksi tanpa menggunakan resep
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Data dasar untuk production batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="BATCH-20240101-001"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, batchNumber: generateBatchNumber() }))}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetQuantity">Target Quantity *</Label>
                <Input
                  id="targetQuantity"
                  type="number"
                  min="1"
                  value={formData.targetQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetQuantity: e.target.value }))}
                  placeholder="100"
                  required
                />
                <p className="text-sm text-muted-foreground">Jumlah porsi yang ditargetkan</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Tanggal Produksi *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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
              </div>
            </CardContent>
          </Card>

          {/* Cost and Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Biaya & Catatan</CardTitle>
              <CardDescription>
                Estimasi biaya dan catatan tambahan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimasi Biaya</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                  placeholder="500000"
                />
                <p className="text-sm text-muted-foreground">Dalam Rupiah (IDR)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan tambahan untuk batch ini..."
                  rows={6}
                />
              </div>

              {/* Cost per portion preview */}
              {formData.targetQuantity && formData.estimatedCost && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Estimasi biaya per porsi:</div>
                  <div className="text-lg font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(parseFloat(formData.estimatedCost) / parseInt(formData.targetQuantity))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/production/batches">
              Batal
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Membuat..." : "Buat Batch"}
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">💡 Tips:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Gunakan batch number yang unik dan mudah diidentifikasi</li>
            <li>• Pastikan target quantity sesuai dengan kapasitas produksi</li>
            <li>• Estimasi biaya dapat diperbarui nanti dengan biaya aktual</li>
            <li>• Status dapat diubah seiring progress produksi</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
