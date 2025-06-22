

const db = require("../utils/dbpool")
const {apiSuccess, apiError} = require("../utils/apiresult")
const express = require("express")
const app = express.Router()





//Get Billing with Booking & Customer Info
app.get('/billing', (req, res) => {
  db.query(`
    SELECT bill.id, bill.amount, bill.bill_date, b.service_type, c.name AS customer_name, 
    c.vehicle_no FROM billing bill JOIN bookings b ON bill.booking_id = b.id JOIN customers c ON b.customer_id = c.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add Billing Entry
app.post('/billing', (req, res) => {
  const { booking_id, amount, bill_date } = req.body;
  db.query(`INSERT INTO billing (booking_id, amount, bill_date) VALUES (?, ?, ?)`,
    [booking_id, amount, bill_date],
    (err, result) => {

      if (err) return res.status(500).json(err);
      res.json({ message: 'Billing entry added', id: result.insertId });
    }
  );
});


//Billing - Get All
app.get('/billing', (req, res) => {
  db.query("SELECT * FROM billing", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


module.exports = app