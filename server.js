const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
require('console.table');



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '3V$5Jr!8JQa3GX6p',
    database: 'trackderDb'
  },
  console.log(`Connected to the trackerDb database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
