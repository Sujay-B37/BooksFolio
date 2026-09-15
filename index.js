import express from "express";
import axios from "axios";
import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
const app = express();
const port = 3000;


db.connect();

let booksl = [];
let curr_filter = 'book.title';

async function getBooks() {
    try{
        let result = await db.query(`select * from book join review on book.isbn = review.isbn order by ${curr_filter}`);
        booksl = result.rows;
    }catch(e1){
        console.log(e1);
        console.log("Failed to fetch data from db");
    }
}

//Middlewares:
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/f_recency", async(req,res) => {
    curr_filter = 'review.l_date desc';
    res.redirect("/");
});

app.get("/f_rating", async(req,res) => {
    curr_filter = 'review.rating desc';
    res.redirect("/");
});

app.get("/f_title", async(req,res) => {
    curr_filter = 'book.title';
    res.redirect("/");
});

app.get("/", async(req,res) => {
    await getBooks();
    res.render("index.ejs",{books:booksl});
});

app.get("/new",(req,res) => {
    res.render("new.ejs");
});

app.post("/create", async(req,res) => {
    let isbn = Number(req.body.isbn);
    let title = req.body.title,author = req.body.author;
    let notes = req.body.desc,rating=req.body.rating;
    try{
        await db.query("insert into book values($1,$2,$3)",
            [isbn,title,author]
        );
        await db.query("insert into review values($1,$2,$3,$4)",
            [isbn,rating,notes,new Date()]
        );
    }catch(e1){
        console.log(e1);
        console.log("Failed to insert data into db");
    }
    res.redirect("/");
});

app.post("/del", async(req,res) => {
    let isbn = req.body.getid;
    try{
        await db.query("delete from review where isbn=$1",[isbn]);
        await db.query("delete from book where isbn=$1",[isbn]);
    }catch(e1){
        console.log(e1);
        console.log("Failed to delete data in db");
    }
    res.redirect("/");
});

app.post("/patch_changes", async(req,res) => {
    let isbn = Number(req.body.isbn);
    let title = req.body.title,author = req.body.author;
    let notes = req.body.desc,rating=req.body.rating;
    try{
        await db.query("delete from review where isbn=$1",[isbn]);
        await db.query("delete from book where isbn=$1",[isbn]);

        await db.query("insert into book values($1,$2,$3)",
            [isbn,title,author]
        );
        await db.query("insert into review values($1,$2,$3,$4)",
            [isbn,rating,notes,new Date()]
        );
    }catch(e1){
        console.log(e1);
        console.log("Failed to alter data in db");
    }
    res.redirect("/");
});

app.post("/edit", (req,res) => {
    let b1 = booksl.find((b) => {return +(b.isbn) == +(req.body.getid)});
    res.render("edit.ejs",{book:b1});
});

app.listen(port,(error) => {
    if(error)   throw error;
    console.log(`App started on port ${port}`);
});

//2013-01-01 08:45:00