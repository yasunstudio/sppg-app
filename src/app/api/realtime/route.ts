// ============================================================================
// REALTIME API ROUTE (src/app/api/realtime/route.ts)
// Enhanced with Database-Driven Permission System
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { permissionEngine } from '@/lib/permissions/core/permission-engine'

// GET: Server-Sent Events for realtime updates
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'dashboard.view')

    if (!hasPermission) {
      return new Response('Forbidden', { status: 403 });
    }

    const { searchParams } = new URL(request.url)
    const channel = searchParams.get('channel') || 'general'

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        
        const sendEvent = (data: any) => {
          const event = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(event));
        };

        // Send initial connection event
        sendEvent({
          type: 'connection',
          data: {
            userId: session.user.id,
            channel,
            timestamp: new Date().toISOString(),
            message: 'Connected to realtime stream'
          }
        });

        // Send periodic heartbeat (every 30 seconds)
        const heartbeatInterval = setInterval(() => {
          sendEvent({
            type: 'heartbeat',
            data: {
              timestamp: new Date().toISOString()
            }
          });
        }, 30000);

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    });

  } catch (error) {
    console.error('WebSocket error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// POST: Send realtime events
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission to send realtime events
    const hasPermission = await permissionEngine.hasPermission(session.user.id, 'system.config')

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { type, channel, data, targets } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Event type and data are required' },
        { status: 400 }
      )
    }

    // Here you would implement your realtime event broadcasting logic
    // For example, using WebSockets, Server-Sent Events, or a message queue

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      channel: channel || 'general',
      data,
      targets: targets || ['all'],
      timestamp: new Date().toISOString(),
      sender: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    }

    // In a real implementation, you would broadcast this event
    // to connected clients via WebSocket/SSE
    console.log('Broadcasting realtime event:', event)

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event broadcasted successfully'
    })

  } catch (error) {
    console.error('Error in POST /api/realtime:', error)
    return NextResponse.json(
      { error: 'Failed to send realtime event' },
      { status: 500 }
    )
  }
}
