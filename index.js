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
          viewrole();
    
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
        else if (answer.action === 'Exit') {
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
function viewrole() {
    connection.query("SELECT * FROM role", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        runQuestions();
        }
    ); 
};

// Function Add Employee
function addEmployee() {
    connection.query('SELECT * FROM role', function(err, result) {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          }, 
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What role does the employee have?",
            choices: function() {
             rolesArray = [];
                result.forEach(result => {
                    rolesArray.push(
                        result.title
                    );
                })
                return rolesArray;
              }
          }
          ]) 
        .then(function(answer) {
        console.log(answer);
        const role = answer.roleName;
        connection.query('SELECT * FROM role', function(err, res) {
            if (err) throw (err);
            let filteredRole = res.filter(function(res) {
                return res.title == role;
            })
        let roleId = filteredRole[0].id;
        connection.query("SELECT * FROM employee", function(err, res) {
                inquirer
                .prompt ([
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is your manager?",
                        choices: function() {
                            managersArray = []
                            res.forEach(res => {
                                managersArray.push(
                                    res.last_name)
                                
                            })
                            return managersArray;
                        }
                    }
                ]).then(function(managerAnswer) {
                    const manager = managerAnswer.manager;
                connection.query('SELECT * FROM employee', function(err, res) {
                if (err) throw (err);
                let filteredManager = res.filter(function(res) {
                return res.last_name == manager;
            })
            let managerId = filteredManager[0].id;
                    console.log(managerAnswer);
                    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    let values = [answer.firstName, answer.lastName, roleId, managerId]
                    console.log(values);
                     connection.query(query, values,
                         function(err, res, fields) {
                         console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                        })
                        viewAllEmployees();
                        })
                     })
                })
            })
        })
    })
};

// Function Add Role
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
          }, 
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
          {
            name: "departmentName",
            type: "list",
            message: "Which department does this role fall under?",
            choices: function() {
                var choicesArray = [];
                res.forEach(res => {
                    choicesArray.push(
                        res.name
                    );
                })
                return choicesArray;
              }
          }
          ]) 
        .then(function(answer) {
        const department = answer.departmentName;
        connection.query('SELECT * FROM DEPARTMENT', function(err, res) {
        
            if (err) throw (err);
         let filteredDept = res.filter(function(res) {
            return res.name == department;
        }
        )
        let id = filteredDept[0].id;
       let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
       let values = [answer.title, parseInt(answer.salary), id]
       console.log(values);
        connection.query(query, values,
            function(err, res, fields) {
            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
        })
        viewrole()
            })
        })
    })
};

// Function Add Department
function addDepartment() {
    inquirer
    .prompt({
        name: "department",
        type: "input",
        message: "What is the name of the new department?",
      })
    .then(function(answer) {
    var query = "INSERT INTO department (name) VALUES ( ? )";
    connection.query(query, answer.department, function(err, res) {
        console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
    })
    viewDepts();
    })
};

// Function Update Role
function updateRole() {
    connection.query('SELECT * FROM employee', function(err, result) {
        if (err) throw (err);
    inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employee's role is changing?",
            choices: function() {
             employeeArray = [];
                result.forEach(result => {
                    employeeArray.push(
                        result.last_name
                    );
                })
                return employeeArray;
              }
          }
          ]) 
        .then(function(answer) {
        console.log(answer);
        const name = answer.employeeName;
        connection.query("SELECT * FROM role", function(err, res) {
                inquirer
                .prompt ([
                    {
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: function() {
                            rolesArray = [];
                            res.forEach(res => {
                                rolesArray.push(
                                    res.title)
                                
                            })
                            return rolesArray;
                        }
                    }
                ]).then(function(rolesAnswer) {
                    const role = rolesAnswer.role;
                    console.log(rolesAnswer.role);
                connection.query('SELECT * FROM role WHERE title = ?', [role], function(err, res) {
                if (err) throw (err);
                    let roleId = res[0].id;
                    let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                    let values = [roleId, name]
                    console.log(values);
                     connection.query(query, values,
                         function(err, res, fields) {
                         console.log(`You have updated ${name}'s role to ${role}.`)
                        })
                        viewAllEmployees();
                        })
                     })
                })
            
            //})
       })
    })
};