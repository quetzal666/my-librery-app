import express from "express";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Conexión a PostgreSQL
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
db.connect();

app.use(express.json());
app.use(express.static("public"));

app.post("/add-book", async (req, res) => {
    const { title, author } = req.body;
    await db.query("INSERT INTO books (title, author) VALUES ($1, $2)", [title, author]);
    res.status(201).send("Libro agregado");
});

app.get("/books", async (_, res) => {
    const result = await db.query("SELECT * FROM books");
    res.json(result.rows);
});

app.put("/update-book/:id", async (req, res) => {
    const { title, author } = req.body;
    await db.query("UPDATE books SET title = $1, author = $2 WHERE id = $3", [title, author, req.params.id]);
    res.send("Libro actualizado");
});

app.delete("/delete-book/:id", async (req, res) => {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.send("Libro eliminado");
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});