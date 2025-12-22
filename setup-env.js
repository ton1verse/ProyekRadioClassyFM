const fs = require('fs');
fs.writeFileSync('.env', 'DATABASE_URL="mysql://root:@localhost:3306/radio_dashboard"');
console.log('.env created');
