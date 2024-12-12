const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Configuración de conexión a Oracle
const dbConfig = {
  user: 'ProyectoAdmin',
  password: 'ProyectoAdmin',
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const query = 'SELECT * FROM FIDE_USUARIO_TB WHERE correo = :email AND contrasena = :password';
    const result = await connection.execute(query, [email, password], { outFormat: oracledb.OBJECT });

    await connection.close();

    if (result.rows.length > 0) {
      res.status(200).send(result.rows);
    } else {
      res.status(401).send('Contraseña o correo electrónico incorrecto');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/getAllUsuarios', async (req, res) => {
  try {
    const students = await executeQuery('SELECT NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CORREO FROM FIDE_USUARIO_TB WHERE ID_ESTADO = 1');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/getProducto', async (req, res) => {
  try {
    const inventario = await executeQuery('SELECT NOMBRE, DESCRIPCION, PRECIO FROM FIDE_PRODUCTO_TB WHERE ID_ESTADO = 1');
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/getLocales', async (req, res) => {
  try {
    const inventario = await executeQuery('SELECT NOMBRE, TELEFONO, ID_DIRECCION FROM FIDE_LOCAL_TB WHERE ID_ESTADO = 1');
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getProvedores', async (req, res) => {
  try {
    const inventario = await executeQuery('SELECT NOMBRE, DESCRIPCION, PRECIO FROM FIDE_PRODUCTO_TB WHERE ID_ESTADO = 1');
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getDireccionId/:id', async (req, res) => {
  try {
    const inventario = await executeQuery('SELECT CALLE, NUMERO_CASA, OTRAS_SENAS FROM FIDE_DIRECCION_TB WHERE ID_ESTADO = 1 AND ID_DIRECCION = :id', [req.params.id]);
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/getAllPaises', async (req, res) => {
  try {
    const result = await executeQuery('SELECT ID_PAIS, PAIS FROM FIDE_PAIS_TB');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getAllProvincias', async (req, res) => {
  try {
    const result = await executeQuery('SELECT ID_PROVINCIA, PROVINCIA FROM FIDE_PROVINCIA_TB');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getAllCantones', async (req, res) => {
  try {
    const result = await executeQuery('SELECT ID_CANTON, CANTON FROM FIDE_CANTON_TB');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getAllDistritos', async (req, res) => {
  try {
    const result = await executeQuery('SELECT ID_DISTRITO, DISTRITO FROM FIDE_DISTRITO_TB');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function agregarDireccion(calle, numeroCasa, otrasSenas, idPais, idProvincia, idCanton, idDistrito) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `INSERT INTO FIDE_DIRECCION_TB (ID_DIRECCION, CALLE, NUMERO_CASA, OTRAS_SENAS, ID_PAIS, ID_PROVINCIA, ID_CANTON, ID_DISTRITO)
       VALUES (FIDE_DIRECCION_ID_SEQ.NEXTVAL, :calle, :numeroCasa, :otrasSenas, :idPais, :idProvincia, :idCanton, :idDistrito)
       RETURNING ID_DIRECCION INTO :idDireccion`,
      {
        calle,
        numeroCasa,
        otrasSenas,
        idPais,
        idProvincia,
        idCanton,
        idDistrito,
        idDireccion: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    return result.outBinds.idDireccion[0];
  } catch (err) {
    console.error('Error al agregar dirección:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

app.post('/agregarUsuario', async (req, res) => {
  const { nombre, primerApellido, segundoApellido, correo, telefono, idPais, idProvincia, idCanton, idDistrito, calle, numeroCasa, otrasSenas, contrasena } = req.body;

  let connection;

  try {
    const idDireccion = await agregarDireccion(calle, numeroCasa, otrasSenas, idPais, idProvincia, idCanton, idDistrito);

    connection = await oracledb.getConnection(dbConfig);

    const usuarioQuery = `
      INSERT INTO FIDE_USUARIO_TB (
        NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CORREO, TELEFONO, ID_DIRECCION, CONTRASENA
      ) VALUES (:nombre, :primerApellido, :segundoApellido, :correo, :telefono, :idDireccion, :contrasena)`;
    const usuarioBinds = {
      nombre,
      primerApellido,
      segundoApellido,
      correo,
      telefono,
      idDireccion,
      contrasena,
    };

    await connection.execute(usuarioQuery, usuarioBinds, { autoCommit: true });

    res.status(201).send('Usuario creado exitosamente');
  } catch (err) {
    console.error('Error al agregar usuario:', err);
    res.status(500).send('Error del servidor');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

app.post('/addProducto', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `INSERT INTO FIDE_PRODUCTO_TB (ID_PRODUCTO, NOMBRE, DESCRIPCION, PRECIO, ID_ESTADO)
       VALUES (FIDE_PRODUCTO_ID_SEQ.NEXTVAL, :nombre, :descripcion, :precio, 1)
       RETURNING ID_PRODUCTO, NOMBRE, DESCRIPCION, PRECIO INTO :idProducto, :nombre, :descripcion, :precio`,
      {
        nombre,
        descripcion,
        precio,
        idProducto: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        descripcion: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        precio: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json(result.outBinds);
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).send('Error del servidor');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

app.put('/updateProducto/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `UPDATE FIDE_PRODUCTO_TB
       SET NOMBRE = :nombre, DESCRIPCION = :descripcion, PRECIO = :precio
       WHERE ID_PRODUCTO = :id
       RETURNING ID_PRODUCTO, NOMBRE, DESCRIPCION, PRECIO INTO :idProducto, :nombre, :descripcion, :precio`,
      {
        id,
        nombre,
        descripcion,
        precio,
        idProducto: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        descripcion: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        precio: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(200).json(result.outBinds);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).send('Error del servidor');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});




// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
