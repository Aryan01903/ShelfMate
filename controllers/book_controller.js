const User = require("../models/user_model");
const axios = require("axios"); // Used for making HTTP requests (API calls)
const Book = require("../models/Book");

exports.searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        res.json(response.data.docs);
    } catch (error) {
        res.status(500).send({
            message: "Error in fetching books"
        });
    }
};

exports.rateBook = async (req, res) => {
    try {
        const { bookId, rating } = req.body;

        // Ensure bookId and rating are provided
        if (!bookId || !rating) {
            return res.status(400).send({ message: "BookId and Rating are required." });
        }

        // Find the user from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the user has already rated this book
        const existingRating = user.ratedBooks.find(ratedBook => ratedBook.bookId.toString() === bookId);
        
        if (existingRating) {
            // If the book is already rated, update the rating
            existingRating.rating = rating;
            await user.save();
            return res.json({ message: "Book rating updated successfully" });
        }

        // If it's a new rating, add to the ratedBooks array
        user.ratedBooks.push({ bookId, rating });
        await user.save();

        return res.json({ message: "Book rated successfully" });

    } catch (error) {
        console.error("Error in rating book:", error);
        return res.status(500).send({ message: "Error in rating book" });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        // Get the current user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        // Get all rated book IDs from the user
        const ratedBookIds = user.ratedBooks.map(rb => rb.bookId);
        console.log("Rated Book IDs:", ratedBookIds); // Debug: Check rated book IDs

        // If user hasn't rated any books, fetch popular/top-rated books
        if (ratedBookIds.length === 0) {
            console.log("No rated books. Fetching top-rated books instead.");
            const response = await axios.get('https://openlibrary.org/subjects/best_sellers.json?limit=10');
            return res.status(200).send({
                message: "No rated books found. Here are some top-rated books:",
                recommendations: response.data.works
            });
        }

        // Fetch the books from the database based on rated book IDs
        const ratedBooks = await Book.find({ _id: { $in: ratedBookIds } });
        console.log("Rated Books:", ratedBooks); // Debug: Check if books are fetched correctly

        // Collect all subjects from the rated books
        let allSubjects = [];
        ratedBooks.forEach(book => {
            allSubjects = allSubjects.concat(book.subjects);
        });
        console.log("All Subjects:", allSubjects); // Debug: Check subjects

        // Handle the case where no subjects are found
        if (allSubjects.length === 0) {
            console.log("No subjects found in rated books. Showing generic recommendations.");
            const response = await axios.get('https://openlibrary.org/subjects/best_sellers.json?limit=10');
            return res.status(200).send({
                message: "No subjects found in rated books. Here are some top-rated books:",
                recommendations: response.data.works,
            });
        }

        // Get the most common subject from the rated books
        const subjectCounts = {};
        allSubjects.forEach(subject => {
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
        const topSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0][0];
        console.log("Top Subject:", topSubject); // Debug: Check the most common subject

        // Fetch books from Open Library based on the top subject
        const response = await axios.get(`https://openlibrary.org/subjects/${encodeURIComponent(topSubject.toLowerCase())}.json?limit=10`);
        console.log("Open Library Response:", response.data); // Debug: Check Open Library response

        // Send the recommended books to the user
        return res.status(200).send({
            message: `Recommended books based on your interest in '${topSubject}'`,
            recommendations: response.data.works,
        });

    } catch (error) {
        console.error("Recommendation Error:", error.message);
        res.status(500).send({
            message: "Error fetching recommendations"
        });
    }
};
