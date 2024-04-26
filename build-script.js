const fs = require('fs');
const path = require('path');

function build() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  fs.copyFileSync('accounts.txt', path.join(publicDir, 'accounts.txt'));

  console.log('Build completed successfully.');
}

build();
