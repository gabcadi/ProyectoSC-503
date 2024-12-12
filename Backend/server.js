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

app.post('/agregarUsuario', async (req, res) => {
  const { nombre, primerApellido, segundoApellido, correo, telefono, idPais, idProvincia, idCanton, idDistrito, calle, numeroCasa, otrasSenas, contrasena } = req.body;

  try {
		const connection = await oracledb.getConnection(dbConfig);

		// Insertar en FIDE_DIRECCION_TB y obtener el ID_DIRECCION generado
		const direccionQuery = `
      INSERT INTO FIDE_DIRECCION_TB (
        ID_PAIS, ID_PROVINCIA, ID_CANTON, ID_DISTRITO, CALLE, NUMERO_CASA, OTRAS_SENAS, ID_ESTADO
      ) VALUES (:idPais, :idProvincia, :idCanton, :idDistrito, :calle, :numeroCasa, :otrasSenas, 1)
      RETURNING ID_DIRECCION INTO :idDireccion`;
		const direccionBinds = {
			idPais,
			idProvincia,
			idCanton,
			idDistrito,
			calle,
			numeroCasa,
			otrasSenas,
			idDireccion: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
		};

		const direccionResult = await connection.execute(direccionQuery, direccionBinds, { autoCommit: true });
		//const idDireccion = direccionResult.outBinds.idDireccion[0];

		// Insertar en FIDE_USUARIO_TB usando el ID_DIRECCION obtenido
		// const usuarioQuery = `
    //   INSERT INTO FIDE_USUARIO_TB (
    //     NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CORREO, TELEFONO, ID_DIRECCION, CONTRASENA
    //   ) VALUES (:nombre, :primerApellido, :segundoApellido, :correo, :telefono, :idDireccion, :contrasena)`;
		// const usuarioBinds = {
		// 	nombre,
		// 	primerApellido,
		// 	segundoApellido,
		// 	correo,
		// 	telefono,
		// 	idDireccion,
		// 	contrasena,
		// };

		await connection.execute(usuarioQuery, usuarioBinds, { autoCommit: true });
		await connection.close();

		res.status(201).send('Usuario creado exitosamente');
  } catch (err) {
		console.error(err);
		res.status(500).send('Error del servidor');
  }
});


// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
