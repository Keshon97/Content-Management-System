const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
// const consoleTable = require('console.table');




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
  //using inquirer to 
  inquirer.prompt({
    type: 'list',
    name: 'mainMenu',
    choices: [
      'View Departments',
      'View Roles',
      'View Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee',
      'Exit Application',
    ],
    message: 'Please select an option ',

  })
  .then((choice) => {
    //whatever choice the user selects, it will read the associated function
    if (choice.mainMenu === 'Add Department') {
      addDepartment();
    }
    else if (choice.mainMenu === 'Add Role') {
      addRole();
    }
    else if (choice.mainMenu === 'View Departments') {
      viewDepartments();
    }
    else if (choice.mainMenu === 'View Roles') {
      viewRoles();
    }
    else if (choice.mainMenu === 'Add Employee') {
      addEmployee();
    }
    else if (choice.mainMenu === 'View Employees') {
      addEmployee();
    }
   else {
    console.log('Thanks for visiting!')
    process.exit;
   }
  });
}

//get all departments
viewDepartments = () => {
  //grabs all departments from db
  db.query ('Select * FROM department ORDER BY name',
  (err, input) => {
    if(err) {
      console.log(err)
    }
    else {
        console.table(input);
        questions();
    }
  });
}

//view employee roles
viewRoles = () => {
  //grabs all departments from db
  db.query ('Select * FROM role',
  (err, answer) => {
    if(err) {
      console.log(err)
    }
    else {
        console.table(answer);
        questions();
    }
  });
}

//view employee roles
viewEmployees = () => {
  //grabs all departments from db
  db.query ('Select * FROM employee ORDER BY last_name',
  (err, input) => {
    if(err) {
      console.log(err)
    }
    else {
        console.table(input);
        questions();
    }
  });
}


//add a department
addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'newDepartment',
    message: 'Enter the name of the new department',
})
//adds user input into the db
  .then((input => {
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
  }));
}

//add a role
const addRole = async() => {
  //array to hold departments in db
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
    // choices: "What is the employee's Id?",
    //maps over each department and displays them in terminal
    choices: availableDepartments.map((availableDepartment) => {
      return {
        name: availableDepartment.name,
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

//create a new employee
const addEmployee = async () => {
  const [displayRoles] = await db.promise().query('SELECT * FROM role');
 
  inquirer.prompt([
  {
    type: 'input',
    name: 'firstName',
    message: "Employee first name?",
   
  },
  {
    type: 'input',
    message: 'Employee last name?',
    name: 'lastName'
  },
  {
    type: 'list',
    name: 'employeeRoleId',
    message: "Employee's role id?",
    //maps over each role and displays them in terminal, 
    choices: displayRoles.map((displayRole) => {
      return {
        name: displayRole.title,
        value: displayRole.id,
      }
    })
  },
])
  .then((input => {
    // const newEmployee = {role: input.newRole, salary: input.Employee, department: input.availableDepartments}
    db.query(`INSERT INTO employee (first_Name, last_name, role_id) VALUE(?, ?, ?)`, [input.firstName, input.lastName, input.employeeRoleId], 
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
//initialize questions
questions();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

