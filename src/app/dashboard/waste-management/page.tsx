'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  Recycle, 
  TrendingUp, 
  Weight,
  PieChart,
  Calendar,
  Building,
  Plus
} from 'lucide-react';

interface WasteRecord {
  id: string;
  recordDate: string;
  wasteType: string;
  source: string;
  weight: number;
  notes: string | null;
  school: {
    name: string;
    address: string;
  } | null;
}

interface WasteStats {
  total: number;
  totalWeight: number;
  byType: { [key: string]: { count: number; weight: number } };
  bySource: { [key: string]: { count: number; weight: number } };
  recent30Days: number;
}

export default function WasteManagementPage() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [stats, setStats] = useState<WasteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchWasteRecords();
  }, []);

  const fetchWasteRecords = async () => {
    try {
      const response = await fetch('/api/waste-records');
      const data = await response.json();
      
      if (data.success) {
        setWasteRecords(data.data);
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch waste records');
      }
    } catch (err) {
      setError('Failed to fetch waste records');
    } finally {
      setLoading(false);
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'ORGANIC': return 'bg-green-100 text-green-800';
      case 'INORGANIC': return 'bg-gray-100 text-gray-800';
      case 'PACKAGING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'PREPARATION': return 'bg-yellow-100 text-yellow-800';
      case 'PRODUCTION': return 'bg-orange-100 text-orange-800';
      case 'PACKAGING': return 'bg-blue-100 text-blue-800';
      case 'SCHOOL_LEFTOVER': return 'bg-red-100 text-red-800';
      case 'EXPIRED_MATERIAL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = wasteRecords.filter(record => 
    filter === '' || 
    record.school?.name.toLowerCase().includes(filter.toLowerCase()) ||
    record.wasteType.toLowerCase().includes(filter.toLowerCase()) ||
    record.source.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Waste Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage waste production across all facilities
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchWasteRecords} variant="outline">
            Refresh Data
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">❌ {error}</p>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Weight className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold">
                  {stats.totalWeight.toFixed(1)} kg
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent 30 Days</p>
                <p className="text-2xl font-bold">{stats.recent30Days}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Recycle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organic Waste</p>
                <p className="text-2xl font-bold">
                  {stats.byType.ORGANIC?.weight?.toFixed(1) || 0} kg
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Waste Type Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              By Waste Type
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, data]) => (
                <div key={type} className="flex justify-between items-center">
                  <Badge className={getWasteTypeColor(type)}>
                    {type}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{data.weight.toFixed(1)} kg</p>
                    <p className="text-sm text-gray-600">{data.count} records</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              By Source
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.bySource).map(([source, data]) => (
                <div key={source} className="flex justify-between items-center">
                  <Badge className={getSourceColor(source)}>
                    {source.replace('_', ' ')}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{data.weight.toFixed(1)} kg</p>
                    <p className="text-sm text-gray-600">{data.count} records</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Search Filter */}
      <Card className="p-4">
        <Input
          placeholder="Search waste records..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </Card>

      {/* Waste Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={getWasteTypeColor(record.wasteType)}>
                  {record.wasteType}
                </Badge>
                <Badge className={getSourceColor(record.source)}>
                  {record.source.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{record.weight} kg</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.recordDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Info */}
              {record.school && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Location
                  </h4>
                  <div>
                    <p className="font-medium">{record.school.name}</p>
                    <p className="text-sm text-muted-foreground">{record.school.address}</p>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Details
                </h4>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {new Date(record.recordDate).toLocaleDateString('id-ID')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Weight:</span> {record.weight} kg
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {record.wasteType}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Source:</span> {record.source.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {record.notes && (
              <div className="mt-4 p-3 bg-muted rounded">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {record.notes}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Trash2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Waste Records Found
          </h3>
          <p className="text-muted-foreground">
            {filter ? 'No waste records match your current filter.' : 'No waste records have been created yet.'}
          </p>
        </Card>
      )}
    </div>
  );
}
