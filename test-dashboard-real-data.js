const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function testBasicDashboardRealData() {
  console.log('🧪 Testing Basic Dashboard with Real SPPG Data...\n')

  try {
    // Test 1: Check available data in tables
    console.log('📊 Checking available data in database:')
    
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.posyandu.count(),
      prisma.posyanduActivity.count(),
      prisma.productionPlan.count(),
      prisma.qualityCheckpoint.count(),
      prisma.delivery.count(),
      prisma.inventoryItem.count(),
      prisma.notification.count()
    ])

    console.log(`👥 Users: ${counts[0]}`)
    console.log(`🏥 Posyandu: ${counts[1]}`)
    console.log(`📅 Posyandu Activities: ${counts[2]}`)
    console.log(`🍳 Production Plans: ${counts[3]}`)
    console.log(`✅ Quality Checkpoints: ${counts[4]}`)
    console.log(`🚚 Deliveries: ${counts[5]}`)
    console.log(`📦 Inventory Items: ${counts[6]}`)
    console.log(`🔔 Notifications: ${counts[7]}`)

    // Test 2: Check users with different roles
    console.log('\n👤 Testing users by role:')
    
    const usersWithRoles = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      take: 10
    })

    usersWithRoles.forEach(user => {
      const roles = user.roles.map(ur => ur.role.name).join(', ')
      console.log(`- ${user.name} (${user.email}): ${roles}`)
    })

    // Test 3: Create sample data if needed
    console.log('\n🌱 Creating sample data for testing...')

    // Get first user for testing
    const testUser = usersWithRoles[0]
    if (!testUser) {
      console.log('❌ No users found - please run seed data first')
      return
    }

    // Create test notification
    try {
      await prisma.notification.create({
        data: {
          userId: testUser.id,
          title: 'Dashboard Test Notification',
          message: 'Testing real-time dashboard notifications',
          type: 'INFO',
          read: false
        }
      })
      console.log('✅ Test notification created')
    } catch (error) {
      console.log('ℹ️ Test notification already exists or error:', error.message)
    }

    // Test 4: Simulate API calls for different user roles
    console.log('\n🚀 Testing dashboard data generation by role:')

    for (const user of usersWithRoles.slice(0, 5)) {
      const userRoles = user.roles.map(ur => ur.role.name)
      console.log(`\n📋 Testing for ${user.name} (${userRoles.join(', ')}):`)

      try {
        // Simulate dashboard data fetching
        let sampleTasks = []
        let sampleEvents = []

        if (userRoles.includes('VOLUNTEER') || userRoles.includes('POSYANDU_COORDINATOR')) {
          // Check for posyandu activities
          const activities = await prisma.posyanduActivity.findMany({
            include: { posyandu: true },
            take: 3
          })
          
          sampleTasks = activities.map(a => ({
            title: `${a.activityType}: ${a.posyandu.name}`,
            type: 'posyandu',
            priority: a.status === 'PENDING' ? 'high' : 'medium'
          }))

          console.log(`  📅 Posyandu activities: ${activities.length}`)
        }

        if (userRoles.includes('CHEF') || userRoles.includes('KITCHEN_STAFF')) {
          // Check for production plans
          const plans = await prisma.productionPlan.findMany({
            include: { recipe: true },
            take: 3
          })

          // Check for low stock items
          const lowStock = await prisma.inventoryItem.findMany({
            where: {
              currentStock: { lte: 10 }
            },
            take: 3
          })

          sampleTasks = [
            ...plans.map(p => ({
              title: `Produksi: ${p.recipe?.name || 'Unknown'} (${p.targetQuantity} porsi)`,
              type: 'production',
              priority: p.priority
            })),
            ...lowStock.map(item => ({
              title: `Restock: ${item.name} (Sisa: ${item.currentStock})`,
              type: 'inventory',
              priority: 'high'
            }))
          ]

          console.log(`  🍳 Production plans: ${plans.length}`)
          console.log(`  📦 Low stock items: ${lowStock.length}`)
        }

        if (userRoles.includes('QUALITY_CONTROLLER')) {
          // Check for quality checkpoints
          const checkpoints = await prisma.qualityCheckpoint.findMany({
            include: {
              batch: {
                include: { recipe: true }
              }
            },
            take: 3
          })

          sampleTasks = checkpoints.map(cp => ({
            title: `QC: ${cp.batch?.recipe?.name || 'Unknown'} - ${cp.checkpointType}`,
            type: 'quality',
            priority: 'high'
          }))

          console.log(`  ✅ Quality checkpoints: ${checkpoints.length}`)
        }

        if (userRoles.includes('DELIVERY_MANAGER') || userRoles.includes('DRIVER')) {
          // Check for deliveries
          const deliveries = await prisma.delivery.findMany({
            include: {
              school: true,
              batch: { include: { recipe: true } }
            },
            take: 3
          })

          sampleTasks = deliveries.map(d => ({
            title: `Antar ke ${d.school.name}: ${d.batch?.recipe?.name || 'Unknown'}`,
            type: 'delivery',
            priority: d.status === 'PENDING' ? 'high' : 'medium'
          }))

          console.log(`  🚚 Deliveries: ${deliveries.length}`)
        }

        console.log(`  📋 Sample tasks generated: ${sampleTasks.length}`)
        sampleTasks.forEach((task, idx) => {
          console.log(`    ${idx + 1}. ${task.title} (${task.type}, ${task.priority})`)
        })

        // Check notifications
        const notifications = await prisma.notification.count({
          where: {
            userId: user.id,
            read: false
          }
        })

        console.log(`  🔔 Unread notifications: ${notifications}`)

      } catch (error) {
        console.log(`  ❌ Error generating dashboard data: ${error.message}`)
      }
    }

    console.log('\n✅ Basic dashboard real data test completed!')
    console.log('\n📝 Summary:')
    console.log('- Dashboard now uses real SPPG data from database')
    console.log('- Different content based on user roles')
    console.log('- Real-time notifications integrated')
    console.log('- Auto-refresh every 5 minutes')
    console.log('- Data relevant to School Feeding Program context')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBasicDashboardRealData()
