const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// creates connection to sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees_db'
})

connection.connect(function(err){
    if (err) throw err;
    runQuestions();
})

// function to start the list of questions/options
function runQuestions() {
    inquirer
      .prompt({
        name: "selection",
        type: "list",
        message: "What would you like to do?",
        choices: 
          [
              "View All Employees",
              "View Department",
              "View role", 
              "Add Employee",
              "Add Department",
              "Add Role", 
              "Update Role",
              "Quit"
          ]
      })
      .then(function(answer) {
          console.log(answer);
        
        if (answer.selection === "View All Employees") {
          viewAllEmployees();
        }
        else if(answer.selection === "View Department") {
          viewDepts();
    
        } 
        else if(answer.selection === "View role") {
          viewRole();
    
        }
        else if(answer.selection === "Add Employee") {
          addEmployee();
    
        }
        else if(answer.selection === "Add Department") {
          addDepartment();
    
        }
        else if(answer.selection === "Add Role") {
          addRole();
    
        }
        else if(answer.selection === "Update Role") {
          updateRole();
    
        }
        else{
            connection.end();
        }
      });
    }

//View All Employees Function
function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runQuestions();
        }
    );
};
 
// View all Departments
function viewDepts() {
    connection.query("SELECT * FROM department", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runQuestions();
      }
    ); };

// View all Roles Function      
function viewRole() {
    connection.query("SELECT * FROM role", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runQuestions();
        }
    ); 
};

// Function Add Employee
function addEmployee() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's first name",
        name: "firstName"
      },
      {
        type: "input",
        message: "Enter the employee's last name",
        name: "lastName"
      },
      {
        type: "input",
        message: "Enter the employee's role ID",
        name: "addEmployRole"
      },
      {
        type: "input",
        message: "Enter the employee's manager ID",
        name: "addEmployMan"
      }
    ])
    .then(function (res) {
      const firstName = res.firstName;
      const lastName = res.lastName;
      const employRoleID = res.addEmployRole;
      const employManID = res.addEmployMan;
      const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${employRoleID}", "${employManID}")`;
      connection.query(query, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        mainMenu();
      });
    });
};

// Function Add Role
function addRole() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's title",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "Enter the employee's salary",
        name: "roleSalary"
      },
      {
        type: "input",
        message: "Enter the employee's department ID",
        name: "roleDept"
      }
    ])
    .then(function (res) {
      const title = res.roleTitle;
      const salary = res.roleSalary;
      const departmentID = res.roleDept;
      const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`;
      connection.query(query, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        viewRole();
      });
    });
};

// Function Add Department
function addDepartment() {
    inquirer
    .prompt({
      type: "input",
      message: "Enter the name of the new department",
      name: "newDept"
    })
    .then(function (res) {
      const newDepartment = res.newDept;
      const query = `INSERT INTO department (department_name) VALUES ("${newDepartment}")`;
      connection.query(query, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        viewDepts();
      });
    });
};

// Function Update Role
function updateRole() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's ID you want to be updated",
        name: "updateEmploy"
      },
      {
        type: "input",
        message: "Enter the new role ID for that employee",
        name: "newRole"
      }
    ])
    .then(function (res) {
        const updateEmploy = res.updateEmploy;
        const newRole = res.newRole;
        const queryUpdate = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${updateEmploy}"`;
        connection.query(queryUpdate, function (err, res) {
          if (err) {
            throw err;
          }
          console.table(res);
          viewAllEmployees();
        })
    });
};