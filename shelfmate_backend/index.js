const express=require("express")
const server=require("./configs/server_config")
const mongoose=require("mongoose")
const db_config=require("./configs/db_config")
const user_model=require("./models/user_model")


const app=express()


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
 * Starting the Server
*/
app.listen(server.PORT_NUMBER,()=>{
    console.log("Successfully started at the server PORT NUMBER : ",server.PORT_NUMBER)
})