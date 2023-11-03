const notes = require('express').Router();
const { writeToFile } = require('../helpers/fsUtils');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request recieved from notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    console.info(`${req.method} Deleted ${noteId}`);
    
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id !== noteId);

            writeToFile('./db/db.json', result);

            res.json(`Note ${noteId} has been deleted`);
        });
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request recieved to add notes`);
    console.log(req.body);
    const { title, text } = req.body;
    
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
    
        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully');
    } else {
        res.errored('Error in adding note')
    }

});


module.exports = notes;

