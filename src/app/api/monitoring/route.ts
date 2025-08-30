import { NextRequest, NextResponse } from 'next/server';

// GET /api/monitoring - Redirect to dashboard endpoint with proper structure
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    
    // Forward the request to the dashboard endpoint
    const dashboardUrl = new URL('/api/monitoring/dashboard', request.url);
    dashboardUrl.searchParams.set('period', period);
    
    const response = await fetch(dashboardUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Dashboard API error: ${response.statusText}`);
    }
    
    const dashboardData = await response.json();
    
    // Add missing fields to match MonitoringData interface
    const { startDate, endDate } = getDateRange(period);
    
    const monitoringData = {
      period,
      dateRange: {
        startDate: startDate.toLocaleDateString('id-ID'),
        endDate: endDate.toLocaleDateString('id-ID'),
      },
      ...dashboardData,
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json(monitoringData);
  } catch (error) {
    console.error('Error in monitoring API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

function getDateRange(period: string) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  return { startDate, endDate };
}
