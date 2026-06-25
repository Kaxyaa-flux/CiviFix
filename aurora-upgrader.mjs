import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function migrateColors(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace old colors with new Aurora colors
  const replacements = [
    // Previous "Navy/Teal" redesign values
    [/bg-\[\#0B1220\]/g, 'bg-[#0A0A0F]'],
    [/dark:bg-\[\#0B1220\]/g, 'dark:bg-[#0A0A0F]'],
    [/bg-\[\#0F172A\]\/85/g, 'bg-[#16161D]/90'],
    [/dark:bg-\[\#0F172A\]\/85/g, 'dark:bg-[#16161D]/90'],
    [/bg-\[\#0F172A\]/g, 'bg-[#16161D]'],
    
    // Teal -> Purple/Cyan
    [/text-\[\#14B8A6\]/g, 'text-[#7C3AED]'],
    [/bg-\[\#14B8A6\]/g, 'bg-[#7C3AED]'],
    [/border-\[\#14B8A6\]/g, 'border-[#7C3AED]'],
    [/from-\[\#14B8A6\]/g, 'from-[#7C3AED]'],
    [/to-\[\#06B6D4\]/g, 'to-[#EC4899]'],
    [/hover:text-\[\#14B8A6\]/g, 'hover:text-[#22D3EE]'],
    [/hover:bg-\[\#14B8A6\]/g, 'hover:bg-[#22D3EE]'],
    
    // Cyan elements to Pink or Cyan
    [/text-\[\#06B6D4\]/g, 'text-[#22D3EE]'],
    [/bg-\[\#06B6D4\]/g, 'bg-[#22D3EE]'],
    
    // Any legacy Green/Cream left over
    [/bg-\[\#DAF1DE\]\/30/g, 'bg-[#16161D]/90'],
    [/bg-\[\#DAF1DE\]\/20/g, 'bg-[#16161D]/90'],
    [/bg-\[\#DAF1DE\]\/10/g, 'bg-transparent'],
    [/bg-\[\#DAF1DE\]/g, 'bg-[#16161D]'],
    [/dark:bg-\[\#051F20\]/g, 'dark:bg-[#0A0A0F]'],
    [/dark:bg-\[\#0B2B26\]/g, 'dark:bg-[#16161D]/90'],
    
    [/text-\[\#8EB69B\]/g, 'text-[#7C3AED]'],
    [/bg-\[\#8EB69B\]/g, 'bg-[#7C3AED]'],
    [/border-\[\#8EB69B\]/g, 'border-[#7C3AED]'],
    [/from-\[\#8EB69B\]/g, 'from-[#7C3AED]'],
    [/hover:text-\[\#8EB69B\]/g, 'hover:text-[#22D3EE]'],
    [/hover:bg-\[\#8EB69B\]/g, 'hover:bg-[#22D3EE]'],
    
    [/text-\[\#235347\]/g, 'text-[#EC4899]'],
    [/bg-\[\#235347\]/g, 'bg-[#EC4899]'],
    
    // Utility classes
    [/text-gradient-teal/g, 'text-gradient-aurora'],
    [/btn-primary-glow/g, 'btn-aurora-glow'],
    [/glass-card/g, 'glass-card-aurora'],
    [/glass-nav/g, 'glass-nav-aurora'],
  ];

  let newContent = content;
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Upgraded to Aurora theme in: ${filePath}`);
  }
}

walkDir('./src', migrateColors);
console.log('Aurora theme upgrade complete.');
