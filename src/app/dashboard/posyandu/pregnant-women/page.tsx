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

interface PregnantWoman {
  id: string
  nik: string
  name: string
  age: number
  posyandu: {
    id: string
    name: string
    address: string
  }
  notes?: string
  ageGroup: string
  riskCategory: string
  createdAt: string
}

const columns: ColumnDef<PregnantWoman>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">
          NIK: {row.original.nik}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "age",
    header: "Usia",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("age")} tahun</div>
        <div className="text-sm text-muted-foreground">
          {row.original.ageGroup}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "riskCategory",
    header: "Kategori Risiko",
    cell: ({ row }) => {
      const risk = row.getValue("riskCategory") as string
      const variant = risk === "HIGH_RISK" ? "destructive" : "default"
      return (
        <Badge variant={variant}>
          {risk === "HIGH_RISK" ? "Risiko Tinggi" : "Risiko Normal"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "posyandu.name",
    header: "Posyandu",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.posyandu.name}
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Catatan",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return notes ? (
        <div className="text-sm max-w-[200px] truncate" title={notes}>
          {notes}
        </div>
      ) : "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Terdaftar",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString("id-ID"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const pregnantWoman = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", pregnantWoman.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", pregnantWoman.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Health Check", pregnantWoman.id)}
          >
            Pemeriksaan Kesehatan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", pregnantWoman.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function PregnantWomenPage() {
  const [data, setData] = useState<PregnantWoman[]>([])
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
      const response = await fetch(`/api/pregnant-women?page=${page}&limit=${pageSize}`)
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
              title: "Total Ibu Hamil",
              value: result.summary.totalWomen,
              description: "Ibu hamil terdaftar"
            },
            {
              title: "Risiko Tinggi",
              value: result.summary.highRisk,
              description: "Memerlukan perhatian khusus"
            },
            {
              title: "Usia Rata-rata",
              value: `${result.summary.averageAge} tahun`,
              description: "Rata-rata usia ibu hamil"
            },
            {
              title: "Usia > 35 Tahun",
              value: result.summary.ageDistribution?.over35 || 0,
              description: "Ibu hamil usia diatas 35 tahun"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching pregnant women:", error)
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
    // Navigate to create new pregnant woman page
    console.log("Create new pregnant woman")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Ibu Hamil</h1>
          <p className="text-muted-foreground">
            Kelola data ibu hamil di posyandu
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Cari berdasarkan nama..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Ibu Hamil"
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
