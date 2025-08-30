'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface FinancialChartProps {
  data: {
    monthly: Array<{
      month: string
      income: number
      expenses: number
      profit: number
    }>
    categories: Array<{
      category: string
      amount: number
      percentage: number
    }>
  }
}

export default function FinancialChart({ data }: FinancialChartProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Financial Trends</CardTitle>
          <p className="text-sm text-muted-foreground">Monthly income, expenses, and profit analysis</p>
        </CardHeader>
        <CardContent>
          {data.monthly && data.monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000)}K`} />
                <Tooltip 
                  formatter={(value, name) => [
                    `Rp ${Number(value).toLocaleString()}`,
                    name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Profit'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="expenses"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="3"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-sm text-muted-foreground">No financial data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Expense Categories</CardTitle>
          <p className="text-sm text-muted-foreground">Breakdown of expenses by category</p>
        </CardHeader>
        <CardContent>
          {data.categories && data.categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.categories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000)}K`} />
                <Tooltip 
                  formatter={(value) => [`Rp ${Number(value).toLocaleString()}`, 'Amount']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-muted-foreground">No expense data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
