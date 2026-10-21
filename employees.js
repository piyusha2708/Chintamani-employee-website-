const express = require("express");
const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");

const router = express.Router();


// ======================================================
// GET ALL EMPLOYEES
// ======================================================

router.get("/", async (req, res) => {

    try {

        const employees =
            await Employee.find()
                .select("-password")
                .sort({
                    createdAt: -1
                });


        res.json({
            employees: employees
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to fetch employees."
        });

    }

});


// ======================================================
// GET SINGLE EMPLOYEE
// ======================================================

router.get("/:employeeId", async (req, res) => {

    try {

        const employee =
            await Employee.findOne({
                employeeId:
                    req.params.employeeId
            })
            .select("-password");


        if (!employee) {

            return res.status(404).json({
                message:
                    "Employee not found."
            });

        }


        res.json({
            employee: employee
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to fetch employee."
        });

    }

});


// ======================================================
// CREATE EMPLOYEE
// ======================================================

router.post("/", async (req, res) => {

    try {

        const {
            employeeId,
            name,
            email,
            phone,
            password,
            department
        } = req.body;


        if (
            !employeeId ||
            !name ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Employee ID, name and password are required."
            });

        }


        const existing =
            await Employee.findOne({
                employeeId: employeeId
            });


        if (existing) {

            return res.status(400).json({
                message:
                    "Employee ID already exists."
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const employee =
            new Employee({

                employeeId,

                name,

                email,

                phone,

                password: hashedPassword,

                role: "employee",

                department:
                    department ||
                    "Field Service"

            });


        await employee.save();


        res.status(201).json({

            message:
                "Employee created successfully.",

            employee: {
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                role: employee.role,
                department: employee.department
            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to create employee."
        });

    }

});


// ======================================================
// UPDATE EMPLOYEE
// ======================================================

router.put("/:employeeId", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            department,
            active
        } = req.body;


        const employee =
            await Employee.findOneAndUpdate(

                {
                    employeeId:
                        req.params.employeeId
                },

                {
                    name,
                    email,
                    phone,
                    department,
                    active
                },

                {
                    new: true
                }

            ).select("-password");


        if (!employee) {

            return res.status(404).json({
                message:
                    "Employee not found."
            });

        }


        res.json({

            message:
                "Employee updated successfully.",

            employee: employee

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to update employee."
        });

    }

});


// ======================================================
// DELETE EMPLOYEE
// ======================================================

router.delete("/:employeeId", async (req, res) => {

    try {

        const employee =
            await Employee.findOneAndDelete({
                employeeId:
                    req.params.employeeId
            });


        if (!employee) {

            return res.status(404).json({
                message:
                    "Employee not found."
            });

        }


        res.json({
            message:
                "Employee deleted successfully."
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to delete employee."
        });

    }

});


module.exports = router;