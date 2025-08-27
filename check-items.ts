import { PrismaClient } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function checkItems() {
  console.log("📋 Checking existing items in database...")

  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      category: true
    }
  })

  console.log("Found items:")
  items.forEach(item => {
    console.log(`- ${item.name} (${item.category})`)
  })

  await prisma.$disconnect()
}

checkItems()
