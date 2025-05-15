import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Manejo de rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a PostgreSQL
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
await db.connect();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Agregar un nuevo libro
app.post("/add-book", async (req, res) => {
    const { title, author } = req.body;
    await db.query("INSERT INTO books (title, author) VALUES ($1, $2)", [title, author]);
    res.status(201).send("Libro agregado");
});

// Obtener todos los libros
app.get("/books", async (_, res) => {
    const result = await db.query("SELECT * FROM books ORDER BY id ASC");
    res.json(result.rows);
});

// **Actualizar un libro**
app.put("/update-book/:id", async (req, res) => {
    const { title, author } = req.body;
    const bookId = req.params.id;

    const result = await db.query("UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *", [title, author, bookId]);

    if (result.rowCount === 0) {
        res.status(404).send("Libro no encontrado");
    } else {
        res.send("Libro actualizado");
    }
});

// **Eliminar un libro**
app.delete("/delete-book/:id", async (req, res) => {
    const bookId = req.params.id;
    const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *", [bookId]);

    if (result.rowCount === 0) {
        res.status(404).send("Libro no encontrado");
    } else {
        res.send("Libro eliminado");
    }
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
