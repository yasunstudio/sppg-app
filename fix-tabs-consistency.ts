import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findTabsListInconsistencies(dir: string): void {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findTabsListInconsistencies(filePath);
    } else if (file === 'page.tsx') {
      try {
        const content = readFileSync(filePath, 'utf-8');
        
        // Check if file uses TabsList
        if (content.includes('TabsList') && content.includes('TabsTrigger')) {
          const lines = content.split('\n');
          let hasInconsistentTabs = false;
          let tabsListLineNumber = -1;
          let numTriggers = 0;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Find TabsList line
            if (line.includes('<TabsList') && !line.includes('className="grid w-full')) {
              tabsListLineNumber = i;
              hasInconsistentTabs = true;
            }
            
            // Count TabsTrigger occurrences
            if (line.includes('<TabsTrigger')) {
              numTriggers++;
            }
          }
          
          if (hasInconsistentTabs && numTriggers > 0) {
            console.log(`\n📄 File: ${filePath}`);
            console.log(`   🔢 Number of tabs: ${numTriggers}`);
            console.log(`   📍 TabsList line: ${tabsListLineNumber + 1}`);
            console.log(`   ⚠️  Missing grid layout`);
            
            // Show the line content
            if (tabsListLineNumber >= 0) {
              console.log(`   📝 Current: ${lines[tabsListLineNumber].trim()}`);
              console.log(`   ✅ Should be: <TabsList className="grid w-full grid-cols-${numTriggers}">`);
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

function fixTabsListInconsistencies(dir: string): void {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      fixTabsListInconsistencies(filePath);
    } else if (file === 'page.tsx') {
      try {
        let content = readFileSync(filePath, 'utf-8');
        let modified = false;
        
        // Check if file uses TabsList
        if (content.includes('TabsList') && content.includes('TabsTrigger')) {
          const lines = content.split('\n');
          let numTriggers = 0;
          
          // Count TabsTrigger occurrences
          for (const line of lines) {
            if (line.includes('<TabsTrigger')) {
              numTriggers++;
            }
          }
          
          // Fix TabsList lines that don't have grid layout
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('<TabsList') && !line.includes('className="grid w-full') && numTriggers > 0) {
              const indentation = line.match(/^(\s*)/)?.[1] || '';
              
              if (line.includes('className=')) {
                // Replace existing className
                lines[i] = line.replace(
                  /className="[^"]*"/,
                  `className="grid w-full grid-cols-${numTriggers}"`
                );
              } else if (line.includes('>')) {
                // Add className before closing bracket
                lines[i] = line.replace(
                  /<TabsList([^>]*)>/,
                  `<TabsList$1 className="grid w-full grid-cols-${numTriggers}">`
                );
              }
              
              modified = true;
              console.log(`✅ Fixed: ${filePath}`);
              console.log(`   📝 ${lines[i].trim()}`);
            }
          }
          
          if (modified) {
            const newContent = lines.join('\n');
            writeFileSync(filePath, newContent, 'utf-8');
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
      }
    }
  }
}

console.log('🔍 Analyzing TabsList inconsistencies...\n');

// First, analyze inconsistencies
findTabsListInconsistencies('./src/app/dashboard');

console.log('\n🔧 Fixing TabsList inconsistencies...\n');

// Then fix them
fixTabsListInconsistencies('./src/app/dashboard');

console.log('\n✅ TabsList consistency check and fix completed!');
