const express = require('express');
const makeConnection = require('./dbConfig');
const cors = require('cors');

require('dotenv').config();

/// make connection to database
const db = makeConnection();
const app = express();
app.use(express.json());
app.use(cors());

/// get port
const port = process.env.PORT || 3000;


// rotes for crud
app.get('/notes', (req, res) => {
  db.query('select * from notes', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});

app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.query('select  * from notes where id = ?', [noteId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(results[0]); 
  });
});


app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.query('insert into notes (title, content) values (?, ?)', [title, content], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ id: result.insertId, title, content, message:"note created." });
  });
});

app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.query('update notes set title = ?, content = ? where id = ?', [title, content, noteId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json({ message: 'Note updated successfully' });
  });
});

app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  db.query('delete from notes where id = ?', [noteId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found'});
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




