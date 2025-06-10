const User = require("../models/user_model");
const axios = require("axios");
const Book = require("../models/Book");

// Search books using Open Library API
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Fetch from Open Library
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    // Filter and normalize work keys
    const books = response.data.docs
      .filter(book => book.key && book.key.match(/^\/works\/OL[0-9]+W$/))
      .map(book => ({
        ...book,
        work_key: book.key.replace(/^\/works\//, '').toUpperCase(),
      }));

    const workKeys = books.map(book => book.work_key);

    // Fetch average ratings for those books from your DB
    const dbBooks = await Book.find({ work_key: { $in: workKeys } }, 'work_key averageRating');

    // Create a map of work_key => averageRating
    const ratingsMap = {};
    dbBooks.forEach(dbBook => {
      ratingsMap[dbBook.work_key] = dbBook.averageRating;
    });

    // Attach rating to books
    const booksWithRatings = books.map(book => ({
      ...book,
      rating: ratingsMap[book.work_key] ?? null,
    }));

    res.json(booksWithRatings);
  } catch (error) {
    console.error("SearchBooks error:", error.message);
    res.status(500).json({ message: "Error in fetching books" });
  }
};

exports.rateBook = async (req, res) => {
  try {
    let { work_key, rating, review } = req.body;

    if (!work_key || !rating) {
      return res.status(400).json({ message: "Work key and rating are required." });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    // Normalize work_key
    if (work_key.startsWith("/works/")) {
      work_key = work_key.replace(/^\/works\//, '');
    }
    work_key = work_key.trim().toUpperCase();

    if (!/^OL\d+W$/.test(work_key)) {
      return res.status(400).json({
        message: `Invalid OpenLibrary work key format: ${work_key}. Must be like OL12345W`,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    let book = await Book.findOne({ work_key });

    // If book doesn't exist, fetch from Open Library
    if (!book) {
      let bookData;
      try {
        const response = await axios.get(`https://openlibrary.org/works/${work_key}.json`);
        bookData = response.data;
      } catch {
        return res.status(400).json({ message: `Book not found: ${work_key}` });
      }

      let subjects = bookData.subjects || [];

      // Fallback subject fetch
      if (!subjects.length && bookData.title) {
        try {
          const searchResponse = await axios.get(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(bookData.title)}`
          );
          const searchBook = searchResponse.data.docs.find(doc => doc.key === `/works/${work_key}`);
          subjects = searchBook?.subject || ["General"];
        } catch {
          subjects = ["General"];
        }
      }

      let coverImage = "https://via.placeholder.com/150";
      if (bookData.covers?.[0]) {
        coverImage = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-M.jpg`;
      }

      // Fetch full author names
      let authors = [];
      if (Array.isArray(bookData.authors)) {
        for (const authorRef of bookData.authors) {
          try {
            const authorId = authorRef.author?.key?.split('/').pop();
            const authorResponse = await axios.get(`https://openlibrary.org/authors/${authorId}.json`);
            if (authorResponse.data?.name) {
              authors.push(authorResponse.data.name);
            }
          } catch (err) {
            console.warn("Author fetch failed:", err.message);
          }
        }
      }
      if (authors.length === 0) authors = ["Unknown"];

      const openLibraryId = bookData.key?.split("/").pop();
      const authorKey = bookData.authors?.[0]?.author?.key || null;

      book = new Book({
        work_key,
        openLibraryId,
        author_key: authorKey ? authorKey.replace(/^\/authors\//, '') : undefined,
        title: bookData.title || "Unknown Title",
        authors,
        description: typeof bookData.description === "object"
          ? bookData.description.value
          : bookData.description || "No description available",
        coverImage,
        subjects,
        link: `https://openlibrary.org/works/${work_key}`,
        addedBy: user._id,
        ratings: [],
        averageRating: 0,
      });

      await book.save();
    }

    // Add or update user rating
    const existingIndex = book.ratings.findIndex(
      (r) => r.userId.toString() === req.user.id
    );

    if (existingIndex >= 0) {
      book.ratings[existingIndex].rating = rating;
      book.ratings[existingIndex].review = review;
    } else {
      book.ratings.push({
        userId: req.user.id,
        rating,
        review,
      });
    }

    // Update average rating
    const avg = book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length;
    book.averageRating = parseFloat(avg.toFixed(2));

    await book.save();

    res.status(200).json({ message: "Book rated successfully.", book });

  } catch (err) {
    console.error("RateBook error:", err.message);
    res.status(500).json({ message: "Error rating book." });
  }
};
