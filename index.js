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
    
        }else{
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

// Arrays
var roleChoices = [];
var empChoices = [];
var deptChoices = [];

// Function to lookup role
function lookupRole(){  
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            roleChoices.push(data[i].id + "-" + data[i].title)
        }
     })
}

// Function to lookup Employee
function lookupEmployee(){  
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
        empChoices.push(data[i].id + "-" + data[i].first_name+" "+ data[i].last_name)
         }
    }) 
}
  
// Function to Lookup Departments
function lookupDeptments(){
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
        deptChoices.push(data[i].id + "-" + data[i].name)
    }
  })
}

// Function Add Employee
function addEmployee() {
    
    lookuprole()
    lookupEmployee()

    inquirer.prompt([
    {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?"
    },

    {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?"
    },

    {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices 
        },

        {
        name: "reportingTo",
        type: "list",
        message: "Who is the employee's manager?",
        choices: empChoices
        }

        ]).then(function(answer) {
        var getRoleId =answer.role.split("-")
        var getReportingToId=answer.reportingTo.split("-")
        var query = 
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
        connection.query(query, function(err, res) {
        console.log(`new employee ${answer.firstname} ${answer.lastname} added!`)
        });
        runQuestions();
    });
};

// Function Add Role
function addRole() {
    
    lookuprole()
    lookupEmployee()
    lookupDepts()

    inquirer.prompt([
    {
        name: "role",
        type: "input",
        message: "Enter the role you would like to add:"
    },

    {
        name: "dept",
        type: "list",
        message: "In what department would you like to add this role?",
        choices: deptChoices
    },

    {
        name: "salary",
        type: "number",
        message: "Enter the role's salary:"
    },

        ]).then(function(answer) {
        console.log(`${answer.role}`)
        var getDeptId =answer.dept.split("-")
        var query = 
        `INSERT INTO role (title, salary, department_id)
        VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
        connection.query(query, function(err, res) {
        console.log(`<br>--new role ${answer.role} added!--`)
        });
        runQuestions();
    });
};

// Function Add Department
function addDepartment() {
    
    lookuprole()
    lookupEmployee()
    lookupDepts()

    inquirer.prompt([
    {
        name: "dept",
        type: "input",
        message: "Enter the department you would like to add:"
    }
    ]).then(function(answer) {
        var query = 
        `INSERT INTO department (name)
        VALUES ('${answer.dept}')`;
        connection.query(query, function(err, res) {
        console.log(`--new department added: ${answer.dept}--`)
        });
        runQuestions();
    });
};
