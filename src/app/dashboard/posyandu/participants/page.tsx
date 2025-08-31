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
import { 
  PARTICIPANT_TYPE, 
  GENDER, 
  NUTRITION_STATUS,
  type ParticipantType,
  type Gender,
  type NutritionStatus 
} from "@/lib/constants"
import { 
  getParticipantTypeLabel,
  getParticipantTypeColor,
  getGenderLabel,
  getNutritionStatusLabel,
  getNutritionStatusColor
} from "@/lib/constants/utils"

interface Participant {
  id: string
  name: string
  nik?: string
  dateOfBirth: string
  gender: Gender
  address: string
  phoneNumber?: string
  participantType: ParticipantType
  currentWeight?: number
  currentHeight?: number
  nutritionStatus?: NutritionStatus
  posyandu: {
    id: string
    name: string
    address: string
  }
  createdAt: string
}

const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.nik || "NIK tidak tersedia"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Tanggal Lahir",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth"))
      const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      return (
        <div>
          <div>{date.toLocaleDateString("id-ID")}</div>
          <div className="text-sm text-muted-foreground">{age} tahun</div>
        </div>
      )
    },
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => (
      <Badge variant="outline">
        {getGenderLabel(row.getValue("gender"))}
      </Badge>
    ),
  },
  {
    accessorKey: "participantType",
    header: "Tipe Peserta",
    cell: ({ row }) => {
      const type = row.getValue("participantType") as ParticipantType
      return (
        <Badge 
          variant="outline" 
          className={getParticipantTypeColor(type)}
        >
          {getParticipantTypeLabel(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "currentWeight",
    header: "Berat Badan",
    cell: ({ row }) => {
      const weight = row.getValue("currentWeight") as number
      return weight ? `${weight} kg` : "-"
    },
  },
  {
    accessorKey: "nutritionStatus",
    header: "Status Nutrisi",
    cell: ({ row }) => {
      const status = row.getValue("nutritionStatus") as NutritionStatus
      return status ? (
        <Badge 
          variant="outline" 
          className={getNutritionStatusColor(status)}
        >
          {getNutritionStatusLabel(status)}
        </Badge>
      ) : "-"
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
      const participant = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", participant.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", participant.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Health Records", participant.id)}
          >
            Rekam Kesehatan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", participant.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function ParticipantsPage() {
  const [data, setData] = useState<Participant[]>([])
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
      const response = await fetch(`/api/participants?page=${page}&limit=${pageSize}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setPagination({
          page: result.pagination.page,
          pageSize: result.pagination.limit,
          total: result.pagination.total,
        })
        
        // Calculate summary from data
        const totalParticipants = result.pagination.total
        const genderDistribution = result.data.reduce((acc: any, p: Participant) => {
          acc[p.gender] = (acc[p.gender] || 0) + 1
          return acc
        }, {})
        
        const typeDistribution = result.data.reduce((acc: any, p: Participant) => {
          acc[p.participantType] = (acc[p.participantType] || 0) + 1
          return acc
        }, {})

        setSummary([
          {
            title: "Total Peserta",
            value: totalParticipants,
            description: "Semua peserta terdaftar"
          },
          {
            title: "Laki-laki",
            value: genderDistribution.MALE || 0,
            description: "Peserta laki-laki"
          },
          {
            title: "Perempuan",
            value: genderDistribution.FEMALE || 0,
            description: "Peserta perempuan"
          },
          {
            title: "Ibu Hamil",
            value: typeDistribution.PREGNANT_WOMAN || 0,
            description: "Ibu hamil terdaftar"
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching participants:", error)
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
    // Navigate to create new participant page
    console.log("Create new participant")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Peserta</h1>
          <p className="text-muted-foreground">
            Kelola data peserta posyandu
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Cari berdasarkan nama peserta..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Peserta"
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
