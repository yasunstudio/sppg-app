'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Target, Save } from 'lucide-react';
import Link from 'next/link';

const transactionCategories = [
  { value: 'RAW_MATERIALS', label: 'Bahan Baku' },
  { value: 'TRANSPORTATION', label: 'Transportasi' },
  { value: 'UTILITIES', label: 'Utilitas' },
  { value: 'SALARIES', label: 'Gaji' },
  { value: 'EQUIPMENT', label: 'Peralatan' },
  { value: 'MAINTENANCE', label: 'Pemeliharaan' },
  { value: 'OTHER', label: 'Lainnya' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function generatePeriodOptions(): Array<{ value: string; label: string }> {
  const options = [];
  const now = new Date();
  
  // Current month and next 6 months for budget planning
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const [year, month] = period.split('-');
    const label = `${monthNames[parseInt(month) - 1]} ${year}`;
    options.push({ value: period, label });
  }
  
  return options;
}

export default function CreateBudget() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    period: getCurrentPeriod(),
    category: '',
    allocated: '',
    notes: '',
  });

  const periodOptions = generatePeriodOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/financial/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          allocated: parseFloat(formData.allocated),
        }),
      });

      if (response.ok) {
        router.push('/dashboard/financial');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menyimpan budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Terjadi kesalahan saat menyimpan budget');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const previewAmount = formData.allocated ? parseFloat(formData.allocated) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/financial">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Baru</h1>
          <p className="text-muted-foreground">
            Buat budget baru untuk kategori pengeluaran
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Budget</CardTitle>
              <CardDescription>
                Atur alokasi budget untuk kategori pengeluaran tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="period">Periode *</Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value) => handleInputChange('period', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allocated">Jumlah Alokasi *</Label>
                  <Input
                    id="allocated"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.allocated}
                    onChange={(e) => handleInputChange('allocated', e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Masukkan jumlah budget yang dialokasikan untuk kategori ini
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tambahkan catatan untuk budget ini..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      'Menyimpan...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Budget
                      </>
                    )}
                  </Button>
                  <Link href="/dashboard/financial">
                    <Button type="button" variant="outline">
                      Batal
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Preview Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Periode</div>
                <div className="font-medium">
                  {formData.period ? 
                    periodOptions.find(p => p.value === formData.period)?.label : 
                    '-'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Kategori</div>
                <div className="font-medium">
                  {formData.category ? 
                    transactionCategories.find(c => c.value === formData.category)?.label : 
                    '-'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Alokasi Budget</div>
                <div className="text-2xl font-bold text-blue-600">
                  {previewAmount > 0 ? formatCurrency(previewAmount) : 'Rp 0'}
                </div>
              </div>

              {formData.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Catatan</div>
                  <div className="text-sm">{formData.notes}</div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Status Budget</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Dialokasikan</span>
                    <span className="font-medium">{formatCurrency(previewAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Terpakai</span>
                    <span className="font-medium">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sisa</span>
                    <span className="font-medium text-green-600">{formatCurrency(previewAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tips Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Budget akan otomatis terupdate saat ada transaksi pengeluaran</p>
              <p>• Anda dapat mengubah alokasi budget kapan saja</p>
              <p>• Pantau utilization percentage agar tidak over budget</p>
              <p>• Gunakan catatan untuk mencatat pertimbangan budget</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
