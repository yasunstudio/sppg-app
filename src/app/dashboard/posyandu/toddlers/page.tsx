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

interface Toddler {
  id: string
  nik: string
  name: string
  age: number
  gender: string
  parentName: string
  posyandu: {
    id: string
    name: string
    address: string
  }
  notes?: string
  developmentStage: string
  needsFrequentMonitoring: boolean
  ageGroup: string
  ageInMonths: number
  createdAt: string
}

const columns: ColumnDef<Toddler>[] = [
  {
    accessorKey: "name",
    header: "Nama Balita",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">
          Orang tua: {row.original.parentName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "age",
    header: "Usia",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("age")} bulan</div>
        <div className="text-sm text-muted-foreground">
          {row.original.ageGroup}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("gender") === "MALE" ? "Laki-laki" : "Perempuan"}
      </Badge>
    ),
  },
  {
    accessorKey: "developmentStage",
    header: "Tahap Perkembangan",
    cell: ({ row }) => {
      const stage = row.getValue("developmentStage") as string
      const stageLabels: { [key: string]: string } = {
        INFANT: "Bayi",
        EARLY_TODDLER: "Balita Awal",
        TODDLER: "Balita",
        PRESCHOOLER: "Prasekolah"
      }
      return <StatusBadge status={stageLabels[stage] || stage} />
    },
  },
  {
    accessorKey: "needsFrequentMonitoring",
    header: "Monitoring Intensif",
    cell: ({ row }) => {
      const needed = row.getValue("needsFrequentMonitoring") as boolean
      return (
        <Badge variant={needed ? "secondary" : "outline"}>
          {needed ? "Diperlukan" : "Rutin"}
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const toddler = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", toddler.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", toddler.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Growth Chart", toddler.id)}
          >
            Grafik Pertumbuhan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Immunization", toddler.id)}
          >
            Jadwal Imunisasi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", toddler.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function ToddlersPage() {
  const [data, setData] = useState<Toddler[]>([])
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
      const response = await fetch(`/api/toddlers?page=${page}&limit=${pageSize}`)
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
              title: "Total Balita",
              value: result.summary.totalToddlers,
              description: "Balita terdaftar"
            },
            {
              title: "Monitoring Intensif",
              value: result.summary.needingFrequentMonitoring,
              description: "Memerlukan monitoring intensif"
            },
            {
              title: "Laki-laki",
              value: result.summary.genderDistribution?.male || 0,
              description: "Balita laki-laki"
            },
            {
              title: "Perempuan",
              value: result.summary.genderDistribution?.female || 0,
              description: "Balita perempuan"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching toddlers:", error)
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
    // Navigate to create new toddler page
    console.log("Create new toddler")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Balita</h1>
          <p className="text-muted-foreground">
            Kelola data balita di posyandu
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Cari berdasarkan nama balita..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Balita"
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
