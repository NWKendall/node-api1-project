// implement your API here

// 1 .declare express
const express = require("express");

// 2. declare server and port (with server lsiten)
const server = express();

// 3. assign path to database
const database = require("./data/db.js")

// 4. activate JSON parsing
server.use(express.json());

// 5. get all root objects (e.g. users)
// need conditional 
// server.get('/', (req, res) => {
//   res.json({ test: 'WORKING!!!'})
// })

server.get("/api/users", (req, res) => {
  database.find()
  .then(db => {
    // console.log(`this is db`, db)
    res.status(200).json(db)    
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  })
})

// post requests
server.post("/api/users", (req, res) => {
  
  const dbInfo = req.body;

  database.insert(dbInfo)
    .then(db => {
        res.status(201).json(db);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database." }); 
    })
})


// individual id requests (GET)
server.get("/api/users/:id", (req, res) => {
  database.findById(req.params.id)
    .then(db => {
      !db ?
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." }) :
        res.status(200).json(db)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    })
})

// individual id requests (DELETE)
server.delete("/api/users/:id", (req, res) => {
  database.remove(req.params.id)
    .then(removed => {
      !removed ? 
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist."}) :
        res.status(200).json(removed)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed." })
    })
 
})

const port = 5000;
server.listen(port, () => console.log(`Server live on port:`, port))