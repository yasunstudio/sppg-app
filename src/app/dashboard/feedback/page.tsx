'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Filter
} from 'lucide-react';

interface Feedback {
  id: string;
  type: string;
  rating: number | null;
  message: string;
  source: string;
  status: string;
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  school: {
    name: string;
    address: string;
  } | null;
  student: {
    name: string;
    grade: string;
  } | null;
}

interface FeedbackStats {
  total: number;
  byType: { [key: string]: number };
  byRating: { [key: string]: number };
  averageRating: number;
}

export default function FeedbackManagementPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.data);
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED': return <CheckCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FOOD_QUALITY': return 'bg-blue-100 text-blue-800';
      case 'DELIVERY_SERVICE': return 'bg-green-100 text-green-800';
      case 'PORTION_SIZE': return 'bg-purple-100 text-purple-800';
      case 'VARIETY': return 'bg-orange-100 text-orange-800';
      case 'GENERAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating}/5)</span>
      </div>
    );
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesFilter = filter === '' || 
      item.message.toLowerCase().includes(filter.toLowerCase()) ||
      item.school?.name.toLowerCase().includes(filter.toLowerCase());
    
    const matchesType = selectedType === '' || item.type === selectedType;
    
    return matchesFilter && matchesType;
  });

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
            Feedback Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and respond to feedback from schools and students
          </p>
        </div>
        <Button onClick={fetchFeedback}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
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
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold">
                  {feedback.filter(f => f.status === 'OPEN').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">
                  {feedback.filter(f => f.status === 'RESOLVED').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search feedback..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="FOOD_QUALITY">Food Quality</option>
            <option value="DELIVERY_SERVICE">Delivery Service</option>
            <option value="PORTION_SIZE">Portion Size</option>
            <option value="VARIETY">Menu Variety</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(item.status)}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status}</span>
                </Badge>
                <Badge className={getTypeColor(item.type)}>
                  {item.type.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-gray-600">
                  {item.source}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </p>
                {renderStars(item.rating)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* School/Student Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">From</h4>
                {item.school && (
                  <div>
                    <p className="font-medium">{item.school.name}</p>
                    <p className="text-sm text-muted-foreground">{item.school.address}</p>
                  </div>
                )}
                {item.student && (
                  <div>
                    <p className="font-medium">{item.student.name}</p>
                    <p className="text-sm text-muted-foreground">Grade: {item.student.grade}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="md:col-span-2 space-y-2">
                <h4 className="font-medium">Message</h4>
                <p className="text-muted-foreground leading-relaxed">{item.message}</p>
                
                {item.response && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Response</h5>
                    <p className="text-blue-800">{item.response}</p>
                    {item.respondedAt && (
                      <p className="text-xs text-blue-600 mt-2">
                        Responded on {new Date(item.respondedAt).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {!item.response && item.status !== 'RESOLVED' && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Respond
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredFeedback.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Feedback Found
          </h3>
          <p className="text-muted-foreground">
            {filter || selectedType ? 'No feedback matches your current filters.' : 'No feedback has been submitted yet.'}
          </p>
        </Card>
      )}
    </div>
  );
}
