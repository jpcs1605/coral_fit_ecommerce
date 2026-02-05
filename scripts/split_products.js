const fs = require('fs');
const path = require('path');

// Configuração
const INPUT_FILE = path.join(__dirname, '../public/products.json');
const OUTPUT_DIR = path.join(__dirname, '../public');
const ITEMS_PER_FILE = 2; // Altere para o limite desejado

function splitProducts() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error('Arquivo products.json não encontrado:', INPUT_FILE);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const total = products.length;
  const parts = Math.ceil(total / ITEMS_PER_FILE);

  for (let i = 0; i < parts; i++) {
    const start = i * ITEMS_PER_FILE;
    const end = start + ITEMS_PER_FILE;
    const chunk = products.slice(start, end);
    const outFile = path.join(OUTPUT_DIR, `products_${i + 1}.json`);
    fs.writeFileSync(outFile, JSON.stringify(chunk, null, 2));
    console.log(`Arquivo gerado: ${outFile} (${chunk.length} itens)`);
  }

  console.log(`Divisão concluída: ${total} produtos em ${parts} arquivos.`);
}

splitProducts();
