import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(process.cwd(), 'knowledge');
const destDir = path.resolve(process.cwd(), 'dist', 'knowledge');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log(`Copied knowledge base to ${destDir}`);
} else {
  console.warn('Knowledge base directory not found, skipping copy');
}
