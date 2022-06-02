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
          viewAllEmp();
        }
        else if(answer.selection === "View Department") {
          viewDepts();
    
        } 
        else if(answer.selection === "View role") {
          viewrole();
    
        }
        else if(answer.selection === "Add Employee") {
          addEmployee();
    
        }
        else if(answer.selection === "Add Department") {
          addDept();
    
        }
        else if(answer.selection === "Add Role") {
          addRole();
    
        }
        else if(answer.selection === "Update Role") {
          updateRole();
    
        }else{
          connection.end();
        }
      });
    }

//View All Employees Function
function viewAllEmp() {
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
function viewrole() {
    connection.query("SELECT * FROM role", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runQuestions();
        }
    ); 
};

