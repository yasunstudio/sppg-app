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

interface PosyanduActivity {
  id: string
  title: string
  description: string
  activityType: string
  date: string
  startTime: string
  endTime: string
  location: string
  targetParticipants: number
  actualParticipants: number
  status: string
  posyandu: {
    id: string
    name: string
  }
  organizer: string
  notes?: string
  createdAt: string
}

const columns: ColumnDef<PosyanduActivity>[] = [
  {
    accessorKey: "title",
    header: "Judul Kegiatan",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("title")}</div>
        <div className="text-sm text-muted-foreground max-w-[250px] truncate">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "activityType",
    header: "Jenis Kegiatan",
    cell: ({ row }) => {
      const type = row.getValue("activityType") as string
      const typeLabels: { [key: string]: string } = {
        HEALTH_CHECK: "Pemeriksaan Kesehatan",
        IMMUNIZATION: "Imunisasi",
        NUTRITION_EDUCATION: "Edukasi Gizi",
        GROWTH_MONITORING: "Monitoring Pertumbuhan",
        COUNSELING: "Konseling",
        COMMUNITY_MEETING: "Pertemuan Komunitas",
        TRAINING: "Pelatihan",
        OTHER: "Lainnya"
      }
      return <StatusBadge status={typeLabels[type] || type} />
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal & Waktu",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date")).toLocaleDateString("id-ID")
      return (
        <div className="text-sm">
          <div className="font-medium">{date}</div>
          <div className="text-muted-foreground">
            {row.original.startTime} - {row.original.endTime}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "targetParticipants",
    header: "Peserta",
    cell: ({ row }) => {
      const target = row.getValue("targetParticipants") as number
      const actual = row.original.actualParticipants
      const percentage = target > 0 ? Math.round((actual / target) * 100) : 0
      
      return (
        <div className="text-sm">
          <div className="font-medium">{actual}/{target}</div>
          <div className="text-muted-foreground">
            {percentage}% hadir
          </div>
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
        PLANNED: "Direncanakan",
        ONGOING: "Berlangsung",
        COMPLETED: "Selesai",
        CANCELLED: "Dibatalkan",
        POSTPONED: "Ditunda"
      }
      return (
        <Badge 
          variant={status === "COMPLETED" ? "default" : 
                   status === "ONGOING" ? "secondary" : 
                   status === "PLANNED" ? "outline" : 
                   status === "CANCELLED" ? "destructive" : "outline"}
        >
          {statusLabels[status] || status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => (
      <div className="text-sm max-w-[150px] truncate" title={row.getValue("location")}>
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "organizer",
    header: "Penyelenggara",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue("organizer")}
      </div>
    ),
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
      const activity = row.original

      return (
        <TableActions>
          <DropdownMenuItem
            onClick={() => console.log("View", activity.id)}
          >
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit", activity.id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Participants", activity.id)}
          >
            Daftar Peserta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Report", activity.id)}
          >
            Laporan Kegiatan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Duplicate", activity.id)}
          >
            Duplikasi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", activity.id)}
          >
            Hapus
          </DropdownMenuItem>
        </TableActions>
      )
    },
  },
]

export default function ActivitiesPage() {
  const [data, setData] = useState<PosyanduActivity[]>([])
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
      const response = await fetch(`/api/posyandu-activities?page=${page}&limit=${pageSize}`)
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
              title: "Total Kegiatan",
              value: result.summary.totalActivities,
              description: "Kegiatan terdaftar"
            },
            {
              title: "Kegiatan Selesai",
              value: result.summary.completedActivities,
              description: "Sudah terlaksana"
            },
            {
              title: "Kegiatan Aktif",
              value: result.summary.ongoingActivities,
              description: "Sedang berlangsung"
            },
            {
              title: "Total Peserta",
              value: result.summary.totalParticipants,
              description: "Peserta kegiatan"
            }
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
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
    // Navigate to create new activity page
    console.log("Create new activity")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aktivitas Posyandu</h1>
          <p className="text-muted-foreground">
            Kelola kegiatan dan aktivitas posyandu
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Cari berdasarkan judul kegiatan..."
        onCreateNew={handleCreateNew}
        onRefresh={() => fetchData(pagination.page, pagination.pageSize)}
        createNewLabel="Tambah Kegiatan"
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
