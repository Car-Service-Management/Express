const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "W2_89947_Ajinkya",
    password: "manager",
    database: "car_service_db"
})

module.exports = pool
