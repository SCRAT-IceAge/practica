import mysql from "mysql2";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",      // tu usuario de MariaDB
  password: "123456",      // tu contraseña
  database: "mi_app"
});

connection.connect(err => {
  if (err) console.error("Error al conectar a la base de datos:", err);
  else console.log("Conexión exitosa a MariaDB");
});
