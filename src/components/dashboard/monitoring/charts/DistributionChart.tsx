'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface DistributionChartProps {
  data: {
    delivery: Array<{
      status: string
      count: number
      color: string
    }>
    routes: Array<{
      route: string
      efficiency: number
      deliveries: number
    }>
  }
}

export default function DistributionChart({ data }: DistributionChartProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Delivery Status</CardTitle>
          <p className="text-sm text-muted-foreground">Current distribution and delivery status breakdown</p>
        </CardHeader>
        <CardContent>
          {data.delivery && data.delivery.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.delivery}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.delivery.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <p className="text-sm text-muted-foreground">No delivery data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Route Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Efficiency and delivery count by route</p>
        </CardHeader>
        <CardContent>
          {data.routes && data.routes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.routes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'efficiency' ? `${value}%` : `${value} deliveries`,
                    name === 'efficiency' ? 'Efficiency' : 'Deliveries'
                  ]}
                />
                <Bar dataKey="efficiency" fill="#f59e0b" radius={[4, 4, 0, 0]} name="efficiency" />
                <Bar dataKey="deliveries" fill="#06b6d4" radius={[4, 4, 0, 0]} name="deliveries" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <p className="text-sm text-muted-foreground">No route data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
