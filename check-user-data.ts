/**
 * Script untuk verifikasi data user dan role di database
 */

import { prisma } from '@/lib/prisma'

async function checkUserData() {
  console.log('🔍 CHECKING Database User Data\n')
  
  try {
    // Get all users with their roles
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 10 // Limit to first 10 users
    })
    
    console.log(`Found ${users.length} users:\n`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Roles: ${user.roles.map(ur => ur.role.name).join(', ')}`)
      console.log(`   Roles structure:`, JSON.stringify(user.roles, null, 2))
      console.log()
    })
    
    // Check specific financial analyst user
    const financialUser = await prisma.user.findFirst({
      where: {
        roles: {
          some: {
            role: {
              name: 'FINANCIAL_ANALYST'
            }
          }
        }
      },
      include: {
        roles: {
          include: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    
    if (financialUser) {
      console.log('📊 Financial Analyst User Found:')
      console.log(`   Email: ${financialUser.email}`)
      console.log(`   Roles: ${financialUser.roles.map(ur => ur.role.name).join(', ')}`)
      console.log(`   Full roles structure:`, JSON.stringify(financialUser.roles, null, 2))
    } else {
      console.log('❌ No Financial Analyst user found')
    }
    
  } catch (error) {
    console.error('Error checking user data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  checkUserData()
}

export { checkUserData }
