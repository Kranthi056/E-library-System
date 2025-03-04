from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests

app = Flask(__name__, static_folder='static')
app.secret_key = "your_secret_key"

# Initialize Firebase
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q="

# 🔥 Homepage
@app.route("/")
def home():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("index.html")

# 🔥 Register Page
@app.route("/register")
def register():
    return render_template("register.html")



# 🔥 Register User
@app.route("/register-user", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        user = auth.create_user(email=email, password=password)
        return jsonify({"message": "User registered successfully!", "user_id": user.uid})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 🔥 Login Page (Dummy for Now)
@app.route("/login")
def login():
    return render_template("login.html")

# 🔥 Login User (Fix for 404)
@app.route("/login-user", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        user = auth.get_user_by_email(email)  # Verify if the user exists
        session["user"] = email  # Store user session
        return jsonify({"message": "Login successful", "email": email})
    except:
        return jsonify({"error": "Invalid email or password"}), 401

# 🔥 Logout Route (Fix for 404)
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

# 🔥 Fetch Books from Google API
@app.route("/get-books")
def get_books():
    query = request.args.get("query", "fiction")  # Default: Fiction books
    response = requests.get(f"{GOOGLE_BOOKS_API}{query}&maxResults=9")
    data = response.json()

    books = []
    for item in data.get("items", []):
        book_info = item["volumeInfo"]
        books.append({
            "title": book_info.get("title", "Unknown"),
            "category": ", ".join(book_info.get("categories", ["Unknown"])),
            "rating": book_info.get("averageRating", "No Rating"),
            "publisher": book_info.get("publisher", "Unknown"),
            "thumbnail": book_info.get("imageLinks", {}).get("thumbnail", ""),
        })
    
    return jsonify(books)

# 🔥 Fetch Categories from API
@app.route("/get-categories")
def get_categories():
    response = requests.get(f"{GOOGLE_BOOKS_API}fiction&maxResults=15")
    data = response.json()

    categories = set()
    for item in data.get("items", []):
        book_info = item["volumeInfo"]
        if "categories" in book_info:
            categories.update(book_info["categories"])
    
    return jsonify(list(categories))


# 🔥 Bookmark a Book
@app.route("/bookmark", methods=["POST"])
def bookmark():
    if "user" not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_email = session["user"]
    data = request.json
    title = data.get("title")

    user_ref = db.collection("users").document(user_email)
    user_data = user_ref.get().to_dict() or {}

    bookmarks = user_data.get("bookmarks", [])
    if title not in bookmarks:
        bookmarks.append(title)
        user_ref.set({"bookmarks": bookmarks})

    return jsonify({"message": f"Book '{title}' bookmarked successfully!"})

# 🔥 Fetch User Bookmarks
@app.route("/get-bookmarks")
def get_bookmarks():
    if "user" not in session:
        return jsonify([])

    user_email = session["user"]
    user_ref = db.collection("users").document(user_email)
    user_data = user_ref.get().to_dict()

    return jsonify(user_data.get("bookmarks", []) if user_data else [])

# 🔥 Remove Bookmark
@app.route("/remove-bookmark", methods=["POST"])
def remove_bookmark():
    if "user" not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_email = session["user"]
    data = request.json
    title = data.get("title")

    user_ref = db.collection("users").document(user_email)
    user_data = user_ref.get().to_dict() or {}

    bookmarks = user_data.get("bookmarks", [])
    if title in bookmarks:
        bookmarks.remove(title)
        user_ref.update({"bookmarks": bookmarks})

    return jsonify({"message": f"Book '{title}' removed from bookmarks!"})

if __name__ == "__main__":
    app.run(debug=True)
