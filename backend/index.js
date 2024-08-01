const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());

// This is the conection code
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'ammar123', 
  database: 'phonebook'
});

// This is to handle mysql queries 
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Routes
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await query('SELECT * FROM contacts');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This is the add function 

app.post('/contacts', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const result = await query('INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)', [name, phone, email]);
    const newContact = { id: result.insertId, name, phone, email };
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This is for updating contact 

app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    try {
      await query('UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?', [name, phone, email, id]);
      res.json({ id, name, phone, email }); // Send updated contact back
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
 // this functuon is for deleting 

app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM contacts WHERE id = ?', [id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To make sure the server is running and it also displays the port it is running on :)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
