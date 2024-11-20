const express = require('express');
const oracledb = require('oracledb');

const app = express();
const PORT = 5000;

// Configuración de conexión a Oracle
const dbConfig = {
  user: 'Usuario',
  password: 'Password',
  connectString: 'localhost/orcl',
};

// Función para ejecutar consultas
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al ejecutar la consulta');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
  }
}

// Rutas
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/inventario', async (req, res) => {
  try {
    const students = await executeQuery('SELECT * FROM INVENTARIO');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
