'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, 
  TrendingDown, Factory, Truck, DollarSign, CheckCircle, School,
  Users, Package, AlertTriangle, Info, Lightbulb, Clock,
  ArrowLeft, Filter, RefreshCw, Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ReportData {
  reportType: string;
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
  data: {
    summary?: {
      totalMealsProduced: number;
      totalMealsDelivered: number;
      totalRevenue: number;
      totalCosts: number;
      profitMargin: number;
      qualityScore: number;
      schoolsSatisfaction: number;
    };
    breakdown?: {
      production: any;
      distribution: any;
      financial: any;
      quality: any;
      schools: any;
    };
    trends?: any;
    recommendations?: Array<{
      category: string;
      priority: string;
      message: string;
    }>;
    plans?: Array<any>;
    distributions?: Array<any>;
    transactions?: Array<any>;
    budgets?: Array<any>;
    checks?: Array<any>;
    metrics?: any;
  };
}

const reportTypes = [
  { value: 'summary', label: 'Laporan Ringkasan', icon: FileText },
  { value: 'production', label: 'Laporan Produksi', icon: Factory },
  { value: 'distribution', label: 'Laporan Distribusi', icon: Truck },
  { value: 'financial', label: 'Laporan Keuangan', icon: DollarSign },
  { value: 'quality', label: 'Laporan Kualitas', icon: CheckCircle },
];

const periodOptions = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'quarter', label: 'Kuartal Ini' },
  { value: 'year', label: 'Tahun Ini' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID');
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('id-ID');
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <BarChart3 className="h-4 w-4 text-gray-600" />;
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'summary',
    period: 'month',
    format: 'json',
  });

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: filters.type,
        period: filters.period,
        format: filters.format,
      });

      const response = await fetch(`/api/monitoring/reports?${params}`);
      if (response.ok) {
        if (filters.format === 'csv') {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filters.type}-report-${filters.period}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const data = await response.json();
          setReportData(data);
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'json' | 'csv') => {
    const currentFilters = { ...filters, format };
    const params = new URLSearchParams({
      type: currentFilters.type,
      period: currentFilters.period,
      format: currentFilters.format,
    });

    try {
      const response = await fetch(`/api/monitoring/reports?${params}`);
      if (response.ok) {
        if (format === 'csv') {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentFilters.type}-report-${currentFilters.period}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentFilters.type}-report-${currentFilters.period}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/monitoring">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan & Analytics</h1>
            <p className="text-muted-foreground">
              Generate dan export laporan comprehensive untuk semua aspek operasional
            </p>
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Konfigurasi Laporan
          </CardTitle>
          <CardDescription>
            Pilih jenis laporan dan periode yang ingin di-generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Jenis Laporan</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periode</Label>
              <Select
                value={filters.period}
                onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={loading} className="flex-1">
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Export</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportReport('json')}
                  disabled={!reportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportReport('csv')}
                  disabled={!reportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating report...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const reportType = reportTypes.find(t => t.value === reportData.reportType);
                      const IconComponent = reportType?.icon;
                      return (
                        <>
                          {IconComponent && <IconComponent className="h-5 w-5" />}
                          {reportType?.label}
                        </>
                      );
                    })()}
                  </CardTitle>
                  <CardDescription>
                    Periode: {formatDate(reportData.dateRange.startDate)} - {formatDate(reportData.dateRange.endDate)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(reportData.generatedAt)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Report Content Tabs */}
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="details">Detail</TabsTrigger>
              <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              {reportData.data.summary && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Produksi</CardTitle>
                      <Factory className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.data.summary.totalMealsProduced.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">porsi makanan</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Distribusi</CardTitle>
                      <Truck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reportData.data.summary.totalMealsDelivered.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">porsi dikirim</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.data.summary.totalRevenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Margin: {reportData.data.summary.profitMargin.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {reportData.data.summary.qualityScore.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Satisfaction: {reportData.data.summary.schoolsSatisfaction.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {reportData.data.breakdown && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Breakdown Keuangan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Revenue</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(reportData.data.breakdown.financial.totalRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Costs</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(reportData.data.breakdown.financial.totalCosts)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Net Profit</span>
                        <span className={`font-bold ${reportData.data.breakdown.financial.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(reportData.data.breakdown.financial.profit)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Profit Margin</span>
                          <span>{reportData.data.breakdown.financial.profitMargin.toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.max(0, reportData.data.breakdown.financial.profitMargin)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Production Rate</span>
                          <span>{reportData.data.breakdown.production.completionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={reportData.data.breakdown.production.completionRate} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Distribution Rate</span>
                          <span>{reportData.data.breakdown.distribution.completionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={reportData.data.breakdown.distribution.completionRate} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Quality Pass Rate</span>
                          <span>{reportData.data.breakdown.quality.passRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={reportData.data.breakdown.quality.passRate} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              {reportData.data.breakdown && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Produksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Plans</span>
                        <span className="font-medium">{reportData.data.breakdown.production.totalPlans}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-medium">{reportData.data.breakdown.production.completedBatches}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium text-green-600">
                          {reportData.data.breakdown.production.completionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meals Produced</span>
                        <span className="font-medium">{reportData.data.breakdown.production.totalMealsProduced.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Distribusi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Distributions</span>
                        <span className="font-medium">{reportData.data.breakdown.distribution.totalDistributions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-medium">{reportData.data.breakdown.distribution.completedDistributions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium text-green-600">
                          {reportData.data.breakdown.distribution.completionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meals Delivered</span>
                        <span className="font-medium">{reportData.data.breakdown.distribution.totalMealsDelivered.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Kualitas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Checks</span>
                        <span className="font-medium">{reportData.data.breakdown.quality.totalChecks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Passed</span>
                        <span className="font-medium text-green-600">{reportData.data.breakdown.quality.passedChecks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pass Rate</span>
                        <span className="font-medium text-green-600">
                          {reportData.data.breakdown.quality.passRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">{reportData.data.breakdown.quality.averageScore}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sekolah</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Schools</span>
                        <span className="font-medium">{reportData.data.breakdown.schools.totalSchools}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Students</span>
                        <span className="font-medium">{reportData.data.breakdown.schools.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfaction</span>
                        <span className="font-medium text-green-600">
                          {reportData.data.breakdown.schools.averageSatisfaction}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meals Served</span>
                        <span className="font-medium">{reportData.data.breakdown.schools.mealsServed.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              {reportData.data.trends && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(reportData.data.trends).map(([key, trend]: [string, any]) => (
                    <Card key={key}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
                        {getTrendIcon(trend.trend)}
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${
                          trend.trend === 'up' ? 'text-green-600' : 
                          trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trend.percentage > 0 ? '+' : ''}{trend.percentage.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          vs periode sebelumnya
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              {/* Production Details */}
              {reportData.data.plans && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Produksi</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Tanggal</th>
                            <th className="px-4 py-2 text-left">Menu</th>
                            <th className="px-4 py-2 text-right">Target</th>
                            <th className="px-4 py-2 text-right">Actual</th>
                            <th className="px-4 py-2 text-right">Efficiency</th>
                            <th className="px-4 py-2 text-right">Batches</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {reportData.data.plans.slice(0, 10).map((plan: any) => (
                            <tr key={plan.id}>
                              <td className="px-4 py-2">{formatDate(plan.date)}</td>
                              <td className="px-4 py-2">{plan.menuName}</td>
                              <td className="px-4 py-2 text-right">{plan.targetPortions.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right">{plan.actualPortions.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right">
                                <span className={`${plan.efficiency >= 90 ? 'text-green-600' : plan.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {plan.efficiency.toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right">{plan.batchesCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Financial Details */}
              {reportData.data.transactions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Transaksi Keuangan</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Tanggal</th>
                            <th className="px-4 py-2 text-left">Jenis</th>
                            <th className="px-4 py-2 text-left">Kategori</th>
                            <th className="px-4 py-2 text-left">Deskripsi</th>
                            <th className="px-4 py-2 text-right">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {reportData.data.transactions.slice(0, 10).map((tx: any) => (
                            <tr key={tx.id}>
                              <td className="px-4 py-2">{formatDate(tx.date)}</td>
                              <td className="px-4 py-2">
                                <Badge variant={tx.type === 'INCOME' ? 'default' : 'secondary'}>
                                  {tx.type}
                                </Badge>
                              </td>
                              <td className="px-4 py-2">{tx.category}</td>
                              <td className="px-4 py-2">{tx.description}</td>
                              <td className={`px-4 py-2 text-right font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              {reportData.data.recommendations && reportData.data.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {reportData.data.recommendations.map((rec: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium capitalize">{rec.category}</span>
                            </div>
                            <p className="text-sm text-gray-700">{rec.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Semua Berjalan Lancar!</h3>
                    <p className="text-muted-foreground">
                      Tidak ada rekomendasi khusus untuk periode ini. Sistem berjalan dengan optimal.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
