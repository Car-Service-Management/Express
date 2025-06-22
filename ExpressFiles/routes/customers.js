
const db = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const app = express.Router()




// Customer Registration  //OKAY
app.post('/customers/register', (req, res) => {
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;
  db.query(
    `INSERT INTO customers (name, email, phone, password, address, vehicle_model, vehicle_no)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, password, address, vehicle_model, vehicle_no],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Customer registered', id: result.insertId });
    }
  );
});

// Customer Login
app.post('/customers/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM customers WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.json(results[0]);
    res.status(401).json({ message: 'Invalid credentials' });

  });
});

// Customers - Get All //OKAY
app.get('/customers', (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Get Customer Bookings
app.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM bookings WHERE customer_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Customer Bookings with Service Details
app.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  db.query(`
    SELECT 
      b.*, 
      s.service AS service_name, 
      s.description AS service_description
    FROM bookings b
    JOIN service_list s ON b.service_id = s.id
    WHERE b.customer_id = ?
  `, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Customers - Update
app.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;

  db.query(`UPDATE customers SET name = ?, email = ?, phone = ?, password = ?, address = ?, vehicle_model = ?, vehicle_no = ? WHERE id = ?`,
    [name, email, phone, password, address, vehicle_model, vehicle_no, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Customer updated' });
    }
  );
});


// Customers - Delete
app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customers WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Customer deleted' });
  });
});


module.exports = app
