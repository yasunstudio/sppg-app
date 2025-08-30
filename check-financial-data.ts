import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function checkFinancialData() {
  console.log('🔍 Checking Financial Data in Database...\n');

  try {
    // Check FinancialTransaction table
    const transactionCount = await prisma.financialTransaction.count();
    console.log(`📊 Total Financial Transactions: ${transactionCount}`);

    if (transactionCount > 0) {
      // Get sample transactions
      const sampleTransactions = await prisma.financialTransaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          category: true,
          amount: true,
          description: true,
          budgetPeriod: true,
          createdAt: true,
        }
      });

      console.log('\n💰 Sample Financial Transactions:');
      sampleTransactions.forEach((t, i) => {
        console.log(`   ${i + 1}. ${t.type} - ${t.category}: ${t.amount.toLocaleString('id-ID')} IDR`);
        console.log(`      📝 ${t.description}`);
        console.log(`      📅 Period: ${t.budgetPeriod}, Date: ${t.createdAt.toLocaleDateString('id-ID')}`);
        console.log('');
      });

      // Get aggregated data by type
      const [incomeSum, expenseSum] = await Promise.all([
        prisma.financialTransaction.aggregate({
          where: { type: 'INCOME', deletedAt: null },
          _sum: { amount: true }
        }),
        prisma.financialTransaction.aggregate({
          where: { type: 'EXPENSE', deletedAt: null },
          _sum: { amount: true }
        })
      ]);

      console.log('📈 Financial Summary:');
      console.log(`   💰 Total Income: ${(incomeSum._sum.amount || 0).toLocaleString('id-ID')} IDR`);
      console.log(`   💸 Total Expenses: ${(expenseSum._sum.amount || 0).toLocaleString('id-ID')} IDR`);
      console.log(`   📊 Net: ${((incomeSum._sum.amount || 0) - (expenseSum._sum.amount || 0)).toLocaleString('id-ID')} IDR`);
    }

    // Check Budget table
    const budgetCount = await prisma.budget.count();
    console.log(`\n📋 Total Budgets: ${budgetCount}`);

    if (budgetCount > 0) {
      const sampleBudgets = await prisma.budget.findMany({
        take: 3,
        select: {
          id: true,
          category: true,
          period: true,
          allocated: true,
          spent: true,
          remaining: true,
        }
      });

      console.log('\n💼 Sample Budgets:');
      sampleBudgets.forEach((b, i) => {
        const utilization = b.allocated > 0 ? ((b.spent / b.allocated) * 100).toFixed(1) : '0';
        console.log(`   ${i + 1}. ${b.category} (${b.period})`);
        console.log(`      📊 Allocated: ${b.allocated.toLocaleString('id-ID')} IDR`);
        console.log(`      💸 Spent: ${b.spent.toLocaleString('id-ID')} IDR (${utilization}%)`);
        console.log(`      💰 Remaining: ${b.remaining.toLocaleString('id-ID')} IDR`);
        console.log('');
      });
    }

    // Check if tables exist but are empty
    if (transactionCount === 0 && budgetCount === 0) {
      console.log('\n⚠️  Financial tables exist but are empty');
      console.log('💡 Suggestion: Run seed script to populate financial data');
      console.log('   Command: npx tsx prisma/seed-financial.ts');
    }

  } catch (error: any) {
    console.error('❌ Error checking financial data:', error);
    
    if (error.message && error.message.includes('does not exist')) {
      console.log('\n📝 Missing tables detected. Run migration:');
      console.log('   Command: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkFinancialData();
