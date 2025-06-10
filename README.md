# 🧩 ShelfMate Backend

**ShelfMate** is a Node.js and Express REST API for managing book searches, ratings, and reviews using Open Library. It’s the backend for your book recommendation app.

---

## 🧠 Features

- **Search** for books via Open Library.
- **Rate & review** books.
- Full CRUD support for books, users, and reviews.

---

## 🚀 Tech Stack

- **Node.js** + **Express**
- **MongoDB** with Mongoose
- Authentication via **JWT**
- **Axios** for Open Library integration

---


## 🔌 API Endpoints
    
### Book Routes
| Method | Route                        | Description                                  |
| -----: | ---------------------------- | -------------------------------------------- |
|  `GET` | `/api/books/search?q=QUERY`  | Search books via Open Library                |
| `POST` | `/api/books/rate`            | Rate & review a book (requires auth)         |

---

## 🧩 Authentication
Routes requiring authentication read the user's ID from req.user.id (JWT payload). Ensure you protect these routes with an authentication middleware.

---

## 🛠 Run Tests (if available)
-> Add your tests and run with:
npm test


## 📜 License
MIT © Aryan Kumar Shrivastav


## 🙋‍♂️ About
Built by Aryan — feel free to open issues or contribute!


