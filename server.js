const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
const consoleTable = require('console.table')




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
    database: 'trackerDb'
  },
  console.log(`Connected to the trackerDb database.`)
);
const questions = () => {
  inquirer.prompt({
    type: 'list',
    name: 'mainMenu',
    choices: [
      'View Departments',
      'View Roles',
      'View Employees',
      'Add Department',
      'Add Role',
      'Update Employee',
      'Exit Application',
    ],
    message: 'Please select an option ',

  })
  .then((choice) => {
    if (choice.mainMenu === 'Add Department') {
      addDepartment();
    }
    else if (choice.mainMenu === 'Add Role') {
      addRole();
    }
   else {
    console.log('Thanks for visiting!')
    process.exit;
   }
  })
}

addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'newDepartment',
    message: 'Enter the name of the new department',
})
  .then(function(input) {
    db.query(`INSERT INTO department (name) VALUE(?)`, 
    input.newDepartment, 
        (err, answer) => {
          if(err) {
            console.log(err)
          }
          else {
              console.table(answer);
              questions();
          }
      });
  });
}

const addRole = async() => {
  const [availableDepartments] = await db.promise().query('SELECT * FROM department')
  inquirer.prompt([
  {
    type: 'input',
    name: 'newRole',
    message: "What is the employee's role",
   
  },
  {
    type: 'input',
    message: "What is the employee's salary",
    name: 'employeeSalary'
  },
  {
    type: 'list',
    name: 'employeeDepartment',
    message: "What is the employee's department?",
    name: 'employeeDepartment',
    // choices: "What is the employee's Id?",
    choices: availableDepartments.map((availableDepartments) => {
      return {
        name: availableDepartments.name,
        value: availableDepartments.id,
      }
    })
  },
])
  .then((input => {
    // const newEmployee = {role: input.newRole, salary: input.Employee, department: input.availableDepartments}
    db.query(`INSERT INTO role (title, salary, department_id) VALUE(?,?, ?)`, [input.newRole, input.employeeSalary, input.employeeDepartment], 
        (err, answer) => {
          if(err) {
            console.log(err)
          }
          else {
              console.table(answer);
              questions();
          }
      });
  }));
}

questions();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

