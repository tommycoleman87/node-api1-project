// implement your API here
const express = require('express');
const db = require('./data/db');
const server = express();
server.use(express.json());

const port = 5000;

server.get('/api/users', (req, res) => {
    db.find().then(result => { res.status(200).json(result) }).catch(err => { res.status(500).json({ error: "The users information could not be retrieved." }) })
});


server.post('/api/users', (req, res) => {
    const user = req.body
    if (user.bio && user.name) {
        db.insert(user).then(result => {
            res.status(201).json(user)
        }).catch(err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" })
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }).catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

server.put('/api/users/:id', (req, res) => {
    const user = req.body;
    const id = req.params.id
    if (user.bio && user.name) {
        db.findById(id)
            .then(result => {
                if (result) {
                    db.update(id, user).then(r => {
                        res.status(200).json(user)
                    })
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
});

server.delete('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then(result => {
        if(result) {
            db.remove(req.params.id)
            .then(r => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "The user could not be removed" })
            })
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
});

server.listen(port, () => {
    console.log(`API listening on ${port}`)
})

