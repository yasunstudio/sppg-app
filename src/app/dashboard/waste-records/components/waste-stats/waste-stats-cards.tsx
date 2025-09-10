import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Weight, TrendingUp, Building } from 'lucide-react'
import type { WasteStats } from '../utils'

interface WasteStatsCardsProps {
  stats: WasteStats | null
  showStats: boolean
  onToggleStats: () => void
}

export function WasteStatsCards({ stats, showStats, onToggleStats }: WasteStatsCardsProps) {
  if (!stats) return null

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStats}
        >
          {showStats ? 'Sembunyikan' : 'Tampilkan'} Statistik
        </Button>
      </div>

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Catatan</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Entri pelacakan limbah
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Berat</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWeight.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground">
                Berat limbah kumulatif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent30Days}</div>
              <p className="text-xs text-muted-foreground">
                Catatan 30 hari terakhir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total > 0 ? (stats.totalWeight / stats.total).toFixed(1) : '0'} kg
              </div>
              <p className="text-xs text-muted-foreground">
                Per catatan limbah
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
