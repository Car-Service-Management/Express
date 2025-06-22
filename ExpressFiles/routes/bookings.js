const db = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const app = express.Router()

// Get Customer Bookings
app.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM bookings WHERE customer_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//Optional: Get All Bookings for Admin (with Joins)
app.get('/bookings', (req, res) => {
  db.query(`
    SELECT 
      b.*, 
      c.name AS customer_name, 
      c.vehicle_model, 
      s.service AS service_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN service_list s ON b.service_id = s.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Bookings - Update
app.put('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status } = req.body;
  db.query(`UPDATE bookings SET customer_id = ?, service_id = ?, service_type = ?, vehicle_no = ?, vehicle_model = ?, booking_date = ?, status = ? WHERE id = ?`,
    [customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking updated' });
    }
  );
});

// Bookings - Delete
app.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Booking deleted' });
  });
});


module.exports = app