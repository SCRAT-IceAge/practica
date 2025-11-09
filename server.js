/*import express from "express";
import cors from "cors";
import { connection } from "./db.js";

const app = express();
app.use(cors());

app.get("/usuarios", (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener usuarios");
      return;
    }
    res.json(results);
  });
});
const port = 3060;

app.listen(port, () => console.log("Servidor corriendo en http://localhost:3060"));
*/
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

// --- Configurar conexión a la base de datos ---
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "mi_app"
});

connection.connect(err => {
  if (err) console.error("Error al conectar a la base de datos:", err);
  else console.log("Conexión exitosa a MariaDB");
});

// --- Inicializar Express ---
const app = express();
app.use(cors());

// --- Servir archivos estáticos ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// --- Rutas ---
app.get("/usuarios", (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener usuarios");
      return;
    }
    res.json(results);
  });
});
app.use(express.json()); // para que Express entienda JSON enviado desde el front

app.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).send("Faltan datos");
  }

  const sql = "INSERT INTO usuarios (nombre, email) VALUES (?, ?)";
  connection.query(sql, [nombre, email], (err, result) => {
    if (err) {
      console.error("Error al insertar usuario:", err);
      return res.status(500).send("Error al insertar usuario");
    }
    res.json({ id: result.insertId, nombre, email });
  });
});
// --- Eliminar un usuario por su ID ---
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM usuarios WHERE id = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      return res.status(500).send("Error al eliminar usuario");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({ mensaje: "Usuario eliminado correctamente", id });
  });
});


// --- Iniciar servidor ---
const port = 3060;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
