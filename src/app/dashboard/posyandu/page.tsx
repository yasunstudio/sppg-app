"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Users, Calendar, Activity, TrendingUp } from "lucide-react";
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
import { toast } from "sonner";
import Link from "next/link";

interface Posyandu {
  id: string;
  name: string;
  headName: string;
  headPhone: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  createdAt: string;
  stats: {
    totalPrograms: number;
    activePrograms: number;
    totalParticipants: number;
    participantsByType: {
      pregnant: number;
      lactating: number;
      toddler: number;
    };
    nutritionStatusBreakdown: {
      normal: number;
      underweight: number;
      stunted: number;
      wasted: number;
    };
    recentActivities: number;
    activeVolunteers: number;
  };
}

export default function PosyanduDashboard() {
  const [loading, setLoading] = useState(true);
  const [posyandu, setPosyandu] = useState<Posyandu[]>([]);
  const [filteredPosyandu, setFilteredPosyandu] = useState<Posyandu[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPosyandu();
  }, []);

  useEffect(() => {
    filterPosyandu();
  }, [posyandu, searchTerm, districtFilter, statusFilter]);

  const fetchPosyandu = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posyandu");
      if (response.ok) {
        const data = await response.json();
        setPosyandu(data.posyandu || []);
      } else {
        throw new Error("Failed to fetch posyandu");
      }
    } catch (error) {
      console.error("Error fetching posyandu:", error);
      toast.error("Gagal memuat daftar posyandu");
    } finally {
      setLoading(false);
    }
  };

  const filterPosyandu = () => {
    let filtered = posyandu;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // District filter
    if (districtFilter !== "all") {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(districtFilter.toLowerCase())
      );
    }

    setFilteredPosyandu(filtered);
  };

  // Calculate overall statistics
  const overallStats = posyandu.reduce((acc, p) => ({
    totalPosyandu: posyandu.length,
    totalParticipants: acc.totalParticipants + p.stats.totalParticipants,
    totalPrograms: acc.totalPrograms + p.stats.totalPrograms,
    activePrograms: acc.activePrograms + p.stats.activePrograms,
    totalVolunteers: acc.totalVolunteers + p.stats.activeVolunteers,
    pregnantWomen: acc.pregnantWomen + p.stats.participantsByType.pregnant,
    lactatingMothers: acc.lactatingMothers + p.stats.participantsByType.lactating,
    toddlers: acc.toddlers + p.stats.participantsByType.toddler,
    normalNutrition: acc.normalNutrition + p.stats.nutritionStatusBreakdown.normal,
    atRiskNutrition: acc.atRiskNutrition + p.stats.nutritionStatusBreakdown.underweight + p.stats.nutritionStatusBreakdown.stunted + p.stats.nutritionStatusBreakdown.wasted,
  }), {
    totalPosyandu: 0,
    totalParticipants: 0,
    totalPrograms: 0,
    activePrograms: 0,
    totalVolunteers: 0,
    pregnantWomen: 0,
    lactatingMothers: 0,
    toddlers: 0,
    normalNutrition: 0,
    atRiskNutrition: 0,
  });

  const getStatusBadge = (stats: Posyandu['stats']) => {
    const hasActivePrograms = stats.activePrograms > 0;
    const hasParticipants = stats.totalParticipants > 0;
    const hasVolunteers = stats.activeVolunteers > 0;

    if (hasActivePrograms && hasParticipants && hasVolunteers) {
      return <Badge variant="default">Aktif</Badge>;
    } else if (hasParticipants || hasVolunteers) {
      return <Badge variant="secondary">Terbatas</Badge>;
    } else {
      return <Badge variant="outline">Tidak Aktif</Badge>;
    }
  };

  // Get unique districts for filter
  const districts = Array.from(new Set(
    posyandu.map(p => p.address.split(',')[0]?.trim()).filter(Boolean)
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posyandu Management</h1>
          <p className="text-muted-foreground">
            Kelola sistem posyandu untuk ibu hamil, menyusui, dan balita
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posyandu/new">
            <Plus className="h-4 w-4 mr-2" />
            Posyandu Baru
          </Link>
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Posyandu</p>
                <p className="text-2xl font-bold">{overallStats.totalPosyandu}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Peserta</p>
                <p className="text-2xl font-bold">{overallStats.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Program Aktif</p>
                <p className="text-2xl font-bold">{overallStats.activePrograms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Volunteer Aktif</p>
                <p className="text-2xl font-bold">{overallStats.totalVolunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Peserta by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ibu Hamil:</span>
              <span className="font-medium">{overallStats.pregnantWomen}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Ibu Menyusui:</span>
              <span className="font-medium">{overallStats.lactatingMothers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Balita:</span>
              <span className="font-medium">{overallStats.toddlers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status Gizi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Normal:</span>
              <span className="font-medium text-green-600">{overallStats.normalNutrition}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Berisiko:</span>
              <span className="font-medium text-red-600">{overallStats.atRiskNutrition}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Persentase Normal:</span>
              <span className="font-medium">
                {overallStats.totalParticipants > 0 
                  ? Math.round((overallStats.normalNutrition / overallStats.totalParticipants) * 100)
                  : 0
                }%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Program:</span>
              <span className="font-medium">{overallStats.totalPrograms}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rata-rata Peserta:</span>
              <span className="font-medium">
                {overallStats.totalPosyandu > 0 
                  ? Math.round(overallStats.totalParticipants / overallStats.totalPosyandu)
                  : 0
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Program Active Rate:</span>
              <span className="font-medium">
                {overallStats.totalPrograms > 0 
                  ? Math.round((overallStats.activePrograms / overallStats.totalPrograms) * 100)
                  : 0
                }%
              </span>
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
                  placeholder="Cari posyandu, kepala, atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posyandu List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Posyandu ({filteredPosyandu.length})</CardTitle>
          <CardDescription>
            Klik pada posyandu untuk melihat detail dan mengelola program
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Memuat daftar posyandu...</p>
            </div>
          ) : filteredPosyandu.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                {posyandu.length === 0 
                  ? "Belum ada posyandu terdaftar. Mulai dengan mendaftarkan posyandu pertama." 
                  : "Tidak ada posyandu yang sesuai dengan filter."
                }
              </p>
              {posyandu.length === 0 && (
                <Button asChild className="mt-4">
                  <Link href="/dashboard/posyandu/new">
                    Daftar Posyandu Pertama
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosyandu.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/posyandu/${p.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold">{p.name}</h3>
                            {getStatusBadge(p.stats)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Kepala:</span>
                              <div className="font-medium">{p.headName}</div>
                              <div className="text-xs text-muted-foreground">{p.headPhone}</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Alamat:</span>
                              <div className="font-medium">{p.address}</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Peserta:</span>
                              <div className="font-medium">
                                {p.stats.totalParticipants} orang
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {p.stats.participantsByType.pregnant}H, {p.stats.participantsByType.lactating}M, {p.stats.participantsByType.toddler}B
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Program & Volunteer:</span>
                              <div className="font-medium">
                                {p.stats.activePrograms}/{p.stats.totalPrograms} program
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {p.stats.activeVolunteers} volunteer aktif
                              </div>
                            </div>
                          </div>

                          {/* Nutrition Status Indicator */}
                          <div className="mt-3 flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Normal: {p.stats.nutritionStatusBreakdown.normal}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span>Kurang Gizi: {p.stats.nutritionStatusBreakdown.underweight}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span>Stunting: {p.stats.nutritionStatusBreakdown.stunted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <span>Wasting: {p.stats.nutritionStatusBreakdown.wasted}</span>
                            </div>
                          </div>
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
