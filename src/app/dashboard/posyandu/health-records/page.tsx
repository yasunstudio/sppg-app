"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, TableActions, StatusBadge } from "@/components/ui/data-table"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HealthRecord {
  id: string
  participant: {
    id: string
    name: string
    gender: string
    participantType: string
  }
  checkupDate: string
  weight: number
  height: number
  bmi: number
  nutritionalStatus: string
  bloodPressure?: string
  notes?: string
  createdAt: string
}

const columns: ColumnDef<HealthRecord>[] = [
  {
    id: "participantName",
    accessorKey: "participant.name",
    header: "Nama Peserta",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.participant.name}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.participant.participantType} • {row.original.participant.gender}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "checkupDate",
    header: "Tanggal Pemeriksaan",
    cell: ({ row }) => new Date(row.getValue("checkupDate")).toLocaleDateString("id-ID"),
  },
  {
    accessorKey: "weight",
    header: "Berat (kg)",
    cell: ({ row }) => `${row.getValue("weight")} kg`,
  },
  {
    accessorKey: "height",
    header: "Tinggi (cm)",
    cell: ({ row }) => `${row.getValue("height")} cm`,
  },
  {
    accessorKey: "bmi",
    header: "BMI",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{parseFloat(row.getValue("bmi")).toFixed(1)}</div>
      </div>
    ),
  },
  {
    accessorKey: "nutritionalStatus",
    header: "Status Nutrisi",
    cell: ({ row }) => {
      const status = row.getValue("nutritionalStatus") as string
      return <StatusBadge status={status} />
    },
  },
  {
    accessorKey: "bloodPressure",
    header: "Tekanan Darah",
    cell: ({ row }) => row.getValue("bloodPressure") || "-",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const healthRecord = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", healthRecord.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", healthRecord.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", healthRecord.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function HealthRecordsPage() {
  const [data, setData] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [summary, setSummary] = useState<any[]>([])

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/health-records?page=${page}&limit=${pageSize}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setPagination({
          page: result.pagination.page,
          pageSize: result.pagination.limit,
          total: result.pagination.total,
        })
        
        // Set summary from API response
        if (result.summary) {
          setSummary([
            {
              title: "Total Rekam Medis",
              value: result.summary.totalRecords,
              description: "Semua data rekam medis"
            },
            {
              title: "BMI Normal",
              value: result.summary.normalBMI,
              description: "Peserta dengan BMI normal"
            },
            {
              title: "Kelebihan Berat",
              value: result.summary.overweight,
              description: "Peserta dengan kelebihan berat badan"
            },
            {
              title: "Rata-rata BMI",
              value: result.summary.averageBMI?.toFixed(1) || "0",
              description: "BMI rata-rata semua peserta"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching health records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePageChange = (newPage: number) => {
    fetchData(newPage, pagination.pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    fetchData(1, newPageSize)
  }

  const handleCreateNew = () => {
    // Navigate to create new health record page
    console.log("Create new health record")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rekam Kesehatan</h1>
          <p className="text-muted-foreground">
            Kelola data rekam kesehatan peserta posyandu
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="participantName"
        searchPlaceholder="Cari berdasarkan nama peserta..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Rekam Kesehatan"
        loading={loading}
        summary={summary}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  )
}
