// ===============================
// 29. AUDIT LOGS
// ===============================
import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedAuditLogs() {
  console.log('📋 Seeding audit logs...')

  // Get reference data
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  })

  if (users.length === 0) {
    console.log('⚠️  No users found. Please seed users first.')
    return
  }

  const auditLogs = [
    // System initialization logs
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'SYSTEM_INIT',
      entity: 'system',
      entityId: 'system-001',
      newValues: JSON.stringify({ 
        action: 'initialized', 
        version: '1.0.0',
        timestamp: '2025-08-01T00:00:00Z'
      }),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // User management logs
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'USER_CREATE',
      entity: 'users',
      entityId: users[1]?.id || 'user-001',
      newValues: JSON.stringify({ 
        action: 'created_user', 
        role: 'CHEF',
        name: 'Budi Santoso'
      }),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'USER_UPDATE',
      entity: 'users',
      entityId: users[2]?.id || 'user-002',
      oldValues: JSON.stringify({ role: 'STAFF' }),
      newValues: JSON.stringify({ 
        action: 'updated_profile', 
        field: 'role',
        old_value: 'STAFF',
        new_value: 'NUTRITIONIST'
      }),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // School management logs
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'SCHOOL_CREATE',
      entity: 'schools',
      entityId: 'school-001',
      newValues: JSON.stringify({ 
        action: 'registered_school', 
        name: 'SDN 1 Purwakarta',
        student_count: 450,
        address: 'Jl. Veteran No. 15'
      }),
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // Production logs
    {
      userId: users.find(u => u.email?.includes('chef') || u.email?.includes('production'))?.id || users[1].id,
      action: 'PRODUCTION_START',
      entity: 'production_batches',
      entityId: 'batch-001',
      newValues: JSON.stringify({ 
        action: 'started_production', 
        recipe: 'Nasi Ayam Goreng SPPG',
        quantity: 500,
        start_time: '2025-08-05T05:00:00Z'
      }),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    {
      userId: users.find(u => u.email?.includes('chef') || u.email?.includes('production'))?.id || users[1].id,
      action: 'PRODUCTION_COMPLETE',
      entity: 'production_batches',
      entityId: 'batch-001',
      oldValues: JSON.stringify({ status: 'IN_PROGRESS' }),
      newValues: JSON.stringify({ 
        action: 'completed_production', 
        recipe: 'Nasi Ayam Goreng SPPG',
        quantity_produced: 500,
        quality_status: 'PASS',
        completion_time: '2025-08-05T08:30:00Z'
      }),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // Quality control logs
    {
      userId: users.find(u => u.email?.includes('qc'))?.id || users[2].id,
      action: 'QUALITY_CHECK',
      entity: 'quality_checkpoints',
      entityId: 'qc-001',
      newValues: JSON.stringify({ 
        action: 'quality_inspection', 
        batch_id: 'batch-001',
        temperature: 67.5,
        taste_score: 4.5,
        appearance_score: 4.8,
        result: 'PASS'
      }),
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    {
      userId: users.find(u => u.email?.includes('qc'))?.id || users[2].id,
      action: 'QUALITY_FAIL',
      entity: 'quality_checkpoints',
      entityId: 'qc-002',
      newValues: JSON.stringify({ 
        action: 'quality_rejection', 
        batch_id: 'batch-002',
        temperature: 58.2,
        issue: 'Temperature below minimum standard',
        action_taken: 'Batch reheated and re-tested'
      }),
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // Distribution logs
    {
      userId: users.find(u => u.email?.includes('driver') || u.email?.includes('logistics'))?.id || users[3].id,
      action: 'DISTRIBUTION_START',
      entity: 'distributions',
      entityId: 'dist-001',
      newValues: JSON.stringify({ 
        action: 'started_delivery', 
        driver: 'Asep Suryadi',
        vehicle: 'B 1234 XYZ',
        route: 'Route A - 8 schools',
        departure_time: '2025-08-05T08:00:00Z'
      }),
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 Mobile App - Delivery Tracker'
    },

    {
      userId: users.find(u => u.email?.includes('driver') || u.email?.includes('logistics'))?.id || users[3].id,
      action: 'DELIVERY_COMPLETE',
      entity: 'deliveries',
      entityId: 'delivery-001',
      newValues: JSON.stringify({ 
        action: 'completed_delivery', 
        school: 'SDN 1 Purwakarta',
        portions_delivered: 450,
        delivery_time: '2025-08-05T09:15:00Z',
        recipient: 'Ibu Siti (Kepala Sekolah)',
        condition: 'Good - Hot and fresh'
      }),
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 Mobile App - Delivery Tracker'
    },

    // Financial logs
    {
      userId: users.find(u => u.email?.includes('finance'))?.id || users[4].id,
      action: 'TRANSACTION_CREATE',
      entity: 'financial_transactions',
      entityId: 'txn-001',
      newValues: JSON.stringify({ 
        action: 'recorded_expense', 
        category: 'RAW_MATERIALS',
        amount: 2500000,
        description: 'Pembelian beras premium 500kg',
        supplier: 'PT Beras Nusantara'
      }),
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    {
      userId: users.find(u => u.email?.includes('finance'))?.id || users[4].id,
      action: 'BUDGET_UPDATE',
      entity: 'budgets',
      entityId: 'budget-001',
      oldValues: JSON.stringify({ spent: 26000000, remaining: 24000000 }),
      newValues: JSON.stringify({ 
        action: 'updated_budget', 
        category: 'RAW_MATERIALS',
        allocated: 50000000,
        spent: 28500000,
        remaining: 21500000,
        utilization: '57%'
      }),
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    // System maintenance logs
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'SYSTEM_BACKUP',
      entity: 'system',
      entityId: 'backup-001',
      newValues: JSON.stringify({ 
        action: 'database_backup', 
        backup_type: 'automated_daily',
        backup_size: '2.5GB',
        completion_time: '2025-08-05T02:30:00Z',
        status: 'success'
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'System Automated Process'
    },

    // Security logs
    {
      userId: users.find(u => u.email?.includes('admin'))?.id || users[0].id,
      action: 'LOGIN_SUCCESS',
      entity: 'sessions',
      entityId: 'session-001',
      newValues: JSON.stringify({ 
        action: 'successful_login', 
        login_time: '2025-08-05T07:00:00Z',
        login_method: 'email_password',
        session_duration: '8 hours'
      }),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },

    {
      userId: users.find(u => u.email?.includes('production'))?.id || users[1].id,
      action: 'LOGIN_FAIL',
      entity: 'security_logs',
      entityId: 'security-001',
      newValues: JSON.stringify({ 
        action: 'failed_login_attempt', 
        attempt_time: '2025-08-05T06:45:00Z',
        failure_reason: 'incorrect_password',
        attempts_count: 2,
        account_status: 'active'
      }),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]

  for (const logData of auditLogs) {
    // Check if audit log already exists to avoid duplicates
    const existing = await prisma.auditLog.findFirst({
      where: {
        userId: logData.userId,
        action: logData.action,
        entityId: logData.entityId
      }
    })
    
    if (!existing) {
      await prisma.auditLog.create({
        data: logData
      })
    }
  }

  const auditCount = await prisma.auditLog.count()
  console.log(`✅ Audit logs seeded: ${auditCount} log entries`)
}
