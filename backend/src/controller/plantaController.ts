// backend/src/controller/plantaController.ts
import { Request, Response } from 'express';
import db from '../database/database';  // Updated import path

export const getPlantas = async (req: Request, res: Response) => {
  const query = `
    SELECT * FROM plantas;
  `;

  try {
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(rows);
  } catch (err: any) {
    console.error('Error fetching plants:', err);
    res.status(500).json({ message: 'Error fetching plants', error: err.message });
  }
};

export const getPlantaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM plantas WHERE id = ?;
  `;

  try {
    const planta = await new Promise<any>((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!planta) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.status(200).json(planta);
  } catch (err: any) {
    console.error('Error fetching plant by ID:', err);
    res.status(500).json({ message: 'Error fetching plant', error: err.message });
  }
};

export const addPlanta = (req: Request, res: Response): void => {
  const { nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id } = req.body;

  if (!nome || !subtitulo || !etiquetas || !preco || !caracteristicas || !descricao || !url_imagem || !tipo_planta_id) {
    res.status(400).json({ message: 'Incomplete data. All fields are required.' });
    return;
  }

  const query = `
    INSERT INTO plantas (nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id], function(err) {
    if (err) {
      console.error('Error adding plant:', err);
      res.status(500).json({ message: 'Error adding plant', error: err.message });
      return;
    }

    res.status(201).json({
      message: 'Plant added successfully!',
      plantId: this.lastID
    });
  });
};

export const updatePlanta = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { nome, subtitulo, etiquetas, preco, esta_em_promocao, porcentagem_desconto, caracteristicas, descricao, url_imagem, tipo_planta_id } = req.body;

  // Check if the plant exists
  db.get('SELECT * FROM plantas WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error checking if plant exists:', err);
      res.status(500).json({ message: 'Error updating plant', error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ message: 'Plant not found' });
      return;
    }

    // Update the plant
    const query = `
      UPDATE plantas
      SET nome = ?, subtitulo = ?, etiquetas = ?, preco = ?, 
          esta_em_promocao = ?, porcentagem_desconto = ?,
          caracteristicas = ?, descricao = ?, url_imagem = ?, tipo_planta_id = ?
      WHERE id = ?
    `;

    db.run(query, [
      nome, subtitulo, etiquetas, preco,
      esta_em_promocao, porcentagem_desconto,
      caracteristicas, descricao, url_imagem, tipo_planta_id,
      id
    ], function(err) {
      if (err) {
        console.error('Error updating plant:', err);
        res.status(500).json({ message: 'Error updating plant', error: err.message });
        return;
      }

      res.status(200).json({ message: 'Plant updated successfully!' });
    });
  });
};

export const deletePlanta = (req: Request, res: Response): void => {
  const { id } = req.params;

  // Check if the plant exists
  db.get('SELECT * FROM plantas WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error checking if plant exists:', err);
      res.status(500).json({ message: 'Error deleting plant', error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ message: 'Plant not found' });
      return;
    }

    // Delete the plant
    db.run('DELETE FROM plantas WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting plant:', err);
        res.status(500).json({ message: 'Error deleting plant', error: err.message });
        return;
      }

      res.status(200).json({ message: 'Plant deleted successfully!' });
    });
  });
};

// Get plant types for dropdowns
export const getTiposPlanta = async (req: Request, res: Response) => {
  const query = `
    SELECT * FROM tipos_planta;
  `;

  try {
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    res.status(200).json(rows);
  } catch (err: any) {
    console.error('Error fetching plant types:', err);
    res.status(500).json({ message: 'Error fetching plant types', error: err.message });
  }
};