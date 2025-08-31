import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedProductionMetrics() {
  console.log('📊 Seeding production metrics...')
  
  const productionMetrics = []

  // Generate daily production metrics for August 2025
  for (let day = 1; day <= 31; day++) {
    const metricsDate = new Date(2025, 7, day)
    
    // Skip weekends
    if (metricsDate.getDay() === 0 || metricsDate.getDay() === 6) continue
    
    // Calculate daily metrics
    const targetProduction = 400 + Math.floor(Math.random() * 200) // 400-600 portions
    const actualProduction = Math.floor(targetProduction * (0.85 + Math.random() * 0.15)) // 85-100% achievement
    const efficiency = (actualProduction / targetProduction) * 100
    
    // Quality metrics
    const qualityScore = 75 + Math.random() * 20 // 75-95
    
    // Resource consumption
    const wastageAmount = actualProduction * (0.05 + Math.random() * 0.08) // 5-13% wastage
    const energyUsage = 200 + Math.random() * 150 // 200-350 kWh
    const waterUsage = 1000 + Math.random() * 800 // 1000-1800 liters
    const laborHours = 24 + Math.random() * 16 // 24-40 hours total labor
    const equipmentUptime = 85 + Math.random() * 12 // 85-97% uptime
    
    // Cost calculation
    const materialCostPerPortion = 8 + Math.random() * 4 // 8-12k per portion
    const laborCostPerHour = 60000 // 60k per hour
    const utilityCost = energyUsage * 1500 + waterUsage * 500 // utility costs
    const totalCost = (actualProduction * materialCostPerPortion * 1000) + (laborHours * laborCostPerHour) + utilityCost
    const costPerPortion = totalCost / actualProduction
    
    productionMetrics.push({
      id: `pm-${day.toString().padStart(2, '0')}-08-2025`,
      date: metricsDate,
      totalProduction: actualProduction,
      targetProduction: targetProduction,
      efficiency: Math.round(efficiency * 100) / 100,
      qualityScore: Math.round(qualityScore * 100) / 100,
      wastageAmount: Math.round(wastageAmount * 100) / 100,
      costPerPortion: Math.round(costPerPortion),
      energyUsage: Math.round(energyUsage * 100) / 100,
      waterUsage: Math.round(waterUsage * 100) / 100,
      laborHours: Math.round(laborHours * 100) / 100,
      equipmentUptime: Math.round(equipmentUptime * 100) / 100
    })
  }

  // Add some specific notable days with special metrics
  const specialDays = [
    {
      id: 'pm-01-08-2025-opening',
      date: new Date(2025, 7, 1),
      totalProduction: 450,
      targetProduction: 500,
      efficiency: 90.0,
      qualityScore: 88.5,
      wastageAmount: 22.5,
      costPerPortion: 12500,
      energyUsage: 285.0,
      waterUsage: 1350.0,
      laborHours: 32.5,
      equipmentUptime: 92.0
    },
    {
      id: 'pm-15-08-2025-peak',
      date: new Date(2025, 7, 15),
      totalProduction: 580,
      targetProduction: 600,
      efficiency: 96.7,
      qualityScore: 94.2,
      wastageAmount: 29.0,
      costPerPortion: 11200,
      energyUsage: 320.0,
      waterUsage: 1600.0,
      laborHours: 38.0,
      equipmentUptime: 97.5
    },
    {
      id: 'pm-31-08-2025-closing',
      date: new Date(2025, 7, 31),
      totalProduction: 520,
      targetProduction: 550,
      efficiency: 94.5,
      qualityScore: 91.8,
      wastageAmount: 26.0,
      costPerPortion: 11800,
      energyUsage: 295.0,
      waterUsage: 1450.0,
      laborHours: 35.5,
      equipmentUptime: 95.2
    }
  ]

  // Combine regular and special metrics
  const allMetrics = [...productionMetrics, ...specialDays]

  for (const metric of allMetrics) {
    await prisma.productionMetrics.upsert({
      where: { date: metric.date },
      update: metric,
      create: metric
    })
  }

  console.log(`✅ Created ${allMetrics.length} production metrics records`)
}

export default seedProductionMetrics
