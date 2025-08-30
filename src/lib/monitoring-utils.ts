// Utility functions for monitoring dashboard
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getQualityColor(passRate: number): string {
  if (passRate >= 95) return 'text-green-600 dark:text-green-400';
  if (passRate >= 85) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 90) return 'text-green-600 dark:text-green-400';
  if (efficiency >= 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getInventoryStatusColor(stockLevel: number): string {
  if (stockLevel >= 50) return 'text-green-600 dark:text-green-400';
  if (stockLevel >= 20) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getTrendIcon(trend: number): string {
  if (trend > 0) return '↗';
  if (trend < 0) return '↘';
  return '→';
}

export function getTrendColor(trend: number): string {
  if (trend > 0) return 'text-green-600 dark:text-green-400';
  if (trend < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
}
