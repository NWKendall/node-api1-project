const express = require("express");
const server = express();
const database = require("./data/db.js")
server.use(express.json());

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
  
  const { name, bio } = req.body;
  
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." }) 
  } else {
      database.insert(req.body)
      .then(({ id }) => {
        database.findById(id)
          .then(newUser => {
            res.status(201).json(newUser)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database." });
          })       
      .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." }); 
      })
   })
  }
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


// PUT requests
server.put("/api/users/:id", (req, res) => {
  const updateUser = req.body;
  database.update(req.params.id, updateUser)
    .then(edit => {
      ! edit ? res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })  
      // : edit ? res.status(400).json({ errorMessage: "Please provide name and bio for the user." })       
      : res.status(200).json(edit);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user information could not be modified." })
    })
})

const port = 5000;
server.listen(port, () => console.log(`Server live on port:`, port))