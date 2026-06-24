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
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Specific utility class replacements first
  const replacements = [
    [/bg-\[\#2563EB\]/g, 'bg-[#163832]'],
    [/text-\[\#2563EB\]/g, 'text-[#8EB69B]'],
    [/border-\[\#2563EB\]/g, 'border-[#235347]'],
    [/hover:bg-blue-700/g, 'hover:bg-[#0B2B26]'],
    [/dark:bg-slate-950/g, 'dark:bg-[#051F20]'],
    [/dark:bg-\[\#020617\]/g, 'dark:bg-[#051F20]'],
    [/dark:bg-slate-900/g, 'dark:bg-[#0B2B26]'],
    [/dark:border-slate-800/g, 'dark:border-[#163832]'],
    [/bg-slate-50/g, 'bg-[#DAF1DE]/30'],
    [/bg-white/g, 'bg-[#DAF1DE]/20'],
    [/selection:bg-blue-500/g, 'selection:bg-[#8EB69B]'],
    [/shadow-blue-[a-zA-Z0-9\/]+/g, 'shadow-[#051F20]/30'],
    // Handle specific active state requests if needed, but the broad ones cover most
    [/text-blue-500/g, 'text-[#8EB69B]'],
    [/text-blue-600/g, 'text-[#8EB69B]'],
    [/bg-blue-500/g, 'bg-[#8EB69B]'],
    [/bg-blue-600/g, 'bg-[#8EB69B]'],
    [/border-blue-500/g, 'border-[#235347]'],
    [/border-blue-600/g, 'border-[#235347]'],
    // General hex replacements
    [/\#2563EB/g, '#8EB69B'],
  ];

  let newContent = content;
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }

  // Handle specific requirements for Navbar active states manually later or if covered here.

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('./src', migrateColors);
console.log('Migration complete.');
