const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("../models/Employee");

const router = express.Router();


// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {

    try {

        const {
            employeeId,
            password
        } = req.body;


        if (!employeeId || !password) {

            return res.status(400).json({
                message: "Employee ID and password are required."
            });

        }


        const user = await Employee.findOne({
            employeeId: employeeId
        });


        if (!user) {

            return res.status(401).json({
                message: "Invalid Employee ID or password."
            });

        }


        if (!user.active) {

            return res.status(403).json({
                message: "Your account has been disabled."
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid Employee ID or password."
            });

        }


        const token =
            jwt.sign(
                {
                    id: user._id,
                    employeeId: user.employeeId,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "8h"
                }
            );


        res.json({

            message: "Login successful.",

            token: token,

            user: {
                id: user._id,
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                active: user.active
            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({
            message: "Server error during login."
        });

    }

});


// ======================================================
// CREATE EMPLOYEE / ADMIN
// ======================================================

router.post("/register", async (req, res) => {

    try {

        const {
            employeeId,
            name,
            email,
            phone,
            password,
            role,
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


        const existingEmployee =
            await Employee.findOne({
                employeeId: employeeId
            });


        if (existingEmployee) {

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

                employeeId: employeeId,

                name: name,

                email: email,

                phone: phone,

                password: hashedPassword,

                role:
                    role === "admin"
                        ? "admin"
                        : "employee",

                department:
                    department ||
                    "Field Service"

            });


        await employee.save();


        res.status(201).json({

            message:
                "Account created successfully.",

            user: {
                employeeId: employee.employeeId,
                name: employee.name,
                role: employee.role
            }

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        res.status(500).json({
            message:
                "Server error during registration."
        });

    }

});


module.exports = router;