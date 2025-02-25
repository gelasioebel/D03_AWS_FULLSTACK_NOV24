// src/database/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define interfaces for database results
interface CountResult {
  count: number;
}

// Sample data for initial database population
const SAMPLE_PLANT_TYPES = [
  'Cactos', 'Suculentas', 'Orquídeas', 'Samambaias', 'Palmeiras',
  'Flores', 'Árvores', 'Trepadeiras', 'Ervas', 'Plantas Aquáticas'
];

const SAMPLE_PLANTS = [
  {
    nome: 'Cacto Mandacaru',
    subtitulo: 'O clássico cacto brasileiro',
    etiquetas: '["indoor", "cacto"]',
    preco: 49.90,
    esta_em_promocao: 0,
    porcentagem_desconto: null,
    caracteristicas: 'Planta resistente, adaptada ao clima seco, crescimento lento, necessita pouca água',
    descricao: 'O Mandacaru é um cacto nativo do Brasil, muito resistente e decorativo. Pode crescer até vários metros de altura em seu habitat natural. Ideal para jardins decorativos e paisagismo.',
    url_imagem: '/images/base-plant.jpg',
    tipo_planta_id: 1
  },
  {
    nome: 'Orquídea Phalaenopsis',
    subtitulo: 'A rainha das orquídeas',
    etiquetas: '["indoor", "orquídea"]',
    preco: 89.90,
    esta_em_promocao: 1,
    porcentagem_desconto: 15.00,
    caracteristicas: 'Flores duradouras, ideal para ambientes internos, necessita de boa iluminação indireta',
    descricao: 'A Phalaenopsis é uma das orquídeas mais populares, conhecida por suas flores duradouras e beleza exótica. Suas flores podem durar até 3 meses com os cuidados adequados.',
    url_imagem: '/images/base-plant.jpg',
    tipo_planta_id: 3
  },
  {
    nome: 'Samambaia Americana',
    subtitulo: 'Elegância e frescor para seu ambiente',
    etiquetas: '["indoor", "samambaia"]',
    preco: 39.90,
    esta_em_promocao: 1,
    porcentagem_desconto: 20.00,
    caracteristicas: 'Adapta-se bem a ambientes internos, prefere locais úmidos e sombreados',
    descricao: 'A Samambaia Americana é uma planta muito versátil e popular, perfeita para decorar ambientes internos. Suas folhas verdes e delicadas trazem um toque de natureza para qualquer espaço.',
    url_imagem: '/images/base-plant.jpg',
    tipo_planta_id: 4
  }
];

// Set up database path
const DB_PATH = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'database', 'plants.db');
console.log(`[Database] Using database at: ${DB_PATH}`);

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  console.log(`[Database] Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection with verbose logging only in development
const isDevEnvironment = process.env.NODE_ENV !== 'production';
const db = new Database(DB_PATH, {
  verbose: isDevEnvironment ? console.log : undefined
});

// Function to initialize database schema
export const initDB = async (): Promise<void> => {
  try {
    console.log('[Database] Initializing database schema...');

    // Load schema SQL from SQL file if it exists
    const schemaPath = path.resolve(process.cwd(), 'database', 'plantasDB.sql');

    if (fs.existsSync(schemaPath)) {
      console.log(`[Database] Loading schema from: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schemaSql);
    } else {
      console.log('[Database] Schema file not found, creating schema programmatically...');
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

        -- Create views
        CREATE VIEW IF NOT EXISTS view_plantas_promocao AS
        SELECT 
            p.*,
            tp.nome as tipo_planta_nome,
            ROUND(p.preco * (1 - p.porcentagem_desconto/100), 2) as preco_promocional
        FROM plantas p
        JOIN tipos_planta tp ON p.tipo_planta_id = tp.id
        WHERE p.esta_em_promocao = true;
      `);
    }

    console.log('[Database] Schema initialized successfully');

    // Seed database with sample data if tables are empty
    await seedDatabaseIfEmpty();

    console.log('[Database] Database initialization complete!');
  } catch (err) {
    console.error('[Database] Error initializing database:', err);
    throw err;
  }
};

// Function to check if tables are empty and seed with sample data if needed
const seedDatabaseIfEmpty = async (): Promise<void> => {
  try {
    // Check if tipos_planta table is empty
    const tiposCount = db.prepare('SELECT COUNT(*) as count FROM tipos_planta').get() as CountResult;

    if (tiposCount.count === 0) {
      console.log('[Database] Seeding plant types...');

      // Insert sample plant types
      const insertTipoStmt = db.prepare('INSERT INTO tipos_planta (nome) VALUES (?)');

      db.transaction(() => {
        SAMPLE_PLANT_TYPES.forEach(tipo => insertTipoStmt.run(tipo));
      })();

      console.log(`[Database] Added ${SAMPLE_PLANT_TYPES.length} plant types`);
    } else {
      console.log(`[Database] Plant types table already contains ${tiposCount.count} records, skipping seed`);
    }

    // Check if plantas table is empty
    const plantasCount = db.prepare('SELECT COUNT(*) as count FROM plantas').get() as CountResult;

    if (plantasCount.count === 0) {
      console.log('[Database] Seeding plants...');

      // Insert sample plants
      const insertPlantaStmt = db.prepare(`
        INSERT INTO plantas (
          nome, subtitulo, etiquetas, preco,
          esta_em_promocao, porcentagem_desconto,
          caracteristicas, descricao,
          url_imagem, tipo_planta_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      db.transaction(() => {
        SAMPLE_PLANTS.forEach(planta => {
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

      console.log(`[Database] Added ${SAMPLE_PLANTS.length} plants`);
    } else {
      console.log(`[Database] Plants table already contains ${plantasCount.count} records, skipping seed`);
    }
  } catch (err) {
    console.error('[Database] Error seeding database:', err);
    throw err;
  }
};

// Export database instance
export default db;