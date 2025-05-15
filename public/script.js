let editingBookId = null; // Variable para almacenar el libro en edición

document.addEventListener("DOMContentLoaded", async () => {
    await loadBooks();
});

document.getElementById("book-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;

    if (editingBookId) {
        // **Actualizar un libro existente**
        await fetch(`/update-book/${editingBookId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
        });

        editingBookId = null; // Resetear la edición después de actualizar
        document.querySelector("button[type='submit']").textContent = "Agregar Libro"; // Restaurar el botón
    } else {
        // **Agregar un nuevo libro**
        await fetch("/add-book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
        });
    }

    document.getElementById("book-form").reset(); // Limpiar el formulario
    await loadBooks(); // Recargar la lista de libros
});

async function loadBooks() {
    const response = await fetch("/books");
    const books = await response.json();

    const bookList = document.getElementById("books");
    bookList.innerHTML = ""; // Limpiar la lista antes de agregar los libros

    books.forEach(book => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${book.title} - ${book.author}</span>
            <button class="edit" onclick="editBook(${book.id}, '${book.title}', '${book.author}')">✏️ Editar</button>
            <button class="delete" onclick="deleteBook(${book.id})">🗑️ Eliminar</button>
        `;
        bookList.appendChild(li);
    });
}

function editBook(id, title, author) {
    document.getElementById("book-title").value = title;
    document.getElementById("book-author").value = author;

    editingBookId = id; // Guardar el ID del libro en edición
    document.querySelector("button[type='submit']").textContent = "Actualizar Libro"; // Cambiar el botón
}

async function deleteBook(id) {
    await fetch(`/delete-book/${id}`, { method: "DELETE" });
    await loadBooks();
}
