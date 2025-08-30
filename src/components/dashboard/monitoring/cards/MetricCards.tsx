import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Truck, DollarSign, CheckCircle } from 'lucide-react';
import { MonitoringData } from '@/types/monitoring';
import { formatCurrency } from '@/lib/monitoring-utils';

interface MetricCardsProps {
  data: MonitoringData;
}

export function MetricCards({ data }: MetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Production */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produksi Aktif</CardTitle>
          <Factory className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.metrics.production.activeProduction}</div>
          <p className="text-xs text-muted-foreground">
            {data.metrics.production.completedBatches} batch selesai
          </p>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Efisiensi</p>
            <p className="text-sm font-medium">{data.metrics.production.avgEfficiency.toFixed(1)}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribusi</CardTitle>
          <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.metrics.distribution.inTransit}</div>
          <p className="text-xs text-muted-foreground">dalam perjalanan</p>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">On-time Rate</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {data.metrics.distribution.onTimeDeliveryRate}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Financial */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
          <DollarSign className={`h-4 w-4 ${data.metrics.financial.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.metrics.financial.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(data.metrics.financial.netIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Budget: {data.metrics.financial.budgetUtilization.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Quality */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.metrics.quality.passRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {data.metrics.quality.passedChecks}/{data.metrics.quality.totalChecks} checks
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
