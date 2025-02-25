// backend/src/controller/plantaController.ts
import { Request, Response } from 'express';
import db from '../database/database';

export const getPlantas = (req: Request, res: Response) => {
  try {
    const plantas = db.prepare('SELECT * FROM plantas').all();
    res.status(200).json(plantas);
  } catch (err: any) {
    console.error('Error fetching plants:', err);
    res.status(500).json({ message: 'Error fetching plants', error: err.message });
  }
};

export const getPlantaById = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const planta = db.prepare('SELECT * FROM plantas WHERE id = ?').get(id);

    if (!planta) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.status(200).json(planta);
  } catch (err: any) {
    console.error('Error fetching plant by ID:', err);
    res.status(500).json({ message: 'Error fetching plant', error: err.message });
  }
};

export const addPlanta = (req: Request, res: Response) => {
  const { nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id } = req.body;

  if (!nome || !subtitulo || !etiquetas || !preco || !caracteristicas || !descricao || !url_imagem || !tipo_planta_id) {
    return res.status(400).json({ message: 'Incomplete data. All fields are required.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO plantas (
        nome, subtitulo, etiquetas, preco, 
        esta_em_promocao, porcentagem_desconto, 
        caracteristicas, descricao, 
        url_imagem, tipo_planta_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
        nome,
        subtitulo,
        etiquetas,
        preco,
        esta_em_promocao ? 1 : 0,
        porcentagem_desconto,
        caracteristicas,
        descricao,
        url_imagem,
        tipo_planta_id
    );

    // Use type assertion to handle lastInsertRowid
    const lastId = (info as any).lastInsertRowid;

    res.status(201).json({
      message: 'Plant added successfully!',
      plantId: lastId
    });
  } catch (err: any) {
    console.error('Error adding plant:', err);
    res.status(500).json({ message: 'Error adding plant', error: err.message });
  }
};

export const updatePlanta = (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id } = req.body;

  try {
    // Check if the plant exists
    const exists = db.prepare('SELECT 1 FROM plantas WHERE id = ?').get(id);

    if (!exists) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Update the plant
    const stmt = db.prepare(`
      UPDATE plantas
      SET nome = ?, subtitulo = ?, etiquetas = ?, preco = ?, 
          esta_em_promocao = ?, porcentagem_desconto = ?,
          caracteristicas = ?, descricao = ?, url_imagem = ?, tipo_planta_id = ?
      WHERE id = ?
    `);

    stmt.run(
        nome,
        subtitulo,
        etiquetas,
        preco,
        esta_em_promocao ? 1 : 0,
        porcentagem_desconto,
        caracteristicas,
        descricao,
        url_imagem,
        tipo_planta_id,
        id
    );

    res.status(200).json({ message: 'Plant updated successfully!' });
  } catch (err: any) {
    console.error('Error updating plant:', err);
    res.status(500).json({ message: 'Error updating plant', error: err.message });
  }
};

export const deletePlanta = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the plant exists
    const exists = db.prepare('SELECT 1 FROM plantas WHERE id = ?').get(id);

    if (!exists) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Delete the plant
    db.prepare('DELETE FROM plantas WHERE id = ?').run(id);

    res.status(200).json({ message: 'Plant deleted successfully!' });
  } catch (err: any) {
    console.error('Error deleting plant:', err);
    res.status(500).json({ message: 'Error deleting plant', error: err.message });
  }
};

export const getTiposPlanta = (req: Request, res: Response) => {
  try {
    const tipos = db.prepare('SELECT * FROM tipos_planta').all();
    res.status(200).json(tipos);
  } catch (err: any) {
    console.error('Error fetching plant types:', err);
    res.status(500).json({ message: 'Error fetching plant types', error: err.message });
  }
};