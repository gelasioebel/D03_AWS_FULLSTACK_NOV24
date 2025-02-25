// backend/src/database/database.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the database directory exists
const dbDir = path.resolve(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create the database path
const dbPath = path.resolve(dbDir, 'plants.db');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to database at:', dbPath);
  }
});

export const initDB = () => {
  const sql = `
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

    -- Trigger para atualizar updated_at em tipos_planta
    CREATE TRIGGER IF NOT EXISTS tipos_planta_updated_at
    AFTER UPDATE ON tipos_planta
    FOR EACH ROW
    BEGIN
      UPDATE tipos_planta 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = old.id;
    END;

    -- Trigger para atualizar updated_at em plantas
    CREATE TRIGGER IF NOT EXISTS plantas_updated_at
    AFTER UPDATE ON plantas
    FOR EACH ROW
    BEGIN
      UPDATE plantas 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = old.id;
    END;

    -- Criação de índices para melhor performance
    CREATE INDEX IF NOT EXISTS idx_plantas_tipo_planta_id ON plantas(tipo_planta_id);
    CREATE INDEX IF NOT EXISTS idx_plantas_esta_em_promocao ON plantas(esta_em_promocao);
    CREATE INDEX IF NOT EXISTS idx_plantas_preco ON plantas(preco);
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Error initializing database:', err.message);
    } else {
      console.log('Database schema initialized successfully');

      // Insert sample data if tables are empty
      checkAndInsertSampleData();
    }
  });
};

const checkAndInsertSampleData = () => {
  // Check if tipos_planta table is empty
  db.get('SELECT COUNT(*) as count FROM tipos_planta', [], (err, row) => {
    if (err) {
      console.error('Error checking tipos_planta table:', err.message);
      return;
    }

    if (row.count === 0) {
      // Insert sample tipos_planta
      const tiposSQL = `
        INSERT INTO tipos_planta (nome) VALUES
          ('Cactos'),
          ('Suculentas'),
          ('Orquídeas'),
          ('Samambaias'),
          ('Palmeiras');
      `;

      db.exec(tiposSQL, (err) => {
        if (err) {
          console.error('Error inserting sample tipos_planta:', err.message);
        } else {
          console.log('Sample plant types inserted successfully');

          // Now insert sample plantas
          db.get('SELECT COUNT(*) as count FROM plantas', [], (err, row) => {
            if (err) {
              console.error('Error checking plantas table:', err.message);
              return;
            }

            if (row.count === 0) {
              const plantasSQL = `
                INSERT INTO plantas (nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id)
                VALUES 
                ('Cacto Mandacaru', 'O clássico cacto brasileiro', '["cacto", "nativo", "decorativo"]', 49.90, false, null, 'Planta resistente, adaptada ao clima seco', 'O Mandacaru é um cacto nativo do Brasil', 'https://example.com/cacto.jpg', 1),
                ('Orquídea Phalaenopsis', 'A rainha das orquídeas', '["orquídea", "flores", "delicada"]', 89.90, true, 15.00, 'Flores duradouras, ideal para ambientes internos', 'A Phalaenopsis é uma das orquídeas mais populares', 'https://example.com/orquidea.jpg', 3);
              `;

              db.exec(plantasSQL, (err) => {
                if (err) {
                  console.error('Error inserting sample plantas:', err.message);
                } else {
                  console.log('Sample plants inserted successfully');
                }
              });
            }
          });
        }
      });
    }
  });
};

// Initialize the database
initDB();

// Export the database connection
export default db;