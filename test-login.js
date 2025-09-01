const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function testLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@sppg.com' },
      select: {
        id: true,
        email: true,
        name: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    console.log('👤 Test user found:', user)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
