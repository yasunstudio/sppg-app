'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

interface FinancialStats {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  expenseByCategory: Array<{
    category: string;
    amount: number;
  }>;
  budgetUtilization: Array<{
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    utilizationPercentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
  monthlyTrends: Array<{
    period: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

interface FinancialReports {
  type: string;
  period: string;
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    incomeTransactions: number;
    expenseTransactions: number;
    profitMargin: number;
  };
  topIncomeCategories?: Array<{
    category: string;
    amount: number;
  }>;
  topExpenseCategories?: Array<{
    category: string;
    amount: number;
  }>;
  weeklyTrends?: Array<{
    week: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  budgetVariance?: Array<{
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
    status: string;
  }>;
}

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
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function generatePeriodOptions(): Array<{ value: string; label: string }> {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value: period,
      label: formatPeriod(period),
    });
  }
  
  return options;
}

export default function FinancialDashboard() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [reports, setReports] = useState<FinancialReports | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('summary');
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);

  const periodOptions = generatePeriodOptions();

  useEffect(() => {
    if (!selectedPeriod && periodOptions.length > 0) {
      setSelectedPeriod(periodOptions[0].value);
    }
  }, [periodOptions, selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod) {
      fetchStats();
      fetchReports();
    }
  }, [selectedPeriod, selectedReportType]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/financial/stats?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching financial stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const response = await fetch(`/api/financial/reports?period=${selectedPeriod}&type=${selectedReportType}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching financial reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading financial data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Keuangan</h1>
          <p className="text-muted-foreground">
            Kelola transaksi, budget, dan analisis keuangan SPPG
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/dashboard/financial/transactions/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Transaksi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Periode {formatPeriod(stats.period)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Periode {formatPeriod(stats.period)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
            <DollarSign className={`h-4 w-4 ${stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.netIncome >= 0 ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Terbesar</CardTitle>
            <PieChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.expenseByCategory.length > 0 ? 
                categoryLabels[stats.expenseByCategory[0].category] : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.expenseByCategory.length > 0 ? 
                formatCurrency(stats.expenseByCategory[0].amount) : 'Tidak ada data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Expense by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Pengeluaran per Kategori</CardTitle>
                <CardDescription>
                  Distribusi pengeluaran periode {formatPeriod(stats.period)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.expenseByCategory.map((item) => {
                  const percentage = stats.totalExpenses > 0 ? (item.amount / stats.totalExpenses) * 100 : 0;
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {categoryLabels[item.category]}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Bulanan</CardTitle>
                <CardDescription>
                  Performa keuangan 6 bulan terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.monthlyTrends.map((trend) => (
                    <div key={trend.period} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {formatPeriod(trend.period)}
                        </span>
                        <Badge variant={trend.net >= 0 ? 'default' : 'destructive'}>
                          {formatCurrency(trend.net)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Pemasukan: {formatCurrency(trend.income)}</div>
                        <div>Pengeluaran: {formatCurrency(trend.expenses)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Budget Utilization</h3>
            <Link href="/dashboard/financial/budgets/create">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Buat Budget
              </Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {stats.budgetUtilization.map((budget) => (
              <Card key={budget.category}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{categoryLabels[budget.category]}</h4>
                      <Badge 
                        variant={budget.utilizationPercentage > 90 ? 'destructive' : 
                                budget.utilizationPercentage > 75 ? 'secondary' : 'default'}
                      >
                        {budget.utilizationPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <Progress value={budget.utilizationPercentage} className="h-3" />
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Dialokasikan</div>
                        <div className="font-medium">{formatCurrency(budget.allocated)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Terpakai</div>
                        <div className="font-medium">{formatCurrency(budget.spent)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Sisa</div>
                        <div className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(budget.remaining)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Transaksi Terbaru</h3>
            <Link href="/dashboard/financial/transactions">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {categoryLabels[transaction.category]} • {' '}
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[transaction.type]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Laporan Keuangan</h3>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Ringkasan</SelectItem>
                <SelectItem value="category">Per Kategori</SelectItem>
                <SelectItem value="trend">Tren Mingguan</SelectItem>
                <SelectItem value="budget-variance">Analisis Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Memuat laporan...</p>
            </div>
          ) : reports ? (
            <div className="space-y-6">
              {/* Summary Report */}
              {reports.type === 'summary' && reports.summary && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ringkasan Keuangan</CardTitle>
                      <CardDescription>Periode {formatPeriod(reports.period)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Total Pemasukan</div>
                          <div className="font-medium text-green-600">{formatCurrency(reports.summary.totalIncome)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Pengeluaran</div>
                          <div className="font-medium text-red-600">{formatCurrency(reports.summary.totalExpenses)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Laba Bersih</div>
                          <div className={`font-medium ${reports.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(reports.summary.netIncome)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Margin Keuntungan</div>
                          <div className="font-medium">{reports.summary.profitMargin.toFixed(1)}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Kategori Pemasukan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {reports.topIncomeCategories?.map((item, index) => (
                        <div key={item.category} className="flex justify-between items-center">
                          <span className="text-sm">{index + 1}. {categoryLabels[item.category]}</span>
                          <span className="font-medium text-green-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Kategori Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {reports.topExpenseCategories?.map((item, index) => (
                        <div key={item.category} className="flex justify-between items-center">
                          <span className="text-sm">{index + 1}. {categoryLabels[item.category]}</span>
                          <span className="font-medium text-red-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Weekly Trends Report */}
              {reports.type === 'trend' && reports.weeklyTrends && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Mingguan</CardTitle>
                    <CardDescription>Performa keuangan per minggu di periode {formatPeriod(reports.period)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.weeklyTrends.map((week) => (
                        <div key={week.week} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{week.week}</span>
                            <Badge variant={week.net >= 0 ? 'default' : 'destructive'}>
                              {formatCurrency(week.net)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>Pemasukan: {formatCurrency(week.income)}</div>
                            <div>Pengeluaran: {formatCurrency(week.expenses)}</div>
                          </div>
                          <Progress value={week.income > 0 ? (week.net / week.income) * 100 : 0} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Budget Variance Report */}
              {reports.type === 'budget-variance' && reports.budgetVariance && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analisis Varians Budget</CardTitle>
                    <CardDescription>Perbandingan budget vs realisasi periode {formatPeriod(reports.period)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.budgetVariance.map((item) => (
                        <div key={item.category} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{categoryLabels[item.category]}</h4>
                            <Badge variant={item.status === 'over' ? 'destructive' : 'default'}>
                              {item.status === 'over' ? 'Over Budget' : 'Under Budget'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Budget</div>
                              <div className="font-medium">{formatCurrency(item.budgeted)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Aktual</div>
                              <div className="font-medium">{formatCurrency(item.actual)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Selisih</div>
                              <div className={`font-medium ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(Math.abs(item.variance))} ({Math.abs(item.variancePercentage).toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak Ada Data Laporan</h3>
              <p className="text-muted-foreground">
                Tidak ada data laporan untuk periode yang dipilih
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
