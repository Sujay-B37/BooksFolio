import express from "express";
import axios from "axios";
import pg from "pg";


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booksfolio",
    password: "password@123",
    port: 5432
});
const app = express();
const port = 3000;

db.connect();


//Middlewares:
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",(req,res) => {
    res.render("index.ejs");
});

app.listen(port,(error) => {
    if(error)   throw error;
    console.log(`App started on port ${port}`);
});