import fs from 'fs';
import path from 'path';

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx') && f !== 'Navbar.tsx' && f !== 'Footer.tsx');

let totalUpdated = 0;

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Bump the padding classes typically found on outer container elements
  if (content.includes('pt-24')) {
    content = content.replace(/pt-24/g, 'pt-32');
    updated = true;
  }
  if (content.includes('pt-28')) {
    content = content.replace(/pt-28/g, 'pt-36');
    updated = true;
  }
  if (file === 'Hero.tsx' && content.includes('pt-32')) {
    content = content.replace(/pt-32/g, 'pt-40');
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated padding in ${file}`);
    totalUpdated++;
  }
}

console.log(`\nComplete! Updated ${totalUpdated} files.`);
