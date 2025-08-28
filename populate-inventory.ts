import { PrismaClient, QualityStatus } from "./src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Adding sample inventory data...")

  // Get raw materials
  const rawMaterials = await prisma.rawMaterial.findMany()
  const suppliers = await prisma.supplier.findMany()

  if (rawMaterials.length === 0) {
    console.log("❌ No raw materials found. Please run the main seeder first.")
    return
  }

  console.log(`Found ${rawMaterials.length} raw materials`)
  console.log(`Found ${suppliers.length} suppliers`)

  // Sample inventory data
  const inventoryData = [
    {
      quantity: 500,
      unitPrice: 12000,
      expiryDate: new Date("2025-12-31"),
      batchNumber: "RICE001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 250,
      unitPrice: 35000,
      expiryDate: new Date("2025-09-15"),
      batchNumber: "CHICK001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 100,
      unitPrice: 8000,
      expiryDate: new Date("2025-09-10"),
      batchNumber: "VEG001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 50,
      unitPrice: 15000,
      expiryDate: new Date("2025-11-30"),
      batchNumber: "FISH001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 200,
      unitPrice: 25000,
      expiryDate: new Date("2025-10-15"),
      batchNumber: "MILK001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 75,
      unitPrice: 45000,
      expiryDate: new Date("2025-09-20"),
      batchNumber: "BEEF001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 300,
      unitPrice: 18000,
      expiryDate: new Date("2026-01-15"),
      batchNumber: "OIL001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 150,
      unitPrice: 6000,
      expiryDate: new Date("2025-09-25"),
      batchNumber: "TOM001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 80,
      unitPrice: 5000,
      expiryDate: new Date("2025-09-18"),
      batchNumber: "CAR001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 120,
      unitPrice: 7000,
      expiryDate: new Date("2025-09-22"),
      batchNumber: "POT001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 60,
      unitPrice: 3000,
      expiryDate: new Date("2025-09-16"),
      batchNumber: "ONI001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 40,
      unitPrice: 4000,
      expiryDate: new Date("2025-09-14"),
      batchNumber: "SPI001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 90,
      unitPrice: 20000,
      expiryDate: new Date("2025-10-30"),
      batchNumber: "EGG001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 160,
      unitPrice: 9000,
      expiryDate: new Date("2025-12-15"),
      batchNumber: "GAR001",
      qualityStatus: QualityStatus.GOOD
    },
    {
      quantity: 25,
      unitPrice: 10000,
      expiryDate: new Date("2025-09-12"),
      batchNumber: "CHI001",
      qualityStatus: QualityStatus.FAIR // Low stock
    },
    {
      quantity: 180,
      unitPrice: 16000,
      expiryDate: new Date("2025-11-20"),
      batchNumber: "TEM001",
      qualityStatus: QualityStatus.GOOD
    }
  ]

  let created = 0
  
  for (let i = 0; i < Math.min(rawMaterials.length, inventoryData.length); i++) {
    const rawMaterial = rawMaterials[i]
    const data = inventoryData[i]
    const supplier = suppliers[i % suppliers.length] // Cycle through suppliers

    try {
      const inventoryItem = await prisma.inventoryItem.create({
        data: {
          rawMaterialId: rawMaterial.id,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          totalPrice: data.quantity * data.unitPrice,
          expiryDate: data.expiryDate,
          batchNumber: data.batchNumber,
          supplierId: supplier?.id,
          qualityStatus: data.qualityStatus
        }
      })
      created++
      console.log(`✅ Created inventory item for ${rawMaterial.name} (${data.quantity} ${rawMaterial.unit})`)
    } catch (error) {
      console.log(`❌ Failed to create inventory item for ${rawMaterial.name}:`, error)
    }
  }

  console.log(`\n🎉 Successfully created ${created} inventory items!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
