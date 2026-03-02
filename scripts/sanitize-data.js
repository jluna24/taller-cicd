import fs from 'fs';
import Papa from 'papaparse';

// Lee el CSV original
const csvPath = process.argv[2] || './aws-user-group-ensenada_0547191f-e04b-4979-866c-519bf600de79_group_members.csv';
const outputPath = process.argv[3] || './public/members.csv';

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const parsed = Papa.parse(csvContent, { header: true });

// Sanitiza los datos
const sanitized = parsed.data.map((row, index) => {
  // Extraer solo el primer nombre (antes del primer espacio)
  const firstName = row.Name ? row.Name.split(' ')[0] : `Member ${index + 1}`;
  
  return {
    'Name': firstName,
    
    // Mantener campos necesarios para estadísticas
    'Location': row.Location || '',
    'Joined Group on': row['Joined Group on'] || '',
    'Last Attended': row['Last Attended'] || '',
    'All time RSVPs': row['All time RSVPs'] || '0',
    'All time \'Yes\' RSVPs': row['All time \'Yes\' RSVPs'] || '0',
    'All time \'No\' RSVPs': row['All time \'No\' RSVPs'] || '0',
    'Events attended': row['Events attended'] || '0',
    'No shows': row['No shows'] || '0',
    'Role': row.Role || 'MEMBER',
    
    // Eliminar campos sensibles
    // 'Title': '',
    // 'Member ID': '',
    // 'Last visited group on': '',
    // 'Intro': '',
    // 'Photo': '',
    // 'URL of Member Profile': ''
  };
});

// Genera el CSV sanitizado
const sanitizedCsv = Papa.unparse(sanitized);

// Escribe el archivo
fs.writeFileSync(outputPath, sanitizedCsv, 'utf-8');

console.log(`✅ Datos sanitizados guardados en: ${outputPath}`);
console.log(`📊 Total de registros: ${sanitized.length}`);
console.log(`\n⚠️  Recuerda añadir el CSV original al .gitignore`);
