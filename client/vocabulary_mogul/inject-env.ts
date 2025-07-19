const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '../src/environments/environment.ts');
const templatePath = path.resolve(__dirname, '../src/environments/environment.template.ts');

// Replace placeholders with actual environment variables
let fileContent = fs.readFileSync(templatePath, 'utf8');

const replacements = {
  'API_URL': process.env['API_URL'] || '',
  'SUPABASE_URL': process.env['SUPABASE_URL'] || '',
  'SUPABASE_KEY': process.env['SUPABASE_KEY'] || '',
};

Object.entries(replacements).forEach(([key, value]) => {
  fileContent = fileContent.replace(new RegExp(key, 'g'), JSON.stringify(value));
});

// Write the final environment.ts file
fs.writeFileSync(envFilePath, fileContent, 'utf8');
console.log('✅ Environment file generated.');
