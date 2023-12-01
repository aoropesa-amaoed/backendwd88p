import express, { request, response } from "express";
import morgan from "morgan";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

morgan.token("body", function(request, response){
    return JSON.stringify(request.body);
});


app.use(cors);
app.use(express.json()); //understand json
// app.use(logger); // convert it to middleware
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true,
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        important: false,
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP",
        important: true,
    },
    {
        id: 4,
        content: "Express JS is awesome",
        important: false,
    },
];

//HTTP Methods: GET, POST, DELETE, PUT, PATCH
//RESTful API
/*
   URL             verb     functionality
   notes            GET      fetches all resources in the collection
    notes/:id       GET     fetches a single resource
    notes           POST    creates a new resource based on the request data
    notes/:id       DELETE  removes the identified resource
    notes/:id       PUT     replaces the entire identified  resource
    notes/:id       PATCH   replaces a part of the identified resource
*/

// function logger(request, response, next){
//     console.log(`Method: ${request.method}`);
//     console.log(`Path: ${request.path}`);
//     console.log(`Body: ${JSON.stringify(request.body)}`);
//     console.log("----------------------");
//     next();
// };

function unknownEndPoint(request, response){
    return request.status(404).send({error:"unknown endpoint"});
}

function generateId(){
    const  maxId = notes.length > 0 ? Math.max(...notes.map(n=>n.id)):0;
    return maxId + 1; 
};

app.get("/",(request,response)=>{
    return response.send("<h1>Hello from NodeJS!</h1>");
});

app.get("/notes",(request, response)=>{
    return response.json(notes);
});

app.get("/notes/:id",(request, response)=>{
    const id = Number(request.params.id);
    const note = notes.find(note => note.id===id);
    return response.json(note);
});

app.delete("/notes/:id",(request, response)=>{
    const id = Number(request.params.id);
    notes = notes.filter((note)=>note.id !==id);

    return response.status(204).end();
});

app.post("/notes",(request, response)=>{
    
    const body = request.body;

    if(!body.content){
        return response.status(400).json({error:"content missing"});    
    }    

   const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
   }
   notes = notes.concat(note);

    return response.status(201).json(note);
});

app.use(unknownEndPoint);

app.listen(PORT, ()=>{
    console.log(`Server is now running on port ${PORT}`);   
});
