

const db = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const app = express.Router()


// // Feedback - Get All
app.get('/feedback', (req, res) => {
  db.query("SELECT * FROM feedback", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//Get Feedback with Customer & Service Info
app.get('/feedback', (req, res) => {
  db.query(`
    SELECT 
      f.*, 
      c.name AS customer_name, 
      s.service AS service_name 
    FROM feedback f
    JOIN customers c ON f.customer_id = c.id
    JOIN service_list s ON f.service_id = s.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Feedback - Update
app.put('/feedback/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, rating, comments } = req.body;
  db.query(`UPDATE feedback SET customer_id = ?, service_id = ?, rating = ?, comments = ? WHERE id = ?`,
    [customer_id, service_id, rating, comments, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback updated' });
    }
  );
});

/////
app.get('/feedback', (req, res) => {
  db.query(`SELECT f.*, c.name AS customer_name, 
    s.service AS service_name FROM feedback f JOIN customers c ON f.customer_id = c.id JOIN service_list s ON f.service_id = s.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Submit Feedback
app.post('/feedback', (req, res) => {
  const { customer_id, service_id, rating, comments } = req.body;
  db.query(`INSERT INTO feedback (customer_id, service_id, rating, comments) VALUES (?, ?, ?, ?)`,
    [customer_id, service_id, rating, comments],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback submitted', id: result.insertId });
    }
  );
});


// Feedback - Delete
app.delete('/feedback/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM feedback WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Feedback deleted' });
  });
});


module.exports = app
