document.addEventListener("DOMContentLoaded", async () => {
    await loadBooks();
});

document.getElementById("book-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;

    await fetch("/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
    });

    await loadBooks();
});

async function loadBooks() {
    const response = await fetch("/books");
    const books = await response.json();

    const bookList = document.getElementById("books");
    bookList.innerHTML = "";

    books.forEach(book => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${book.title} - ${book.author}
            <button class="edit" onclick="editBook(${book.id}, '${book.title}', '${book.author}')">✏️</button>
            <button class="delete" onclick="deleteBook(${book.id})">🗑️</button>
        `;
        bookList.appendChild(li);
    });
}

async function editBook(id, title, author) {
    document.getElementById("book-title").value = title;
    document.getElementById("book-author").value = author;

    document.getElementById("book-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        await fetch(`/update-book/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: document.getElementById("book-title").value,
                author: document.getElementById("book-author").value,
            }),
        });

        await loadBooks();
    }, { once: true });
}

async function deleteBook(id) {
    await fetch(`/delete-book/${id}`, { method: "DELETE" });
    await loadBooks();
}