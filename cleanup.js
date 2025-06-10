const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://projectdeveloper25:UF7tYSAEJupPIFJb@shelfmatedb.yewqegc.mongodb.net/?retryWrites=true&w=majority&appName=shelfmateDB"; // Update if your URI is different

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", async () => {
  try {
    console.log("Connected to DB");

    const result = await db.collection("books").dropIndex("author_key_1");
    console.log("Index dropped:", result);
  } catch (err) {
    console.error("Failed to drop index:", err.message);
  } finally {
    await mongoose.disconnect();
  }
});
