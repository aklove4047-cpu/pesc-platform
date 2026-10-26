const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.join(__dirname, '..');
const zipDest = 'C:\\Users\\annu bhai\\Desktop\\Pescouncil\\pesc-platform-source.zip';

// Exclude node_modules, .git, etc.
const ps = `powershell -NoProfile -Command "Get-ChildItem -Path '${sourceDir}' -Exclude 'node_modules','.git','.wrangler' | Compress-Archive -DestinationPath '${zipDest}' -Force"`;
console.log('Creating zip archive...');
execSync(ps, { stdio: 'inherit' });
if (fs.existsSync(zipDest)) {
  console.log('Zip file updated successfully! Size:', (fs.statSync(zipDest).size / 1024 / 1024).toFixed(2), 'MB');
}
