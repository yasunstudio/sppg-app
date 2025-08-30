import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function checkEmptyTables() {
  console.log('🔍 Checking ALL tables in SPPG PostgreSQL database...\n');

  try {
    // Daftar LENGKAP semua model dari schema.prisma (51 models)
    const tables = [
      // Authentication & User Management
      { name: 'User', query: () => prisma.user.count() },
      { name: 'Account', query: () => prisma.account.count() },
      { name: 'Session', query: () => prisma.session.count() },
      { name: 'VerificationToken', query: () => prisma.verificationToken.count() },
      { name: 'Role', query: () => prisma.role.count() },
      { name: 'UserRole', query: () => prisma.userRole.count() },
      
      // Education System
      { name: 'School', query: () => prisma.school.count() },
      { name: 'Student', query: () => prisma.student.count() },
      { name: 'Class', query: () => prisma.class.count() },
      
      // Posyandu System
      { name: 'Posyandu', query: () => prisma.posyandu.count() },
      { name: 'PregnantWoman', query: () => prisma.pregnantWoman.count() },
      { name: 'LactatingMother', query: () => prisma.lactatingMother.count() },
      { name: 'Toddler', query: () => prisma.toddler.count() },
      { name: 'PosyanduProgram', query: () => prisma.posyanduProgram.count() },
      { name: 'PosyanduParticipant', query: () => prisma.posyanduParticipant.count() },
      { name: 'HealthRecord', query: () => prisma.healthRecord.count() },
      { name: 'NutritionPlan', query: () => prisma.nutritionPlan.count() },
      { name: 'NutritionPlanRecipe', query: () => prisma.nutritionPlanRecipe.count() },
      { name: 'PosyanduActivity', query: () => prisma.posyanduActivity.count() },
      { name: 'PosyanduVolunteer', query: () => prisma.posyanduVolunteer.count() },
      
      // Inventory & Supply Chain
      { name: 'RawMaterial', query: () => prisma.rawMaterial.count() },
      { name: 'InventoryItem', query: () => prisma.inventoryItem.count() },
      { name: 'Supplier', query: () => prisma.supplier.count() },
      { name: 'Item', query: () => prisma.item.count() },
      
      // Menu & Recipe System
      { name: 'Menu', query: () => prisma.menu.count() },
      { name: 'MenuItem', query: () => prisma.menuItem.count() },
      { name: 'MenuItemIngredient', query: () => prisma.menuItemIngredient.count() },
      { name: 'Recipe', query: () => prisma.recipe.count() },
      { name: 'RecipeIngredient', query: () => prisma.recipeIngredient.count() },
      
      // Nutrition & Health
      { name: 'NutritionConsultation', query: () => prisma.nutritionConsultation.count() },
      
      // Quality Control
      { name: 'QualityCheck', query: () => prisma.qualityCheck.count() },
      { name: 'QualityCheckpoint', query: () => prisma.qualityCheckpoint.count() },
      { name: 'QualityStandard', query: () => prisma.qualityStandard.count() },
      { name: 'FoodSample', query: () => prisma.foodSample.count() },
      
      // Production System
      { name: 'ProductionPlan', query: () => prisma.productionPlan.count() },
      { name: 'ProductionBatch', query: () => prisma.productionBatch.count() },
      { name: 'ProductionResource', query: () => prisma.productionResource.count() },
      { name: 'ResourceUsage', query: () => prisma.resourceUsage.count() },
      { name: 'ProductionMetrics', query: () => prisma.productionMetrics.count() },
      
      // Distribution & Logistics
      { name: 'Driver', query: () => prisma.driver.count() },
      { name: 'Vehicle', query: () => prisma.vehicle.count() },
      { name: 'Distribution', query: () => prisma.distribution.count() },
      { name: 'DistributionSchool', query: () => prisma.distributionSchool.count() },
      { name: 'Delivery', query: () => prisma.delivery.count() },
      
      // Financial Management
      { name: 'FinancialTransaction', query: () => prisma.financialTransaction.count() },
      { name: 'Budget', query: () => prisma.budget.count() },
      
      // Operations & Monitoring
      { name: 'WasteRecord', query: () => prisma.wasteRecord.count() },
      { name: 'Feedback', query: () => prisma.feedback.count() },
      { name: 'Notification', query: () => prisma.notification.count() },
      { name: 'AuditLog', query: () => prisma.auditLog.count() },
      { name: 'SystemConfig', query: () => prisma.systemConfig.count() },
    ];

    const emptyTables: string[] = [];
    const nonEmptyTables: { name: string; count: number }[] = [];
    const errorTables: { name: string; error: string }[] = [];

    console.log('📊 Comprehensive Database Status Report:');
    console.log('=' .repeat(60));

    for (const table of tables) {
      try {
        const count = await table.query();
        if (count === 0) {
          emptyTables.push(table.name);
          console.log(`❌ ${table.name.padEnd(25)} : 0 records (EMPTY)`);
        } else {
          nonEmptyTables.push({ name: table.name, count });
          console.log(`✅ ${table.name.padEnd(25)} : ${count.toString().padStart(8)} records`);
        }
      } catch (error: any) {
        errorTables.push({ name: table.name, error: error.message });
        console.log(`⚠️  ${table.name.padEnd(25)} : ERROR - ${error.message}`);
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('📈 DATABASE SUMMARY:');
    console.log(`✅ Tables with data    : ${nonEmptyTables.length}/${tables.length}`);
    console.log(`❌ Empty tables        : ${emptyTables.length}/${tables.length}`);
    console.log(`⚠️  Error tables       : ${errorTables.length}/${tables.length}`);
    console.log(`📊 Data coverage       : ${((nonEmptyTables.length/tables.length)*100).toFixed(1)}%`);

    if (emptyTables.length > 0) {
      console.log('\n🚨 EMPTY TABLES REQUIRING ATTENTION:');
      console.log('=' .repeat(50));
      
      // Group empty tables by category
      const criticalTables = emptyTables.filter(t => 
        ['User', 'Role', 'School', 'Menu', 'Recipe', 'QualityStandard'].includes(t)
      );
      const productionTables = emptyTables.filter(t => 
        t.includes('Production') || t.includes('Quality')
      );
      const logisticTables = emptyTables.filter(t => 
        ['Driver', 'Vehicle', 'Distribution', 'Delivery'].includes(t)
      );
      const posyanduTables = emptyTables.filter(t => 
        t.includes('Posyandu') || ['PregnantWoman', 'LactatingMother', 'Toddler'].includes(t)
      );
      const financialTables = emptyTables.filter(t => 
        ['FinancialTransaction', 'Budget'].includes(t)
      );

      if (criticalTables.length > 0) {
        console.log('\n🔴 CRITICAL (Core System):');
        criticalTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }

      if (productionTables.length > 0) {
        console.log('\n🟠 PRODUCTION SYSTEM:');
        productionTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }

      if (logisticTables.length > 0) {
        console.log('\n🟡 LOGISTICS & DISTRIBUTION:');
        logisticTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }

      if (posyanduTables.length > 0) {
        console.log('\n🟢 POSYANDU SYSTEM:');
        posyanduTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }

      if (financialTables.length > 0) {
        console.log('\n🔵 FINANCIAL MANAGEMENT:');
        financialTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }

      const otherTables = emptyTables.filter(t => 
        ![...criticalTables, ...productionTables, ...logisticTables, ...posyanduTables, ...financialTables].includes(t)
      );
      if (otherTables.length > 0) {
        console.log('\n⚪ OTHER MODULES:');
        otherTables.forEach((table, index) => {
          console.log(`   ${(index + 1).toString().padStart(2)}. ${table}`);
        });
      }
    }

    if (nonEmptyTables.length > 0) {
      console.log('\n✅ POPULATED TABLES (Top 10):');
      console.log('=' .repeat(40));
      nonEmptyTables
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .forEach((table, index) => {
          console.log(`${(index + 1).toString().padStart(2)}. ${table.name.padEnd(20)} : ${table.count.toLocaleString().padStart(8)} records`);
        });
    }

    if (errorTables.length > 0) {
      console.log('\n⚠️  TABLES WITH ERRORS:');
      console.log('=' .repeat(40));
      errorTables.forEach((table, index) => {
        console.log(`${(index + 1).toString().padStart(2)}. ${table.name}: ${table.error}`);
      });
    }

    console.log('\n💡 NEXT STEPS:');
    console.log('=' .repeat(40));
    if (emptyTables.includes('User')) {
      console.log('🔑 1. Create admin users and authentication setup');
    }
    if (emptyTables.includes('School')) {
      console.log('🏫 2. Register schools and educational institutions');
    }
    if (emptyTables.includes('Menu') || emptyTables.includes('Recipe')) {
      console.log('📝 3. Setup menu plans and recipes');
    }
    if (emptyTables.includes('QualityStandard')) {
      console.log('⭐ 4. Define quality control standards');
    }
    if (emptyTables.includes('Driver') || emptyTables.includes('Vehicle')) {
      console.log('🚚 5. Setup logistics and distribution resources');
    }
    if (emptyTables.length === 0) {
      console.log('🎉 All tables have data! Database is fully populated.');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmptyTables();
