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
