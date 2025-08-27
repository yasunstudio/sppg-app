'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, BarChart3, Factory, Truck, DollarSign, 
  CheckCircle, Users, Package, School, Clock, RefreshCw, Calendar,
  AlertTriangle, Target, Award, Zap
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalMealsProduced: number;
    totalMealsDelivered: number;
    totalRevenue: number;
    efficiency: number;
    qualityScore: number;
    schoolsSatisfaction: number;
  };
  trends: {
    productionTrend: Array<{ date: string; value: number; target: number }>;
    distributionTrend: Array<{ date: string; delivered: number; onTime: number }>;
    financialTrend: Array<{ date: string; revenue: number; costs: number; profit: number }>;
    qualityTrend: Array<{ date: string; score: number; checks: number }>;
  };
  distribution: {
    byRegion: Array<{ name: string; value: number; color: string }>;
    bySchoolType: Array<{ name: string; value: number; color: string }>;
    timeDistribution: Array<{ time: string; deliveries: number }>;
  };
  performance: {
    topSchools: Array<{ name: string; satisfaction: number; meals: number }>;
    topMenus: Array<{ name: string; popularity: number; orders: number }>;
    efficiency: Array<{ department: string; current: number; target: number }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app this would come from API
      const mockData: AnalyticsData = {
        overview: {
          totalMealsProduced: 125840,
          totalMealsDelivered: 122350,
          totalRevenue: 2547850000,
          efficiency: 92.5,
          qualityScore: 96.8,
          schoolsSatisfaction: 94.2,
        },
        trends: {
          productionTrend: [
            { date: '2025-08-20', value: 4200, target: 4000 },
            { date: '2025-08-21', value: 4150, target: 4000 },
            { date: '2025-08-22', value: 4300, target: 4000 },
            { date: '2025-08-23', value: 4100, target: 4000 },
            { date: '2025-08-24', value: 4250, target: 4000 },
            { date: '2025-08-25', value: 4400, target: 4000 },
            { date: '2025-08-26', value: 4350, target: 4000 },
          ],
          distributionTrend: [
            { date: '2025-08-20', delivered: 4180, onTime: 4050 },
            { date: '2025-08-21', delivered: 4120, onTime: 3980 },
            { date: '2025-08-22', delivered: 4280, onTime: 4200 },
            { date: '2025-08-23', delivered: 4080, onTime: 3950 },
            { date: '2025-08-24', delivered: 4230, onTime: 4100 },
            { date: '2025-08-25', delivered: 4380, onTime: 4250 },
            { date: '2025-08-26', delivered: 4320, onTime: 4180 },
          ],
          financialTrend: [
            { date: '2025-08-20', revenue: 85200000, costs: 68150000, profit: 17050000 },
            { date: '2025-08-21', revenue: 83800000, costs: 67100000, profit: 16700000 },
            { date: '2025-08-22', revenue: 87300000, costs: 69850000, profit: 17450000 },
            { date: '2025-08-23', revenue: 82900000, costs: 66300000, profit: 16600000 },
            { date: '2025-08-24', revenue: 86500000, costs: 69200000, profit: 17300000 },
            { date: '2025-08-25', revenue: 89200000, costs: 71350000, profit: 17850000 },
            { date: '2025-08-26', revenue: 88100000, costs: 70480000, profit: 17620000 },
          ],
          qualityTrend: [
            { date: '2025-08-20', score: 95.5, checks: 42 },
            { date: '2025-08-21', score: 96.2, checks: 38 },
            { date: '2025-08-22', score: 97.1, checks: 45 },
            { date: '2025-08-23', score: 94.8, checks: 40 },
            { date: '2025-08-24', score: 96.8, checks: 43 },
            { date: '2025-08-25', score: 98.2, checks: 47 },
            { date: '2025-08-26', score: 97.5, checks: 44 },
          ],
        },
        distribution: {
          byRegion: [
            { name: 'Jakarta Utara', value: 25, color: COLORS[0] },
            { name: 'Jakarta Selatan', value: 22, color: COLORS[1] },
            { name: 'Jakarta Timur', value: 20, color: COLORS[2] },
            { name: 'Jakarta Barat', value: 18, color: COLORS[3] },
            { name: 'Jakarta Pusat', value: 15, color: COLORS[4] },
          ],
          bySchoolType: [
            { name: 'SD Negeri', value: 45, color: COLORS[0] },
            { name: 'SD Swasta', value: 25, color: COLORS[1] },
            { name: 'SMP Negeri', value: 20, color: COLORS[2] },
            { name: 'SMP Swasta', value: 10, color: COLORS[3] },
          ],
          timeDistribution: [
            { time: '06:00', deliveries: 5 },
            { time: '07:00', deliveries: 25 },
            { time: '08:00', deliveries: 45 },
            { time: '09:00', deliveries: 65 },
            { time: '10:00', deliveries: 85 },
            { time: '11:00', deliveries: 95 },
            { time: '12:00', deliveries: 75 },
            { time: '13:00', deliveries: 35 },
            { time: '14:00', deliveries: 15 },
          ],
        },
        performance: {
          topSchools: [
            { name: 'SDN 01 Menteng', satisfaction: 98.5, meals: 1250 },
            { name: 'SD Al-Azhar 12', satisfaction: 97.8, meals: 980 },
            { name: 'SDN 05 Kemayoran', satisfaction: 97.2, meals: 1100 },
            { name: 'SD Bina Nusantara', satisfaction: 96.9, meals: 850 },
            { name: 'SDN 03 Cempaka Putih', satisfaction: 96.5, meals: 1050 },
          ],
          topMenus: [
            { name: 'Nasi Ayam Katsu', popularity: 95.2, orders: 2850 },
            { name: 'Nasi Rendang', popularity: 92.8, orders: 2650 },
            { name: 'Nasi Gudeg', popularity: 90.5, orders: 2400 },
            { name: 'Nasi Ikan Bakar', popularity: 88.7, orders: 2200 },
            { name: 'Nasi Bebek Goreng', popularity: 87.3, orders: 2100 },
          ],
          efficiency: [
            { department: 'Produksi', current: 92.5, target: 90 },
            { department: 'Distribusi', current: 88.3, target: 85 },
            { department: 'Kualitas', current: 96.8, target: 95 },
            { department: 'Keuangan', current: 94.1, target: 92 },
          ],
        },
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights dan performance metrics untuk sistem SPPG
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchAnalytics()}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produksi</CardTitle>
            <Factory className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalMealsProduced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">porsi diproduksi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribusi</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalMealsDelivered.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">porsi dikirim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(data.overview.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">total pendapatan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {data.overview.efficiency}%
            </div>
            <p className="text-xs text-muted-foreground">operational efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.overview.qualityScore}%
            </div>
            <p className="text-xs text-muted-foreground">quality score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.overview.schoolsSatisfaction}%
            </div>
            <p className="text-xs text-muted-foreground">school satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Production Trend</CardTitle>
                <CardDescription>Daily production vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends.productionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Performance</CardTitle>
                <CardDescription>Delivered vs on-time delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trends.distributionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="delivered" stackId="1" stroke="#8884d8" fill="#8884d8" name="Delivered" />
                    <Area type="monotone" dataKey="onTime" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="On Time" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Trend</CardTitle>
                <CardDescription>Revenue, costs, and profit over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.trends.financialTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                    <Bar dataKey="costs" fill="#8884d8" name="Costs" />
                    <Bar dataKey="profit" fill="#ffc658" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Trend</CardTitle>
                <CardDescription>Quality score and number of checks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends.qualityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="score" stroke="#8884d8" name="Quality Score %" />
                    <Line yAxisId="right" type="monotone" dataKey="checks" stroke="#82ca9d" name="Checks Count" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.distribution.byRegion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.distribution.byRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution by School Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.distribution.bySchoolType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.distribution.bySchoolType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.distribution.timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.topSchools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-sm text-muted-foreground">{school.meals} meals</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{school.satisfaction}%</div>
                        <Progress value={school.satisfaction} className="h-2 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.topMenus.map((menu, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{menu.name}</p>
                        <p className="text-sm text-muted-foreground">{menu.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{menu.popularity}%</div>
                        <Progress value={menu.popularity} className="h-2 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Department Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.efficiency.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{dept.department}</span>
                        <span>{dept.current}% / {dept.target}%</span>
                      </div>
                      <div className="flex gap-2">
                        <Progress value={dept.current} className="h-3 flex-1" />
                        <Badge variant={dept.current >= dept.target ? "default" : "secondary"}>
                          {dept.current >= dept.target ? "Target Met" : "Below Target"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Production Efficiency</p>
                    <p className="text-sm text-muted-foreground">Exceeded target by 2.5% this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Quality Score</p>
                    <p className="text-sm text-muted-foreground">Maintained 96%+ quality rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">School Satisfaction</p>
                    <p className="text-sm text-muted-foreground">94.2% average satisfaction rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Delivery Timing</p>
                    <p className="text-sm text-muted-foreground">12% of deliveries behind schedule</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Inventory Management</p>
                    <p className="text-sm text-muted-foreground">15% waste in raw materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <Target className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Cost Optimization</p>
                    <p className="text-sm text-muted-foreground">5% over budget in transportation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                <p className="font-medium">Optimize Delivery Routes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Implement AI-powered route optimization to reduce delivery time by estimated 15-20%
                </p>
              </div>
              <div className="p-4 border-l-4 border-l-green-500 bg-green-50">
                <p className="font-medium">Expand Popular Menu Items</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Increase production of top 3 popular menus based on demand analytics
                </p>
              </div>
              <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50">
                <p className="font-medium">Implement Predictive Maintenance</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule equipment maintenance based on usage patterns to prevent downtime
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
