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

  // Replace old colors with new colors
  const replacements = [
    // Backgrounds
    [/bg-\[\#DAF1DE\]\/30/g, 'bg-[#0F172A]/85 backdrop-blur-md'], // Cards and elements
    [/bg-\[\#DAF1DE\]\/20/g, 'bg-[#0F172A]/85 backdrop-blur-md'],
    [/bg-\[\#DAF1DE\]\/10/g, 'bg-transparent'], // Sections
    [/bg-\[\#DAF1DE\]/g, 'bg-[#0F172A]'],
    [/dark:bg-\[\#051F20\]/g, 'dark:bg-[#0B1220]'], // Main dark background
    [/dark:bg-\[\#0B2B26\]/g, 'dark:bg-[#0F172A]/85'], // Cards dark background
    [/dark:bg-slate-950/g, 'dark:bg-[#0B1220]'],
    [/dark:bg-slate-900/g, 'dark:bg-[#0F172A]/85'],
    
    // Accents & Borders
    [/text-\[\#8EB69B\]/g, 'text-[#14B8A6]'],
    [/bg-\[\#8EB69B\]/g, 'bg-[#14B8A6]'],
    [/border-\[\#8EB69B\]/g, 'border-[#14B8A6]'],
    [/from-\[\#8EB69B\]/g, 'from-[#14B8A6]'],
    [/to-\[\#8EB69B\]/g, 'to-[#06B6D4]'],
    [/hover:text-\[\#8EB69B\]/g, 'hover:text-[#14B8A6]'],
    [/hover:bg-\[\#8EB69B\]/g, 'hover:bg-[#14B8A6]'],
    
    [/text-\[\#235347\]/g, 'text-[#06B6D4]'],
    [/bg-\[\#235347\]/g, 'bg-[#06B6D4]'],
    [/border-\[\#235347\]/g, 'border-white/10'], // Replaced dark green borders with subtle white
    [/dark:border-\[\#163832\]/g, 'dark:border-white/10'],
    [/dark:border-slate-850/g, 'dark:border-white/5'],
    
    [/to-\[\#235347\]/g, 'to-[#06B6D4]'],
    
    // Standardize to glass card borders
    [/border-slate-200 dark:border-white\/10/g, 'border-white/10'],
    
    // Status colors: Success
    [/emerald-500/g, 'green-500'],
    [/emerald-400/g, 'green-400'],
    
    // Status colors: Danger
    [/rose-500/g, 'red-500'],
  ];

  let newContent = content;
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Upgraded theme colors in: ${filePath}`);
  }
}

walkDir('./src', migrateColors);
console.log('Theme upgrade complete.');
