'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Receipt, Save } from 'lucide-react';
import Link from 'next/link';

const transactionTypes = [
  { value: 'INCOME', label: 'Pemasukan' },
  { value: 'EXPENSE', label: 'Pengeluaran' },
];

interface CategoryOption {
  value: string;
  label: string;
}

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
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
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

export default function CreateTransaction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    description: '',
    referenceId: '',
    receiptUrl: '',
    budgetPeriod: getCurrentPeriod(),
  });

  const periodOptions = generatePeriodOptions();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/financial/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories
        setCategories([
          { value: 'RAW_MATERIALS', label: 'Bahan Baku' },
          { value: 'TRANSPORTATION', label: 'Transportasi' },
          { value: 'UTILITIES', label: 'Utilitas' },
          { value: 'SALARIES', label: 'Gaji' },
          { value: 'EQUIPMENT', label: 'Peralatan' },
          { value: 'MAINTENANCE', label: 'Pemeliharaan' },
          { value: 'OTHER', label: 'Lainnya' },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/financial/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        router.push('/dashboard/financial');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menyimpan transaksi');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Terjadi kesalahan saat menyimpan transaksi');
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

  const previewAmount = formData.amount ? parseFloat(formData.amount) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            asChild
            className="h-10 w-10 rounded-full"
          >
            <Link href="/dashboard/financial">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaksi Baru</h1>
            <p className="text-muted-foreground">
              Tambahkan transaksi keuangan baru ke sistem SPPG
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Transaksi</CardTitle>
              <CardDescription>
                Isi informasi lengkap tentang transaksi keuangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Jenis Transaksi *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                      disabled={loadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Pilih kategori"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: CategoryOption) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetPeriod">Periode Budget *</Label>
                    <Select
                      value={formData.budgetPeriod}
                      onValueChange={(value) => handleInputChange('budgetPeriod', value)}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi transaksi..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="referenceId">Nomor Referensi</Label>
                    <Input
                      id="referenceId"
                      placeholder="INV-001, PO-123, dll"
                      value={formData.referenceId}
                      onChange={(e) => handleInputChange('referenceId', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptUrl">URL Kwitansi</Label>
                    <Input
                      id="receiptUrl"
                      type="url"
                      placeholder="https://..."
                      value={formData.receiptUrl}
                      onChange={(e) => handleInputChange('receiptUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      'Menyimpan...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Transaksi
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
                <Receipt className="h-5 w-5" />
                Preview Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Jenis</div>
                <div className="font-medium">
                  {formData.type ? 
                    transactionTypes.find(t => t.value === formData.type)?.label : 
                    '-'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Kategori</div>
                <div className="font-medium">
                  {formData.category ? 
                    categories.find((c: CategoryOption) => c.value === formData.category)?.label : 
                    '-'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Jumlah</div>
                <div className={`text-xl font-bold ${
                  formData.type === 'INCOME' ? 'text-green-600' : 
                  formData.type === 'EXPENSE' ? 'text-red-600' : ''
                }`}>
                  {previewAmount > 0 ? (
                    <>
                      {formData.type === 'INCOME' ? '+' : formData.type === 'EXPENSE' ? '-' : ''}
                      {formatCurrency(previewAmount)}
                    </>
                  ) : (
                    'Rp 0'
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Periode</div>
                <div className="font-medium">
                  {periodOptions.find(p => p.value === formData.budgetPeriod)?.label || '-'}
                </div>
              </div>

              {formData.description && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Deskripsi</div>
                  <div className="text-sm">{formData.description}</div>
                </div>
              )}

              {formData.referenceId && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Referensi</div>
                  <div className="text-sm font-mono">{formData.referenceId}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
