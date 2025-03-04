E-Library System:

Problem Statement:
Access to books is essential for students, researchers, and book lovers, but existing e-library platforms often lack a centralized and user-friendly system for searching, saving, and managing books. Users may struggle to keep track of interesting books or find them again later. Additionally, authentication and data storage solutions should be secure and scalable for managing user preferences effectively.

Proposed Solution:
The E-Library System is a web-based platform that allows users to search for books and bookmark their favorites for easy access later. It leverages the Google Books API for discovering a vast collection of books. Users can sign up and log in securely using Firebase Authentication, while Firebase Firestore is used for storing bookmarked books. The Flask backend manages API requests, authentication, and database interactions, while the frontend (HTML5, CSS3, and ES6) ensures a seamless and responsive user experience.

Key Features:
Book Search & Discovery

Users can search for books by title, author, or category using the Google Books API.
Displays book details such as author, description, and cover image.
User Authentication & Management

Secure login and signup system using Firebase Authentication.
Each user has a personalized experience with saved bookmarks.
Bookmark & Remove Books

Users can bookmark books to save them for later reading.
Provides an option to remove books from bookmarks anytime.
Bookmarked books are stored in Firebase Firestore for easy retrieval.
Responsive Web Design

Built with HTML5, CSS3, and ES6, ensuring a mobile-friendly and intuitive interface.
Modern UI for smooth navigation and enhanced user experience.
Flask Backend & API Integration

Handles API requests between the frontend and Google Books API.
Manages user sessions and Firebase interactions.
Firebase Integration

Firestore Database to store bookmarked books.
Firebase Authentication for secure user login and account management.
Technology Stack:
Frontend: HTML5, CSS3, ES6 (JavaScript)
Backend: Flask (Python)
Database & Authentication: Firebase (Firestore & Authentication)
External API: Google Books API
