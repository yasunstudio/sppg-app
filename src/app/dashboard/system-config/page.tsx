'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  Edit, 
  Database,
  Globe,
  Bell,
  DollarSign,
  Shield,
  Wrench,
  RefreshCw
} from 'lucide-react';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string | null;
  dataType: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedConfigs {
  [category: string]: SystemConfig[];
}

export default function SystemConfigurationPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [groupedConfigs, setGroupedConfigs] = useState<GroupedConfigs>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/system-config');
      const data = await response.json();
      
      if (data.success) {
        setConfigs(data.data);
        setGroupedConfigs(data.grouped);
      } else {
        setError(data.error || 'Failed to fetch system configurations');
      }
    } catch (err) {
      setError('Failed to fetch system configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig(config.id);
    setEditValue(config.value);
    setEditDescription(config.description || '');
  };

  const handleSave = async (configId: string) => {
    try {
      const response = await fetch('/api/system-config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: configId,
          value: editValue,
          description: editDescription
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEditingConfig(null);
        fetchConfigs(); // Refresh data
      } else {
        setError(data.error || 'Failed to update configuration');
      }
    } catch (err) {
      setError('Failed to update configuration');
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setEditValue('');
    setEditDescription('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'app': return <Globe className="w-5 h-5" />;
      case 'notification': return <Bell className="w-5 h-5" />;
      case 'production': return <Wrench className="w-5 h-5" />;
      case 'quality': return <Shield className="w-5 h-5" />;
      case 'distribution': return <RefreshCw className="w-5 h-5" />;
      case 'financial': return <DollarSign className="w-5 h-5" />;
      case 'backup': return <Database className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'app': return 'bg-blue-100 text-blue-800';
      case 'notification': return 'bg-yellow-100 text-yellow-800';
      case 'production': return 'bg-green-100 text-green-800';
      case 'quality': return 'bg-red-100 text-red-800';
      case 'distribution': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-orange-100 text-orange-800';
      case 'backup': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage application settings and system parameters
          </p>
        </div>
        <Button onClick={fetchConfigs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">❌ {error}</p>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Configurations</p>
              <p className="text-2xl font-bold">{configs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">
                {Object.keys(groupedConfigs).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data Types</p>
              <p className="text-2xl font-bold">
                {new Set(configs.map(c => c.dataType)).size}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm font-bold">
                {configs.length > 0 
                  ? new Date(Math.max(...configs.map(c => new Date(c.updatedAt).getTime()))).toLocaleDateString('id-ID')
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Groups */}
      <div className="space-y-6">
        {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
          <Card key={category} className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              {getCategoryIcon(category)}
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {category} Configuration
              </h2>
              <Badge className={getCategoryColor(category)}>
                {categoryConfigs.length} settings
              </Badge>
            </div>

            <div className="space-y-4">
              {categoryConfigs.map((config) => (
                <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{config.key}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {config.description || 'No description available'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{config.dataType}</Badge>
                      {editingConfig !== config.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(config)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {editingConfig === config.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Enter configuration value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Enter description"
                          rows={2}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(config.id)}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted rounded p-3">
                      <p className="font-mono text-sm">
                        {config.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(config.updatedAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {configs.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Configurations Found
          </h3>
          <p className="text-muted-foreground">
            No system configurations have been set up yet.
          </p>
        </Card>
      )}
    </div>
  );
}
