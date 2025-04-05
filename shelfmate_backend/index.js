const express=require("express")
const server=require("./configs/server_config")
const mongoose=require("mongoose")
const db_config=require("./configs/db_config")
const app=express()


app.use(express.json());


/**
 * Database Connection :- 
 */
mongoose.connect(db_config.DB_URL)
.then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error occurred while connecting to the database:", err.message);
  });

/**
 * Stitch to the Server
 */

const authRoutes=require("./routes/auth_route")
authRoutes(app);

const bookRoutes=require("./routes/book_route");
bookRoutes(app);


  

/**
 * Starting the Server
*/
app.listen(server.PORT_NUMBER,()=>{
    console.log("Successfully started at the server PORT NUMBER : ",server.PORT_NUMBER)
})