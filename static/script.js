// 🔥 Register User
async function registerUser() {
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    let response = await fetch("/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    let result = await response.json();
    alert(result.message || result.error);
    if (response.ok) window.location.href = "/login";
}

// 🔥 Login User
async function loginUser() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    let response = await fetch("/login-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    let result = await response.json();
    alert(result.message || result.error);
    if (response.ok) window.location.href = "/";
}

let currentQuery = "fiction"; 
let startIndex = 0;
const maxResults = 9;

// 🔥 Fetch Books from API
async function fetchBooks(query) {
    currentQuery = query;
    startIndex = 0; // Reset start index when a new category/publication is selected
    document.getElementById("books-title").innerText = `Books - ${query}`;
    document.getElementById("book-list").innerHTML = ""; // Clear previous books
    loadMoreBooks();
}

// 🔥 Load More Books (Fixed)
async function loadMoreBooks() {
    try {
        let response = await fetch(`/get-books?query=${currentQuery}&startIndex=${startIndex}&maxResults=${maxResults}`);
        let books = await response.json();

        let bookList = document.getElementById("book-list");

        books.forEach(book => {
            let div = document.createElement("div");
            div.classList.add("book-card");
            div.innerHTML = `
                <img src="${book.thumbnail}" alt="${book.title}">
                <p><strong>${book.title}</strong></p>
                <p>${book.category}</p>
                <p>⭐ ${book.rating}</p>
                <p>📖 ${book.publisher}</p>
                <button onclick="bookmark('${book.title}')">📌 Bookmark</button>
            `;
            bookList.appendChild(div);
        });

        startIndex += maxResults; // Increase index for next load
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// 🔥 Fetch Books by Publication
function fetchBooksByPublication(publication) {
    fetchBooks(publication);
}


// 🔥 Bookmark a Book
async function bookmark(title) {
    await fetch("/bookmark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    fetchBookmarks();
}


async function fetchBooks(query = "fiction") {
    let response = await fetch(`/get-books?query=${query}`);
    let books = await response.json();

    let bookList = document.getElementById("book-list");
    bookList.innerHTML = "";
    books.forEach(book => {
        let div = document.createElement("div");
        div.classList.add("book-item");
        div.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}">
            <p><strong>${book.title}</strong></p>
            <p>${book.category}</p>
            <p>⭐ ${book.rating}</p>
            <p>📖 ${book.publisher}</p>
            <button onclick="bookmark('${book.title}')">📌 Bookmark</button>
        `;
        bookList.appendChild(div);
    });
}

// Fetch Categories
async function fetchCategories() {
    let response = await fetch("/get-categories");
    let categories = await response.json();

    let categoryList = document.getElementById("categories-list");
    categoryList.innerHTML = "";
    categories.forEach(category => {
        let li = document.createElement("li");
        li.textContent = category;
        li.onclick = () => fetchBooks(category);
        categoryList.appendChild(li);
    });
}

// Search Books
function searchBooks() {
    let query = document.getElementById("search").value;
    fetchBooks(query);
}

// Bookmark
async function bookmark(title) {
    await fetch("/bookmark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    fetchBookmarks();
}

// Fetch Bookmarks
async function fetchBookmarks() {
    let response = await fetch("/get-bookmarks");
    let bookmarks = await response.json();
    let bookmarkList = document.getElementById("bookmarks-list");
    bookmarkList.innerHTML = "";
    bookmarks.forEach(book => {
        let li = document.createElement("li");
        li.innerHTML = `${book} <button onclick="removeBookmark('${book}')">❌</button>`;
        bookmarkList.appendChild(li);
    });
}

// Remove Bookmark
async function removeBookmark(title) {
    await fetch("/remove-bookmark", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    fetchBookmarks();
}

// 🔥 Logout Function (Fix for 404)
function logout() {
    window.location.href = "/logout";
}

// Auto Fetch Books on Page Load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("book-list")) fetchBooks();
    if (document.getElementById("bookmarks-list")) fetchBookmarks();
}); 