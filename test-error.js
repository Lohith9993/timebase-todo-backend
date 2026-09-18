const fs = require('fs');
let content = fs.readFileSync('src/controllers/authController.ts', 'utf8');
content = content.replace(
  "res.status(500).json({ message: 'Server error', error });",
  "console.error('❌ REGISTER ERROR:', error); res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : error });"
);
fs.writeFileSync('src/controllers/authController.ts', content);
console.log('✅ Error logging added successfully!');
