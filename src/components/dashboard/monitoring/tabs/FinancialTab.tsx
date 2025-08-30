import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart, CreditCard, Wallet } from 'lucide-react';
import { MonitoringData } from '@/types/monitoring';
import { formatCurrency, formatPercentage } from '@/lib/monitoring-utils';

interface FinancialTabProps {
  data: MonitoringData;
}

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
}

export function FinancialTab({ data }: FinancialTabProps) {
  const { financial } = data.metrics;
  const details = data.detailedMetrics?.financial;
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialDetails = async () => {
      try {
        const response = await fetch('/api/financial/details');
        if (response.ok) {
          const data = await response.json();
          setRecentTransactions(data.recentTransactions || []);
          setBudgetBreakdown(data.budgetBreakdown || []);
        }
      } catch (error) {
        console.error('Failed to fetch financial details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialDetails();
  }, []);

  const profitMargin = financial.totalIncome > 0 
    ? ((financial.netIncome / financial.totalIncome) * 100) 
    : 0;

  const getTransactionColor = (type: string) => {
    return type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getBudgetStatusColor = (utilizationRate: number) => {
    if (utilizationRate > 90) return 'text-red-600 dark:text-red-400';
    if (utilizationRate > 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Main Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(financial.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Revenue generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(financial.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">Total costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            {financial.netIncome >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              financial.netIncome >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(Math.abs(financial.netIncome))}
            </div>
            <p className="text-xs text-muted-foreground">
              {financial.netIncome >= 0 ? 'Profit' : 'Loss'} this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <AlertCircle className={`h-4 w-4 ${
              financial.budgetUtilization > 90 
                ? 'text-red-600 dark:text-red-400'
                : financial.budgetUtilization > 75
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              financial.budgetUtilization > 90 
                ? 'text-red-600 dark:text-red-400'
                : financial.budgetUtilization > 75
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {formatPercentage(financial.budgetUtilization)}
            </div>
            <p className="text-xs text-muted-foreground">Of allocated budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analysis Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Budget Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current period budget allocation and usage
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded"></div>
                ))}
              </div>
            ) : budgetBreakdown.length > 0 ? (
              <div className="space-y-4">
                {budgetBreakdown.map((budget) => (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{budget.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                        </span>
                        <div className={`text-xs ${getBudgetStatusColor(budget.utilizationRate)}`}>
                          {formatPercentage(budget.utilizationRate)} used
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={budget.utilizationRate} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Raw Materials</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">
                        {formatCurrency(financial.totalExpenses * 0.65)} / {formatCurrency(financial.totalExpenses * 0.70)}
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        93% used
                      </div>
                    </div>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Labor Costs</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">
                        {formatCurrency(financial.totalExpenses * 0.20)} / {formatCurrency(financial.totalExpenses * 0.25)}
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        80% used
                      </div>
                    </div>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Operations</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">
                        {formatCurrency(financial.totalExpenses * 0.15)} / {formatCurrency(financial.totalExpenses * 0.20)}
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        75% used
                      </div>
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Recent Transactions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest financial transactions
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded"></div>
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium text-sm">{transaction.description}</h4>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <Badge variant={transaction.type === 'INCOME' ? 'default' : 'destructive'} className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium text-sm">Pembelian Beras Premium</h4>
                      <p className="text-xs text-muted-foreground">RAW_MATERIALS</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 dark:text-red-400">
                        -{formatCurrency(15000000)}
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        EXPENSE
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('id-ID')}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium text-sm">Subsidi Pemerintah</h4>
                      <p className="text-xs text-muted-foreground">GOVERNMENT_SUBSIDY</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        +{formatCurrency(25000000)}
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        INCOME
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(Date.now() - 86400000).toLocaleDateString('id-ID')}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium text-sm">Gaji Karyawan</h4>
                      <p className="text-xs text-muted-foreground">LABOR</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 dark:text-red-400">
                        -{formatCurrency(8000000)}
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        EXPENSE
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(Date.now() - 172800000).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            Financial Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Profit Margin</p>
              <p className={`text-2xl font-bold ${
                profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatPercentage(Math.abs(profitMargin))}
              </p>
              <p className="text-xs text-muted-foreground">
                {profitMargin >= 0 ? 'Healthy' : 'Needs attention'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Cash Flow</p>
              <p className={`text-2xl font-bold ${
                financial.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {financial.netIncome >= 0 ? '+' : '-'}{formatCurrency(Math.abs(financial.netIncome))}
              </p>
              <p className="text-xs text-muted-foreground">This period</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Budget Status</p>
              <p className={`text-2xl font-bold ${getBudgetStatusColor(financial.budgetUtilization)}`}>
                {formatPercentage(financial.budgetUtilization)}
              </p>
              <p className="text-xs text-muted-foreground">Budget utilized</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
