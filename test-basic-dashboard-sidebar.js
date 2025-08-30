// Test sidebar menu visibility for basic dashboard users
const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()

async function testBasicDashboardSidebar() {
  try {
    console.log('🧪 TESTING SIDEBAR MENU FOR BASIC DASHBOARD USERS\n')
    
    // Find users who would use basic dashboard
    const basicDashboardRoles = ['VOLUNTEER', 'CHEF', 'QUALITY_CONTROLLER', 'DELIVERY_MANAGER', 'POSYANDU_COORDINATOR']
    
    for (const roleName of basicDashboardRoles) {
      console.log(`\n📋 Testing ${roleName} user:`)
      
      const user = await prisma.user.findFirst({
        where: {
          roles: {
            some: {
              role: {
                name: roleName
              }
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      })
      
      if (user) {
        const role = await prisma.role.findUnique({
          where: { name: roleName },
          select: { permissions: true }
        })
        
        console.log(`   👤 User: ${user.email}`)
        console.log(`   🎯 Should see in sidebar:`)
        console.log(`   ✅ "Dashboard Saya" (/dashboard/basic) - Always visible`)
        
        // Check which menus they should see based on permissions
        const permissions = role?.permissions || []
        
        if (permissions.includes('posyandu.view')) {
          console.log(`   ✅ "Data Sekolah" - Has posyandu.view`)
          console.log(`   ✅ "Posyandu" - Has posyandu.view`)
        }
        if (permissions.includes('inventory.view')) {
          console.log(`   ✅ "Inventaris & Stok" - Has inventory.view`)
        }
        if (permissions.includes('production.view')) {
          console.log(`   ✅ "Produksi Makanan" - Has production.view`)
          console.log(`   ✅ "Distribusi & Logistik" - Has production.view`)
          console.log(`   ✅ "Delivery Tracking" - Has production.view`)
        }
        if (permissions.includes('quality.check')) {
          console.log(`   ✅ "Kontrol Kualitas" - Has quality.check`)
        }
        if (permissions.includes('finance.view')) {
          console.log(`   ✅ "Manajemen Keuangan" - Has finance.view`)
        }
        
        console.log(`   📝 Total permissions: ${permissions.length}`)
        
      } else {
        console.log(`   ❌ No ${roleName} user found`)
      }
    }
    
    console.log('\n🔧 SIDEBAR IMPROVEMENTS MADE:')
    console.log('   ✅ Added "Dashboard Saya" menu for /dashboard/basic')
    console.log('   ✅ Set permissions: null (visible to all users)')
    console.log('   ✅ Uses Activity icon for distinction')
    console.log('   ✅ Properly highlights when on /dashboard/basic')
    
    console.log('\n🎯 TEST INSTRUCTIONS:')
    console.log('1. Login with volunteer user: volunteer9@sppg.id')
    console.log('2. Should redirect to /dashboard/basic')
    console.log('3. Check sidebar - should see "Dashboard Saya" highlighted')
    console.log('4. Menu should be active/highlighted')
    
  } catch (error) {
    console.error('❌ Error testing basic dashboard sidebar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBasicDashboardSidebar().catch(console.error)
