'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface ProductionChartProps {
  data: {
    daily: Array<{
      date: string
      production: number
      efficiency: number
    }>
    equipment: Array<{
      name: string
      utilization: number
    }>
  }
}

export default function ProductionChart({ data }: ProductionChartProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Production Trends</CardTitle>
          <p className="text-sm text-muted-foreground">Daily production output and efficiency trends</p>
        </CardHeader>
        <CardContent>
          {data.daily && data.daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12} 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  formatter={(value, name) => [
                    name === 'production' ? `${value} units` : `${value}%`,
                    name === 'production' ? 'Production' : 'Efficiency'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="production"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="efficiency"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm text-muted-foreground">No production data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Equipment Utilization</CardTitle>
          <p className="text-sm text-muted-foreground">Current equipment usage across production lines</p>
        </CardHeader>
        <CardContent>
          {data.equipment && data.equipment.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.equipment} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} fontSize={12} />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Bar 
                  dataKey="utilization" 
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">🏭</div>
                <p className="text-sm text-muted-foreground">No equipment data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
