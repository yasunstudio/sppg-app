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

interface NutritionPlan {
  id: string
  name: string
  description: string
  targetGroup: string
  status: string
  targetCalories: number
  targetProtein: number
  startDate: string
  endDate: string
  posyandu: {
    id: string
    name: string
  }
  recipes: Array<{
    id: string
    name: string
    portion: number
    calories: number
    protein: number
    carbohydrates: number
    fat: number
  }>
  createdAt: string
}

const columns: ColumnDef<NutritionPlan>[] = [
  {
    accessorKey: "name",
    header: "Nama Rencana",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground max-w-[300px] truncate">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "targetGroup",
    header: "Target Kelompok",
    cell: ({ row }) => {
      const group = row.getValue("targetGroup") as string
      const groupLabels: { [key: string]: string } = {
        PREGNANT: "Ibu Hamil",
        LACTATING: "Ibu Menyusui",
        TODDLER: "Balita",
        ELDERLY: "Lansia",
        GENERAL: "Umum"
      }
      return <StatusBadge status={groupLabels[group] || group} />
    },
  },
  {
    accessorKey: "targetCalories",
    header: "Target Nutrisi",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium">{row.getValue("targetCalories")} kkal</div>
        <div className="text-muted-foreground">
          {row.original.targetProtein}g protein
        </div>
      </div>
    ),
  },
  {
    accessorKey: "recipes",
    header: "Resep",
    cell: ({ row }) => {
      const recipes = row.getValue("recipes") as Array<any>
      return (
        <div className="text-sm">
          <div className="font-medium">{recipes.length} resep</div>
          {recipes.length > 0 && (
            <div className="text-muted-foreground truncate max-w-[150px]">
              {recipes[0].name}
              {recipes.length > 1 && ` +${recipes.length - 1} lainnya`}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusLabels: { [key: string]: string } = {
        ACTIVE: "Aktif",
        DRAFT: "Draft",
        COMPLETED: "Selesai",
        SUSPENDED: "Ditangguhkan"
      }
      return (
        <Badge 
          variant={status === "ACTIVE" ? "default" : 
                   status === "COMPLETED" ? "secondary" : 
                   status === "DRAFT" ? "outline" : "destructive"}
        >
          {statusLabels[status] || status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: "Periode",
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("startDate")).toLocaleDateString("id-ID")
      const endDate = new Date(row.original.endDate).toLocaleDateString("id-ID")
      return (
        <div className="text-sm">
          <div>{startDate}</div>
          <div className="text-muted-foreground">s/d {endDate}</div>
        </div>
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const plan = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", plan.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", plan.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Recipes", plan.id)}
          >
            Kelola Resep
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Duplicate", plan.id)}
          >
            Duplikasi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Export", plan.id)}
          >
            Export
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", plan.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function NutritionPlansPage() {
  const [data, setData] = useState<NutritionPlan[]>([])
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
      const response = await fetch(`/api/nutrition-plans?page=${page}&limit=${pageSize}`)
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
              title: "Total Rencana",
              value: result.summary.totalPlans,
              description: "Rencana nutrisi terdaftar"
            },
            {
              title: "Rencana Aktif",
              value: result.summary.activePlans,
              description: "Sedang berjalan"
            },
            {
              title: "Total Resep",
              value: result.summary.totalRecipes,
              description: "Resep tersedia"
            },
            {
              title: "Avg Kalori",
              value: Math.round(result.summary.averageCalories || 0),
              description: "Rata-rata target kalori"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching nutrition plans:", error)
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
    // Navigate to create new nutrition plan page
    console.log("Create new nutrition plan")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rencana Nutrisi</h1>
          <p className="text-muted-foreground">
            Kelola rencana nutrisi untuk berbagai kelompok target
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Cari berdasarkan nama rencana..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Rencana Nutrisi"
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
