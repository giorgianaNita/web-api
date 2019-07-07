//load app server using express
const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//accessing everything from public
app.use(express.static('./public'));

//connection to mysql database
function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '******',
        database: 'db_books',
        port: 3306,
        multipleStatements: true
    })
}

//create new entity book
app.post('/book_create',(req, res) => {
    console.log("Add a new book...");
    console.log("Getting the form data");
    //console.log("Title" + req.body.create_title);
    const title = req.body.create_title;
    const author = req.body.create_author;
    const publishing = req.body.create_publishing;
    const year = req.body.create_year;

    const queryString = "INSERT INTO books(title, author, publishing, year) VALUES (?, ?, ?, ?)";
    getConnection().query(queryString, [title, author, publishing, year], (err, results, fields) => {
        if(err){
            console.log("Failed to insert new book:" + err);
            res.sendStatus(500);
            return;
        }
        console.log("Inserted a new book with id: ", results.insertedId);
        res.end();
    })
    // console.log("Author" + req.body.create_author);
    //console.log("Publishing" + req.body.create_publishing);
    // console.log("Year" + req.body.create_title);
    res.end()
});


//get all books sorted by author and title
app.get('/books', (req, res) =>{
    //console.log("Fetching book with id: " + req.params.id);

    const connection = getConnection();
    const queryString = "SELECT * FROM books ORDER BY 2, 1";
    connection.query(queryString,(err, rows, fields) => {
        if(err){
            console.log("Failed to query for books: " + err);
            res.sendStatus(500);
            res.end();
            return
        }
        console.log("Books fetched successfully!");
        res.json(rows)
    })
    //res.end();
});

/*app.get("/books", (req, res) => {
    const book1 = {title: "Shogun", author: "James Clavell", publishing: "Litera", year: 2000};
    const book2 = {title: "Brave New World", author: "Aldous Huxley", publishing: "Penguin Readers", year: 2001};
    res.json([book1, book2]);
    res.send("Nodemon autoupdates when I save this file ");
});
*/

//get book by id
app.get('/book/:id', (req, res) =>{
    console.log("Fetching book with id: " + req.params.id);
    const connection = getConnection();
    const bookId = req.params.id;
    const queryString = "SELECT * FROM books WHERE id = ?";
    connection.query(queryString, [bookId],(err, rows, fields) => {
        if(err){
            console.log("Failed to query for books: " + err);
            res.sendStatus(500);
            res.end();
            return
        }
        console.log("Books fetched successfully!");
        res.json(rows)
    })
    //res.end();
});

//delete a book using Insomnia request DELETE
app.delete('/books/:id', (req, res) =>{
    console.log("Delete book with id: " + req.params.id);
    const connection = getConnection();
    const bookId = req.params.id;
    const queryString = "DELETE FROM books WHERE id = ?";
    connection.query(queryString, [bookId],(err, rows, fields) => {
        if(err){
            console.log("Failed to delete book: " + err);
            res.sendStatus(500);
            res.end();
            return
        }
        console.log("Book deleted successfully!");
        res.json(rows)
    })
});

app.get("/",(req, res) => {
    console.log("Responding to root route");
    res.send("Hello from ROOOT!");
});

//handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send('You are lost!')
});

//handler for 500 error
app.use((err, req, res, next) => {
    console.error(err.stack);
    rest.sendFile(path.join(__dirname,'..public/500.html'))
});

//listen for http requests on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.info('Server has started on ${PORT}');
});