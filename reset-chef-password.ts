import { PrismaClient } from './src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetChefPassword() {
  try {
    console.log("🔄 Resetting chef password...")
    
    const newPassword = 'password123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const updatedChef = await prisma.user.update({
      where: { email: 'chef@sppg.com' },
      data: { password: hashedPassword }
    })
    
    console.log("✅ Chef password updated successfully!")
    console.log("📧 Email: chef@sppg.com")
    console.log("🔑 Password: password123")
    console.log("👤 Name:", updatedChef.name)
    
  } catch (error) {
    console.error("❌ Error updating password:", error)
  } finally {
    await prisma.$disconnect()
  }
}

resetChefPassword()
