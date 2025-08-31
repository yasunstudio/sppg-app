'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  Bell
} from 'lucide-react'

interface UserStats {
  todayTasks: number
  completedTasks: number
  upcomingEvents: number
  notifications: number
}

interface TaskItem {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  dueTime: string
  completed: boolean
}

interface EventItem {
  id: string
  title: string
  time: string
  type: 'meeting' | 'delivery' | 'inspection'
}

interface NotificationItem {
  id: string
  message: string
  type: 'info' | 'warning' | 'success'
  timestamp: string
  read: boolean
}

export default function BasicDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real-time dashboard data dari API yang baru
        const dashboardResponse = await fetch('/api/dashboard/basic')
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          
          if (dashboardData.success) {
            const { stats, tasks, events } = dashboardData.data
            
            setTasks(tasks || [])
            setEvents(events || [])
            setStats(stats || {
              todayTasks: 0,
              completedTasks: 0,
              upcomingEvents: 0,
              notifications: 0
            })
          }
        }

        // Fetch notifications untuk real-time updates
        const notificationsResponse = await fetch('/api/notifications')
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json()
          setNotifications(notificationsData.notifications || [])
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set fallback data
        setStats({
          todayTasks: 0,
          completedTasks: 0,
          upcomingEvents: 0,
          notifications: 0
        })
        setTasks([])
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    
    // Auto refresh setiap 5 menit untuk data real-time
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    )
    
    // Recalculate stats when task status changes
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    )
    const completedCount = updatedTasks.filter(task => task.completed).length
    
    setStats(prev => prev ? {
      ...prev,
      completedTasks: completedCount
    } : null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'production': return <Calendar className="h-4 w-4 text-green-600" />
      case 'delivery': return <TrendingUp className="h-4 w-4 text-orange-600" />
      case 'quality': return <CheckCircle className="h-4 w-4 text-red-600" />
      case 'financial': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'notification': return <Bell className="h-4 w-4 text-blue-600" />
      case 'meeting': return <Users className="h-4 w-4 text-blue-600" />
      case 'inspection': return <CheckCircle className="h-4 w-4 text-orange-600" />
      default: return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            My Tasks
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.todayTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.completedTasks} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Today's schedule
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.notifications}</div>
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? Math.round((stats.completedTasks / stats.todayTasks) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Task completion
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks and Events */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your latest task updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 h-4 w-4 border-2 rounded ${
                          task.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {task.completed && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.dueTime}
                          </span>
                          {(task as any).type && (
                            <Badge variant="secondary" className="text-xs">
                              {(task as any).type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Upcoming events and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </p>
                          {(event as any).location && (
                            <p className="text-xs text-muted-foreground">
                              📍 {(event as any).location}
                            </p>
                          )}
                          {(event as any).quantity && (
                            <p className="text-xs text-blue-600 font-medium">
                              {(event as any).quantity}
                            </p>
                          )}
                          {(event as any).checkpoint && (
                            <Badge variant="outline" className="text-xs">
                              {(event as any).checkpoint}
                            </Badge>
                          )}
                          {(event as any).amount && (
                            <p className="text-xs text-green-600 font-medium">
                              {(event as any).amount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className={`flex-shrink-0 p-1 rounded-full ${
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {notification.type === 'warning' ? 
                          <AlertCircle className="h-3 w-3 text-yellow-600" /> :
                          notification.type === 'success' ?
                          <CheckCircle className="h-3 w-3 text-green-600" /> :
                          <Bell className="h-3 w-3 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Manage your daily tasks and priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 h-5 w-5 border-2 rounded ${
                          task.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {task.completed && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.dueTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments and events for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 p-3 bg-muted rounded-lg">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
