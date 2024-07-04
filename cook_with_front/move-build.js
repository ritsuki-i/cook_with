// move-build.js
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build');
const docsPath = path.join(__dirname, 'docs');

fs.rename(buildPath, docsPath, (err) => {
  if (err) {
    console.error('Failed to move build directory to docs:', err);
  } else {
    console.log('Successfully moved build directory to docs');
  }
});
