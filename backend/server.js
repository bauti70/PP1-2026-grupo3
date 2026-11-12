
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/estado', async (req, res) => {
  try {
    const [tablas] = await db.query('SHOW TABLES');

    res.json({
      mensaje: 'Conexión exitosa con MySQL',
      baseDatos: process.env.DB_NAME,
      tablas: tablas
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      mensaje: 'Error al conectar con MySQL',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
