// Use notes route
const notes = require('express').Router();
// Use fs utils from helpers
const { writeToFile } = require('../helpers/fsUtils');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
// Generates random ID value
const uuid = require('../helpers/uuid');

// GET API reads from db.json file and returns all saved nots as JSON
notes.get('/', (req, res) => {
    console.info(`${req.method} request recieved from notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE API removes saved note from recieved query param id
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    console.info(`${req.method} Deleted ${noteId}`);
    
    // Read from db.json file
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Removes note from given id returns new result
            const result = json.filter((note) => note.id !== noteId);

            // Overwrites db.json file with new result
            writeToFile('./db/db.json', result);
            res.json(`Note ${noteId} has been deleted`);
        });
});

// POST API recieves request body and adds to db.json file then returns new note
notes.post('/', (req, res) => {
    console.info(`${req.method} request recieved to add notes`);
    const { title, text } = req.body;
    // Populate request body with given data and generated id;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        // Add newNote to db.json file
        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully');
    } else {
        res.errored('Error in adding note')
    }

});


module.exports = notes;

