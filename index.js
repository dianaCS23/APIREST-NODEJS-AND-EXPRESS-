import express from 'express';
import fs, { read } from 'fs';
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json()); //para que entienda el content type que s ela va pasar

//funcion para leer los datos
const readData = () => {
try {
    const data = fs.readFileSync("./db.json") ;
    return JSON.parse(data);
} catch (error) {
    console.log(error);
}
};

//funciones para escribir los datos
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }    

};

//creando los endpoints
app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
  });

  //obtener los libros por id
  app.get("/books/:id", (req, res) => { //atravez de la url pasare el id
    const data = readData();
    const id = parseInt(req.params.id); //params es una propiedad
    const book = data.books.find((book) => book.id === id);
    res.json(book);
  }); 

//POST 
app.post ("/books", (req, res) => {
 const data = readData();
 const body = req.body;
 const newBook = {
    id: data.books.length + 1, //creando el id del nuevo libro
    ...body,
};
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});
  
//Actualizar
app.put("/books/:id", (req,res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id); //params es una propiedad
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({message: "Book updated"});
});

//DELETE
app.delete("/books/:id", (req, res) => {
 const data = readData();
 const id = parseInt(req.params.id);
 const bookIndex = data.books.findIndex((book) => book.id === id);
 data.books.splice(bookIndex, 1);
 writeData(data);
 res.json({ message: "book deleted"});

});


app.listen(3000, () => {//escuchando la funcion
console.log('Server listening');
});   

app.get("/", (req,res) =>{
res.send("Welcome to MyCRUD API, you can test this one with https://node-api-3hh5.onrender.com/books");
})

