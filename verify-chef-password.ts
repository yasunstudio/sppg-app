import { PrismaClient } from './src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function verifyChefPassword() {
  try {
    console.log("🔍 Verifying chef password...")
    
    const chef = await prisma.user.findUnique({
      where: { email: 'chef@sppg.com' }
    })
    
    if (!chef) {
      console.log("❌ Chef user not found")
      return
    }
    
    console.log("👨‍🍳 Chef user found:", {
      name: chef.name,
      email: chef.email,
      isActive: chef.isActive
    })
    
    // Test common passwords
    const testPasswords = ['password123', 'admin123', 'chef123', 'sppg123', '123456']
    
    for (const testPassword of testPasswords) {
      const isMatch = await bcrypt.compare(testPassword, chef.password)
      if (isMatch) {
        console.log(`✅ Password found: ${testPassword}`)
        return testPassword
      }
    }
    
    console.log("❌ None of the common passwords match")
    console.log("💡 The password hash is:", chef.password.substring(0, 20) + "...")
    
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyChefPassword()
