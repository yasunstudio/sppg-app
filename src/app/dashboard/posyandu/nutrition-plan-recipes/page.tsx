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

interface NutritionPlanRecipe {
  id: string
  nutritionPlan: {
    id: string
    name: string
  }
  name: string
  description: string
  ingredients: string
  instructions: string
  portion: number
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  prepTime: number
  cookTime: number
  difficulty: string
  category: string
  allergens?: string
  notes?: string
  createdAt: string
}

const columns: ColumnDef<NutritionPlanRecipe>[] = [
  {
    accessorKey: "name",
    header: "Nama Resep",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "nutritionPlan.name",
    header: "Rencana Nutrisi",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.nutritionPlan.name}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      const categoryLabels: { [key: string]: string } = {
        MAIN_COURSE: "Makanan Utama",
        SNACK: "Camilan",
        DRINK: "Minuman",
        DESSERT: "Pencuci Mulut",
        SUPPLEMENT: "Suplemen"
      }
      return <StatusBadge status={categoryLabels[category] || category} />
    },
  },
  {
    accessorKey: "calories",
    header: "Nutrisi",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium">{row.getValue("calories")} kkal</div>
        <div className="text-muted-foreground">
          P: {row.original.protein}g | K: {row.original.carbohydrates}g | L: {row.original.fat}g
        </div>
      </div>
    ),
  },
  {
    accessorKey: "portion",
    header: "Porsi",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("portion")} porsi
      </div>
    ),
  },
  {
    accessorKey: "prepTime",
    header: "Waktu",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>Persiapan: {row.getValue("prepTime")} menit</div>
        <div className="text-muted-foreground">
          Memasak: {row.original.cookTime} menit
        </div>
      </div>
    ),
  },
  {
    accessorKey: "difficulty",
    header: "Tingkat Kesulitan",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string
      const difficultyLabels: { [key: string]: string } = {
        EASY: "Mudah",
        MEDIUM: "Sedang",
        HARD: "Sulit"
      }
      return (
        <Badge 
          variant={difficulty === "EASY" ? "secondary" : 
                   difficulty === "MEDIUM" ? "outline" : "destructive"}
        >
          {difficultyLabels[difficulty] || difficulty}
        </Badge>
      )
    },
  },
  {
    accessorKey: "allergens",
    header: "Alergen",
    cell: ({ row }) => {
      const allergens = row.getValue("allergens") as string
      return allergens ? (
        <div className="text-sm max-w-[120px] truncate" title={allergens}>
          {allergens}
        </div>
      ) : "-"
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const recipe = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", recipe.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", recipe.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Cook", recipe.id)}
          >
            Panduan Memasak
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Nutrition", recipe.id)}
          >
            Analisis Nutrisi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Print", recipe.id)}
          >
            Cetak Resep
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Duplicate", recipe.id)}
          >
            Duplikasi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", recipe.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function NutritionPlanRecipesPage() {
  const [data, setData] = useState<NutritionPlanRecipe[]>([])
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
      const response = await fetch(`/api/nutrition-plan-recipes?page=${page}&limit=${pageSize}`)
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
              title: "Total Resep",
              value: result.summary.totalRecipes,
              description: "Resep terdaftar"
            },
            {
              title: "Avg Kalori",
              value: Math.round(result.summary.averageCalories || 0),
              description: "Rata-rata kalori per porsi"
            },
            {
              title: "Resep Mudah",
              value: result.summary.difficultyDistribution?.easy || 0,
              description: "Resep tingkat mudah"
            },
            {
              title: "Makanan Utama",
              value: result.summary.categoryDistribution?.mainCourse || 0,
              description: "Resep makanan utama"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching nutrition plan recipes:", error)
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
    // Navigate to create new recipe page
    console.log("Create new nutrition plan recipe")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resep Rencana Nutrisi</h1>
          <p className="text-muted-foreground">
            Kelola resep makanan untuk rencana nutrisi
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Cari berdasarkan nama resep..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Resep"
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
