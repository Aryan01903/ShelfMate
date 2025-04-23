const express=require("express")
const server=require("./configs/server_config")
const mongoose=require("mongoose")
const app=express()


app.use(express.json());


/**
 * Database Connection :- 
 */
mongoose.connect("mongodb+srv://projectdeveloper25:UF7tYSAEJupPIFJb@shelfmatedb.yewqegc.mongodb.net/?retryWrites=true&w=majority&appName=shelfmateDB")
.then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((err) => {
    console.log("Error occurred while connecting to the Database:", err.message);
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