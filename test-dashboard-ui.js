const puppeteer = require('puppeteer')

async function testBasicDashboardUI() {
  console.log('🧪 Testing Basic Dashboard UI with Real SPPG Data...\n')

  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    console.log('🌐 Opening SPPG application...')
    await page.goto('http://localhost:3000/login')
    await page.waitForSelector('input[name="email"]', { timeout: 10000 })
    
    // Test login dengan CHEF user (untuk melihat kitchen data)
    console.log('👨‍🍳 Testing login as CHEF user...')
    await page.type('input[name="email"]', 'chef@sppg.com')
    await page.type('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    
    const currentUrl = page.url()
    console.log(`📍 Current URL: ${currentUrl}`)
    
    if (currentUrl.includes('/dashboard/basic')) {
      console.log('✅ Successfully redirected to basic dashboard')
      
      // Wait for dashboard to load
      await page.waitForSelector('[data-testid="dashboard-content"], .dashboard, main', { timeout: 10000 })
      
      // Check for SPPG-specific content
      const pageText = await page.evaluate(() => document.body.innerText)
      
      console.log('\n📊 Checking dashboard content for SPPG relevance:')
      
      // Kitchen-specific checks for CHEF role
      const kitchenTerms = [
        'stok bahan baku',
        'produksi makanan',
        'persiapan',
        'inventory',
        'production',
        'quality check'
      ]
      
      let foundRelevantContent = 0
      kitchenTerms.forEach(term => {
        if (pageText.toLowerCase().includes(term.toLowerCase())) {
          console.log(`  ✅ Found: "${term}"`)
          foundRelevantContent++
        } else {
          console.log(`  ❌ Missing: "${term}"`)
        }
      })
      
      // Check for generic/irrelevant content that should be removed
      const irrelevantTerms = [
        'team standup meeting',
        'complete training module',
        'submit weekly report',
        'check inventory levels' // generic term
      ]
      
      let foundIrrelevantContent = 0
      irrelevantTerms.forEach(term => {
        if (pageText.toLowerCase().includes(term.toLowerCase())) {
          console.log(`  ⚠️ Found irrelevant: "${term}"`)
          foundIrrelevantContent++
        }
      })
      
      // Check for real-time data indicators
      console.log('\n🔄 Checking for real-time data:')
      
      // Look for numbers that suggest real data
      const numberMatches = pageText.match(/\d+\s*(item|transaksi|porsi|peserta|checkpoint|sekolah)/gi)
      if (numberMatches) {
        console.log(`  ✅ Found real data indicators: ${numberMatches.slice(0, 3).join(', ')}`)
      } else {
        console.log('  ❌ No real data indicators found')
      }
      
      // Check for Indonesian language content (SPPG context)
      const indonesianTerms = ['hari ini', 'minggu', 'bulan', 'sekolah', 'makanan', 'kesehatan']
      const foundIndonesian = indonesianTerms.filter(term => 
        pageText.toLowerCase().includes(term.toLowerCase())
      )
      
      if (foundIndonesian.length > 0) {
        console.log(`  ✅ Indonesian content found: ${foundIndonesian.join(', ')}`)
      }
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: 'dashboard-basic-chef.png', 
        fullPage: true 
      })
      console.log('📸 Screenshot saved as dashboard-basic-chef.png')
      
      // Summary
      console.log('\n📈 Test Results:')
      console.log(`  ✅ Relevant SPPG content: ${foundRelevantContent}/${kitchenTerms.length}`)
      console.log(`  ⚠️ Irrelevant content: ${foundIrrelevantContent}/${irrelevantTerms.length}`)
      console.log(`  🌏 Indonesian localization: ${foundIndonesian.length}/${indonesianTerms.length}`)
      
      if (foundRelevantContent >= 4 && foundIrrelevantContent <= 1) {
        console.log('  🎉 Dashboard successfully shows SPPG-relevant content!')
      } else {
        console.log('  ⚠️ Dashboard needs more SPPG-specific content')
      }
      
    } else {
      console.log(`❌ Unexpected redirect to: ${currentUrl}`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await browser.close()
  }
}

testBasicDashboardUI()
