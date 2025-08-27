"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function NewPosyanduPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    headName: "",
    headPhone: "",
    address: "",
    latitude: "",
    longitude: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.headName || !formData.headPhone || !formData.address) {
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
      const response = await fetch("/api/posyandu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          headName: formData.headName,
          headPhone: formData.headPhone,
          address: formData.address,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create posyandu");
      }

      const result = await response.json();

      toast({
        open: true,
        onOpenChange: () => {},
        title: "Sukses",
        description: "Posyandu berhasil didaftarkan",
      });

      router.push(`/dashboard/posyandu/${result.id}`);

    } catch (error: any) {
      console.error("Error creating posyandu:", error);
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: error.message || "Gagal mendaftarkan posyandu",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          toast({
            open: true,
            onOpenChange: () => {},
            title: "Lokasi Berhasil Didapat",
            description: "Koordinat GPS telah diisi otomatis",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            open: true,
            onOpenChange: () => {},
            title: "Error",
            description: "Tidak dapat mengakses lokasi GPS",
          });
        }
      );
    } else {
      toast({
        open: true,
        onOpenChange: () => {},
        title: "Error",
        description: "Browser tidak mendukung geolocation",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/posyandu">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Posyandu Baru</h1>
          <p className="text-muted-foreground">
            Daftarkan posyandu baru ke dalam sistem
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
                Data dasar posyandu dan kepala posyandu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Posyandu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Posyandu Melati"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headName">Nama Kepala Posyandu *</Label>
                <Input
                  id="headName"
                  value={formData.headName}
                  onChange={(e) => setFormData(prev => ({ ...prev, headName: e.target.value }))}
                  placeholder="Ibu Sari Melati"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headPhone">Nomor Telepon *</Label>
                <Input
                  id="headPhone"
                  type="tel"
                  value={formData.headPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, headPhone: e.target.value }))}
                  placeholder="081234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Jl. Melati No. 123, Kelurahan ABC, Kecamatan XYZ, Kota/Kabupaten"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lokasi & Informasi Tambahan</CardTitle>
              <CardDescription>
                Koordinat GPS dan catatan tambahan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Koordinat GPS</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Dapatkan Lokasi
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="-6.2088"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="106.8456"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan tambahan tentang posyandu..."
                  rows={6}
                />
              </div>

              {/* Location preview if coordinates are available */}
              {formData.latitude && formData.longitude && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Preview Lokasi:</div>
                  <div className="text-sm font-mono">
                    {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Anda dapat melihat lokasi di Google Maps setelah posyandu didaftarkan
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/posyandu">
              Batal
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Mendaftarkan..." : "Daftar Posyandu"}
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">💡 Tips Pendaftaran Posyandu:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Pastikan nama posyandu unik dan mudah diingat</li>
            <li>• Gunakan alamat lengkap termasuk kelurahan dan kecamatan</li>
            <li>• Koordinat GPS membantu untuk tracking dan distribusi</li>
            <li>• Nomor telepon kepala posyandu untuk komunikasi darurat</li>
            <li>• Setelah posyandu terdaftar, Anda dapat menambah program dan peserta</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
