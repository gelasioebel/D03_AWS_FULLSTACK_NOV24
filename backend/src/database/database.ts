// backend/src/database/database.ts (updated with type assertions)
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define interfaces for our database results
interface CountResult {
  count: number;
}

// Ensure the database directory exists
const dbDir = path.resolve(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create the database path
const dbPath = path.resolve(dbDir, 'plants.db');
console.log('Database path:', dbPath);

// Initialize database connection
const db = new Database(dbPath, { verbose: console.log });

// Function to initialize the database schema
export const initDB = () => {
  try {
    // Create tables
    db.exec(`
      -- Criação da tabela de tipos de planta
      CREATE TABLE IF NOT EXISTS tipos_planta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Criação da tabela de plantas
      CREATE TABLE IF NOT EXISTS plantas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        subtitulo VARCHAR(200) NOT NULL,
        etiquetas TEXT NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        esta_em_promocao BOOLEAN DEFAULT FALSE,
        porcentagem_desconto DECIMAL(5,2),
        caracteristicas TEXT NOT NULL,
        descricao TEXT NOT NULL,
        url_imagem VARCHAR(255) NOT NULL,
        tipo_planta_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_planta_id) REFERENCES tipos_planta(id) ON DELETE CASCADE
      );

      -- Create triggers
      CREATE TRIGGER IF NOT EXISTS tipos_planta_updated_at
      AFTER UPDATE ON tipos_planta
      FOR EACH ROW
      BEGIN
        UPDATE tipos_planta 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = old.id;
      END;

      CREATE TRIGGER IF NOT EXISTS plantas_updated_at
      AFTER UPDATE ON plantas
      FOR EACH ROW
      BEGIN
        UPDATE plantas 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = old.id;
      END;

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_plantas_tipo_planta_id ON plantas(tipo_planta_id);
      CREATE INDEX IF NOT EXISTS idx_plantas_esta_em_promocao ON plantas(esta_em_promocao);
      CREATE INDEX IF NOT EXISTS idx_plantas_preco ON plantas(preco);
    `);

    console.log('Database schema initialized successfully');
    checkAndInsertSampleData();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Function to check and insert sample data
const checkAndInsertSampleData = () => {
  try {
    // Check if tipos_planta table is empty
    const tiposCount = db.prepare('SELECT COUNT(*) as count FROM tipos_planta').get() as CountResult;

    if (tiposCount.count === 0) {
      // Insert sample plant types
      const insertTipoStmt = db.prepare('INSERT INTO tipos_planta (nome) VALUES (?)');

      const tiposPlanta = ['Cactos', 'Suculentas', 'Orquídeas', 'Samambaias', 'Palmeiras'];

      db.transaction(() => {
        tiposPlanta.forEach(tipo => insertTipoStmt.run(tipo));
      })();

      console.log('Sample plant types inserted successfully');
    }

    // Check if plantas table is empty
    const plantasCount = db.prepare('SELECT COUNT(*) as count FROM plantas').get() as CountResult;

    if (plantasCount.count === 0) {
      // Insert sample plants
      const insertPlantaStmt = db.prepare(`
        INSERT INTO plantas (
          nome, subtitulo, etiquetas, preco,
          esta_em_promocao, porcentagem_desconto,
          caracteristicas, descricao,
          url_imagem, tipo_planta_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const plantasSample = [
        {
          nome: 'Cacto Mandacaru',
          subtitulo: 'O clássico cacto brasileiro',
          etiquetas: '["cacto", "nativo", "decorativo"]',
          preco: 49.90,
          esta_em_promocao: 0,
          porcentagem_desconto: null,
          caracteristicas: 'Planta resistente, adaptada ao clima seco',
          descricao: 'O Mandacaru é um cacto nativo do Brasil',
          url_imagem: 'https://example.com/cacto.jpg',
          tipo_planta_id: 1
        },
        {
          nome: 'Orquídea Phalaenopsis',
          subtitulo: 'A rainha das orquídeas',
          etiquetas: '["orquídea", "flores", "delicada"]',
          preco: 89.90,
          esta_em_promocao: 1,
          porcentagem_desconto: 15.00,
          caracteristicas: 'Flores duradouras, ideal para ambientes internos',
          descricao: 'A Phalaenopsis é uma das orquídeas mais populares',
          url_imagem: 'https://example.com/orquidea.jpg',
          tipo_planta_id: 3
        }
      ];

      db.transaction(() => {
        plantasSample.forEach(planta => {
          insertPlantaStmt.run(
              planta.nome,
              planta.subtitulo,
              planta.etiquetas,
              planta.preco,
              planta.esta_em_promocao,
              planta.porcentagem_desconto,
              planta.caracteristicas,
              planta.descricao,
              planta.url_imagem,
              planta.tipo_planta_id
          );
        });
      })();

      console.log('Sample plants inserted successfully');
    }
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
};

// Initialize the database
initDB();

// Export the database connection
export default db;