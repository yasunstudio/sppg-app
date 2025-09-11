import { PrismaClient } from '../src/generated/prisma'
import seedPermissions from './seeds/00-permissions'
import seedRoles from './seeds/01-roles'
import { seedUsers } from './seeds/02-users'
import { seedUserRoles } from './seeds/03-user-roles'
import { seedSchools } from './seeds/04-schools'
import { seedRawMaterials } from './seeds/05-raw-materials'
import { seedMenus } from './seeds/06-menu-items'
import { seedSuppliers } from './seeds/07-suppliers'
import { seedInventoryItems } from './seeds/08-inventory-items'
import { seedStudents } from './seeds/09-students'
import { seedMenuRecipes } from './seeds/10-menu-recipes'
import { seedProductionBatches } from './seeds/11-production-batches'
import { seedDistributions } from './seeds/12-distributions'
import seedVehicles from './seeds/13-vehicles'
import seedDeliveries from './seeds/14-deliveries'
import seedItems from './seeds/15-items'
import seedRecipeIngredients from './seeds/16-recipe-ingredients'
import seedProductionResources from './seeds/17-production-resources'
import seedResourceUsage from './seeds/18-resource-usage'
import seedQualityCheckpoints from './seeds/19-quality-checkpoints'
import seedPurchaseOrders from './seeds/20-purchase-orders'
import seedDrivers from './seeds/27-drivers'
import seedSystemConfig from './seeds/28-system-config'
import seedAuditLogs from './seeds/29-audit-logs'
import seedNotifications from './seeds/30-notifications'
import seedFinancialTransactions from './seeds/31-financial-transactions'
import seedBudgets from './seeds/32-budgets'
import seedWasteRecords from './seeds/33-waste-records'
import seedFeedback from './seeds/34-feedback'
import { seedClasses } from './seeds/35-classes'
import { seedMenuItemIngredients } from './seeds/36-menu-item-ingredients'
import seedResourceUsageNew from './seeds/38-resource-usage'
import { seedProductionMetrics } from './seeds/39-production-metrics'
import { seedQualityChecks } from './seeds/40-quality-checks'
import { seedNutritionConsultations } from './seeds/41-nutrition-consultations'
import { seedFoodSamples } from './seeds/42-food-samples'
import { seedQualityStandards } from './seeds/43-quality-standards'
import updateDriverStats from './seeds/44-update-driver-stats'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive SPPG Purwakarta database seeding...')
  console.log('📅 Seeding data for operational period: August 2025 (Mon-Fri)')
  console.log('🏢 Target region: Kabupaten Purwakarta, Jawa Barat')
  console.log('============================================================')
  
  // Check if database already has data
  const [existingPermissions, existingRoles, existingUsers, existingSchools, existingRawMaterials, existingMenus, existingSuppliers, existingInventory, existingStudents, existingVehicles, existingItems, existingResources, existingPurchaseOrders] = await Promise.all([
    prisma.permission.count(),
    prisma.role.count(),
    prisma.user.count(),
    prisma.school.count(),
    prisma.rawMaterial.count(),
    prisma.menu.count(),
    prisma.supplier.count(),
    prisma.inventoryItem.count(),
    prisma.student.count(),
    prisma.vehicle.count(),
    prisma.item.count(),
    prisma.productionResource.count(),
    prisma.purchaseOrder.count()
  ])

  if (existingPermissions > 0 || existingRoles > 0 || existingUsers > 0 || existingSchools > 0 || existingRawMaterials > 0 || existingMenus > 0 || existingSuppliers > 0 || existingInventory > 0 || existingStudents > 0 || existingVehicles > 0 || existingItems > 0 || existingResources > 0 || existingPurchaseOrders > 0) {
    console.log('⚠️  Database already contains data.')
    console.log(`📊 Current counts: ${existingPermissions} permissions, ${existingRoles} roles, ${existingUsers} users, ${existingSchools} schools, ${existingRawMaterials} raw materials, ${existingMenus} menus, ${existingSuppliers} suppliers, ${existingInventory} inventory items, ${existingStudents} students, ${existingVehicles} vehicles, ${existingItems} items, ${existingResources} resources, ${existingPurchaseOrders} purchase orders`)
    console.log('🔄 Proceeding with seeding (will skip existing data)...')
    console.log('')
  }

  try {
    // Priority 0: Permission System (Foundation)
    console.log('🔐 Priority 0: Seeding Permission System...')
    await seedPermissions(prisma)
    
    // Priority 1: Core Operations (Foundation)
    console.log('🏗️ Priority 1: Seeding Core Operations...')
    await seedRoles()
    await seedUsers()
    await seedUserRoles()
    await seedSchools()
    await seedClasses()
    await seedStudents()

    // Supply chain foundation
    await seedRawMaterials()
    await seedMenus()
    await seedMenuItemIngredients()
    await seedSuppliers()
    await seedInventoryItems()
    await seedVehicles()
    await seedDrivers()
    
    // Enhanced item management
    await seedItems()
    
    // Advanced production management
    await seedProductionResources()
    await seedResourceUsageNew()
    await seedQualityCheckpoints()
    await seedPurchaseOrders()
    
    // Production and distribution workflow
    await seedMenuRecipes()
    await seedRecipeIngredients()
    await seedProductionBatches()
    await seedProductionMetrics()
    await seedQualityChecks()
    await seedQualityStandards()
    await seedNutritionConsultations()
    await seedFoodSamples()
    await seedDistributions()
    await seedDeliveries()
    
    // Update driver statistics after deliveries are seeded
    await updateDriverStats()

    // Priority 3: Supporting Systems
    console.log('🛠️ Priority 3: Seeding Supporting Systems...')
    await seedSystemConfig()
    await seedAuditLogs()
    await seedNotifications()
    await seedFinancialTransactions()
    await seedBudgets()
    await seedWasteRecords()
    await seedFeedback()

    // Final status check
    const [finalRoles, finalUsers, finalSchools, finalRawMaterials, finalMenus, finalSuppliers, finalInventory, finalStudents, finalRecipes, finalBatches, finalDistributions, finalDrivers, finalVehicles, finalItems, finalDeliveries, finalRecipeIngredients, finalResources, finalResourceUsage, finalQualityCheckpoints, finalPurchaseOrders, finalPurchaseOrderItems, finalSystemConfig, finalAuditLogs, finalNotifications, finalTransactions, finalBudgets, finalWasteRecords, finalFeedback] = await Promise.all([
      prisma.role.count(),
      prisma.user.count(),
      prisma.school.count(),
      prisma.rawMaterial.count(),
      prisma.menu.count(),
      prisma.supplier.count(),
      prisma.inventoryItem.count(),
      prisma.student.count(),
      prisma.recipe.count(),
      prisma.productionBatch.count(),
      prisma.distribution.count(),
      prisma.driver.count(),
      prisma.vehicle.count(),
      prisma.item.count(),
      prisma.delivery.count(),
      prisma.recipeIngredient.count(),
      prisma.productionResource.count(),
      prisma.resourceUsage.count(),
      prisma.qualityCheckpoint.count(),
      prisma.purchaseOrder.count(),
      prisma.purchaseOrderItem.count(),
      prisma.systemConfig.count(),
      prisma.auditLog.count(),
      prisma.notification.count(),
      prisma.financialTransaction.count(),
      prisma.budget.count(),
      prisma.wasteRecord.count(),
      prisma.feedback.count()
    ])

    console.log('')
    console.log('📊 COMPLETE SPPG SYSTEM STATUS:')
    console.log(`🔐 Authentication: ${finalRoles} roles | ${finalUsers} users`)
    console.log(`🏫 Education: ${finalSchools} schools | ${finalStudents} students`)
    console.log(`🏪 Supply Chain: ${finalSuppliers} suppliers | ${finalRawMaterials} raw materials | ${finalItems} enhanced items`)
    console.log(`📦 Inventory: ${finalInventory} inventory items | ${finalRecipeIngredients} recipe ingredients`)
    console.log(`🍳 Production: ${finalRecipes} recipes | ${finalBatches} production batches | ${finalMenus} menus`)
    console.log(`⚙️ Resources: ${finalResources} production resources | ${finalResourceUsage} usage records`)
    console.log(`🔍 Quality: ${finalQualityCheckpoints} quality checkpoints`)
    console.log(`📋 Procurement: ${finalPurchaseOrders} purchase orders | ${finalPurchaseOrderItems} order items`)
    console.log(`🚚 Distribution: ${finalDistributions} distributions | ${finalDrivers} drivers | ${finalVehicles} vehicles | ${finalDeliveries} deliveries`)
    console.log(`🛠️ Supporting Systems: ${finalSystemConfig} configs | ${finalAuditLogs} audit logs | ${finalNotifications} notifications`)
    console.log(`💰 Financial: ${finalTransactions} transactions | ${finalBudgets} budget entries`)
    console.log(`♻️ Environmental: ${finalWasteRecords} waste records | ${finalFeedback} feedback entries`)
    console.log('')
    console.log('🎉 COMPLETE SPPG PURWAKARTA DATABASE SEEDED SUCCESSFULLY!')
    console.log('🚀 100% OPERATIONAL SYSTEM WITH FULL SUPPORTING INFRASTRUCTURE!')
    console.log('📈 Priority 1-3 COMPLETED: Core → Production → Supporting Systems')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('🚨 Fatal error during seeding:', e)
    process.exit(1)
  })
