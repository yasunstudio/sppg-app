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

interface LactatingMother {
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
  nutritionalRisk: string
  supportNeeded: boolean
  createdAt: string
}

const columns: ColumnDef<LactatingMother>[] = [
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
    accessorKey: "nutritionalRisk",
    header: "Risiko Nutrisi",
    cell: ({ row }) => {
      const risk = row.getValue("nutritionalRisk") as string
      const variant = risk === "HIGH" ? "destructive" : "default"
      return (
        <Badge variant={variant}>
          {risk === "HIGH" ? "Risiko Tinggi" : "Normal"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "supportNeeded",
    header: "Dukungan Khusus",
    cell: ({ row }) => {
      const needed = row.getValue("supportNeeded") as boolean
      return (
        <Badge variant={needed ? "secondary" : "outline"}>
          {needed ? "Diperlukan" : "Tidak Diperlukan"}
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
      const lactatingMother = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", lactatingMother.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", lactatingMother.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Nutrition Plan", lactatingMother.id)}
          >
            Rencana Nutrisi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", lactatingMother.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function LactatingMothersPage() {
  const [data, setData] = useState<LactatingMother[]>([])
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
      const response = await fetch(`/api/lactating-mothers?page=${page}&limit=${pageSize}`)
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
              title: "Total Ibu Menyusui",
              value: result.summary.totalMothers,
              description: "Ibu menyusui terdaftar"
            },
            {
              title: "Perlu Dukungan",
              value: result.summary.needingSupport,
              description: "Memerlukan dukungan khusus"
            },
            {
              title: "Risiko Nutrisi Tinggi",
              value: result.summary.highNutritionalRisk,
              description: "Risiko nutrisi tinggi"
            },
            {
              title: "Usia Rata-rata",
              value: `${result.summary.averageAge} tahun`,
              description: "Rata-rata usia ibu menyusui"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching lactating mothers:", error)
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
    // Navigate to create new lactating mother page
    console.log("Create new lactating mother")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Ibu Menyusui</h1>
          <p className="text-muted-foreground">
            Kelola data ibu menyusui di posyandu
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
        createNewLabel="Tambah Ibu Menyusui"
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
