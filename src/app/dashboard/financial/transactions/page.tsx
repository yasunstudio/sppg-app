'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Filter, Download, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  referenceId?: string;
  receiptUrl?: string;
  budgetPeriod: string;
  createdAt: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const transactionTypes = [
  { value: 'ALL', label: 'Semua Jenis' },
  { value: 'INCOME', label: 'Pemasukan' },
  { value: 'EXPENSE', label: 'Pengeluaran' },
];

const transactionCategories = [
  { value: 'ALL', label: 'Semua Kategori' },
  { value: 'RAW_MATERIALS', label: 'Bahan Baku' },
  { value: 'TRANSPORTATION', label: 'Transportasi' },
  { value: 'UTILITIES', label: 'Utilitas' },
  { value: 'SALARIES', label: 'Gaji' },
  { value: 'EQUIPMENT', label: 'Peralatan' },
  { value: 'MAINTENANCE', label: 'Pemeliharaan' },
  { value: 'OTHER', label: 'Lainnya' },
];

const categoryLabels: Record<string, string> = {
  RAW_MATERIALS: 'Bahan Baku',
  TRANSPORTATION: 'Transportasi',
  UTILITIES: 'Utilitas',
  SALARIES: 'Gaji',
  EQUIPMENT: 'Peralatan',
  MAINTENANCE: 'Pemeliharaan',
  OTHER: 'Lainnya',
};

const typeLabels: Record<string, string> = {
  INCOME: 'Pemasukan',
  EXPENSE: 'Pengeluaran',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

export default function TransactionsList() {
  const [data, setData] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'ALL',
    category: 'ALL',
    period: '',
    page: 1,
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.set('search', filters.search);
      if (filters.type && filters.type !== 'ALL') params.set('type', filters.type);
      if (filters.category && filters.category !== 'ALL') params.set('category', filters.category);
      if (filters.period) params.set('period', filters.period);
      params.set('page', filters.page.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/financial/transactions?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: field !== 'page' ? 1 : (typeof value === 'number' ? value : parseInt(value) || 1), // Reset to page 1 when filters change
    }));
  };

  const exportTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.category) params.set('category', filters.category);
      if (filters.period) params.set('period', filters.period);
      params.set('limit', '1000'); // Get all for export

      const response = await fetch(`/api/financial/transactions?${params}`);
      if (response.ok) {
        const result = await response.json();
        // Here you would implement CSV/Excel export
        console.log('Export data:', result.transactions);
        alert('Fitur export akan segera tersedia');
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'ALL',
      category: 'ALL',
      period: '',
      page: 1,
    });
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Daftar Transaksi</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua transaksi keuangan SPPG
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/financial/transactions/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Transaksi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Transaksi
          </CardTitle>
          <CardDescription>
            Gunakan filter untuk mencari transaksi tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Deskripsi atau referensi..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis</label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
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
              <label className="text-sm font-medium">Kategori</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Input
                type="month"
                value={filters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transaksi</CardTitle>
              <CardDescription>
                {data?.pagination.total || 0} transaksi ditemukan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data?.transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[transaction.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}
                        >
                          {typeLabels[transaction.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatPeriod(transaction.budgetPeriod)}
                      </TableCell>
                      <TableCell>
                        {transaction.referenceId ? (
                          <span className="font-mono text-sm">
                            {transaction.referenceId}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {transaction.receiptUrl && (
                            <a
                              href={transaction.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data && data.pagination.pages > 1 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan {((data.pagination.page - 1) * 20) + 1} - {Math.min(data.pagination.page * 20, data.pagination.total)} dari {data.pagination.total} transaksi
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={data.pagination.page <= 1}
                        onClick={() => handleFilterChange('page', data.pagination.page - 1)}
                      >
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={data.pagination.page >= data.pagination.pages}
                        onClick={() => handleFilterChange('page', data.pagination.page + 1)}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
