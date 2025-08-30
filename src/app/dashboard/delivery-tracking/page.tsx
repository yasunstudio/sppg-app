'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Package
} from 'lucide-react';

interface Delivery {
  id: string;
  status: string;
  deliveryOrder: number;
  plannedTime: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  portionsDelivered: number | null;
  notes: string | null;
  distribution: {
    id: string;
    distributionDate: string;
    totalPortions: number;
    status: string;
  };
  school: {
    name: string;
    address: string;
    principalPhone: string;
  };
  driver: {
    name: string;
    phone: string;
    licenseNumber: string;
  } | null;
  vehicle: {
    plateNumber: string;
    type: string;
    capacity: number;
  } | null;
}

export default function DeliveryTrackingPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries');
      const data = await response.json();
      
      if (data.success) {
        setDeliveries(data.data);
      } else {
        setError(data.error || 'Failed to fetch deliveries');
      }
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_TRANSIT': return <Truck className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
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
            Delivery Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor real-time delivery status and track food distribution
          </p>
        </div>
        <Button onClick={fetchDeliveries}>
          Refresh Data
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">❌ {error}</p>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] as const).map((status) => {
          const count = deliveries.filter(d => d.status === status).length;
          return (
            <Card key={status} className="p-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status)}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(delivery.status)}>
                  {getStatusIcon(delivery.status)}
                  <span className="ml-1">{delivery.status}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Order #{delivery.deliveryOrder}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Distribution Date</p>
                <p className="font-medium">
                  {new Date(delivery.distribution.distributionDate).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* School Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Destination</span>
                </div>
                <div className="ml-6">
                  <p className="font-medium">{delivery.school.name}</p>
                  <p className="text-sm text-muted-foreground">{delivery.school.address}</p>
                  <p className="text-sm text-muted-foreground">📞 {delivery.school.principalPhone}</p>
                </div>
              </div>

              {/* Driver & Vehicle */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Driver & Vehicle</span>
                </div>
                <div className="ml-6">
                  <p className="font-medium">
                    {delivery.driver?.name || 'Not assigned'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {delivery.vehicle?.plateNumber} - {delivery.vehicle?.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📞 {delivery.driver?.phone || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Delivery Info</span>
                </div>
                <div className="ml-6">
                  <p className="text-sm">
                    <span className="font-medium">Portions:</span> {delivery.portionsDelivered || 0} / {delivery.distribution.totalPortions}
                  </p>
                  {delivery.plannedTime && (
                    <p className="text-sm">
                      <span className="font-medium">Planned:</span> {new Date(delivery.plannedTime).toLocaleString('id-ID')}
                    </p>
                  )}
                  {delivery.departureTime && (
                    <p className="text-sm">
                      <span className="font-medium">Departed:</span> {new Date(delivery.departureTime).toLocaleString('id-ID')}
                    </p>
                  )}
                  {delivery.arrivalTime && (
                    <p className="text-sm">
                      <span className="font-medium">Arrived:</span> {new Date(delivery.arrivalTime).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {delivery.notes && (
              <div className="mt-4 p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Notes:</span> {delivery.notes}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {deliveries.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Deliveries Found
          </h3>
          <p className="text-muted-foreground">
            No delivery records are currently available.
          </p>
        </Card>
      )}
    </div>
  );
}
