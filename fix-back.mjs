import fs from 'fs';
import path from 'path';

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let totalUpdated = 0;

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('onClick={onBack}')) {
    content = content.replace(/onClick=\{onBack\}/g, `onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onBack();
              }}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated onBack in ${file}`);
    totalUpdated++;
  }
}

console.log(`\nComplete! Updated ${totalUpdated} files.`);
