USE employees_db;

INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, null),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, null),
       (4, "Kevin", "Tupik", 4, 3),
       (5, "Kunal", "Singh", 5, null),
       (6, "Malia", "Brown", 6, 5),
       (7, "Sarah", "Lourd", 7, null),
       (8, "Tom", "Allen", 8, 7);