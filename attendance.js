const express = require("express");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

const router = express.Router();


// =====================================================
// CHECK IN
// =====================================================

router.post("/checkin", async (req, res) => {
    try {

        const employeeId =
            req.body.employeeId ||
            req.user?.employeeId;

        const note =
            req.body.note || "";


        if (!employeeId) {
            return res.status(400).json({
                message: "Employee ID is required."
            });
        }


        // -------------------------------------------------
        // FIND EMPLOYEE
        // -------------------------------------------------

        const employee =
            await Employee.findOne({
                employeeId: employeeId
            });


        if (!employee) {
            return res.status(404).json({
                message: "Employee not found."
            });
        }


        if (!employee.active) {
            return res.status(403).json({
                message: "Your employee account is inactive."
            });
        }


        // -------------------------------------------------
        // CHECK FOR AN OPEN ATTENDANCE RECORD
        //
        // IMPORTANT:
        // We do NOT put a checkout time restriction.
        //
        // If the employee checked in yesterday and has
        // not checked out yet, that attendance remains open.
        // -------------------------------------------------

        const openAttendance =
            await Attendance.findOne({
                employeeId: employeeId,
                checkOutTime: null
            }).sort({
                checkInTime: -1
            });


        if (openAttendance) {
            return res.status(400).json({
                message:
                    "You are already checked in. Please check out before checking in again.",
                attendance: openAttendance
            });
        }


        // -------------------------------------------------
        // CREATE NEW ATTENDANCE RECORD
        //
        // A new record can be created after 12:00 AM because
        // the previous completed record no longer has an
        // open checkout.
        // -------------------------------------------------

        const attendance =
            new Attendance({
                employeeId: employee.employeeId,
                employeeName: employee.name,
                checkInTime: new Date(),
                checkOutTime: null,
                note: note
            });


        await attendance.save();


        res.status(201).json({
            message: "Check-in recorded successfully.",
            attendance: attendance
        });


    } catch (error) {

        console.error(
            "Check-in Error:",
            error
        );


        res.status(500).json({
            message:
                "Unable to record check-in."
        });

    }
});


// =====================================================
// CHECK OUT
// =====================================================
//
// NO TIME RESTRICTION.
//
// Employee can check out:
// - after 1 hour
// - after 8 hours
// - after midnight
// - the next morning
// - at any other time
//
// The system only requires an open check-in.
// =====================================================

router.post("/checkout", async (req, res) => {
    try {

        const employeeId =
            req.body.employeeId ||
            req.user?.employeeId;


        if (!employeeId) {
            return res.status(400).json({
                message: "Employee ID is required."
            });
        }


        // -------------------------------------------------
        // FIND THE LATEST OPEN ATTENDANCE
        //
        // IMPORTANT:
        // We DO NOT filter by today's date.
        //
        // This means an employee can:
        //
        // Check in:
        // 18 September 2026 at 11:00 PM
        //
        // Check out:
        // 19 September 2026 at 02:00 AM
        //
        // and it will still work.
        // -------------------------------------------------

        const attendance =
            await Attendance.findOne({
                employeeId: employeeId,
                checkOutTime: null
            }).sort({
                checkInTime: -1
            });


        if (!attendance) {
            return res.status(400).json({
                message:
                    "No active check-in found. Please check in first."
            });
        }


        // -------------------------------------------------
        // RECORD CHECKOUT
        // -------------------------------------------------

        attendance.checkOutTime =
            new Date();


        await attendance.save();


        res.json({
            message:
                "Check-out recorded successfully.",
            attendance: attendance
        });


    } catch (error) {

        console.error(
            "Check-out Error:",
            error
        );


        res.status(500).json({
            message:
                "Unable to record check-out."
        });

    }
});


// =====================================================
// GET CURRENT ATTENDANCE STATUS
// =====================================================

router.get("/current/:employeeId", async (req, res) => {
    try {

        const attendance =
            await Attendance.findOne({
                employeeId:
                    req.params.employeeId,
                checkOutTime: null
            }).sort({
                checkInTime: -1
            });


        res.json({
            attendance:
                attendance || null
        });


    } catch (error) {

        console.error(
            "Current Attendance Error:",
            error
        );


        res.status(500).json({
            message:
                "Unable to fetch current attendance."
        });

    }
});


// =====================================================
// GET ATTENDANCE HISTORY
// =====================================================

router.get("/history/:employeeId", async (req, res) => {
    try {

        const records =
            await Attendance.find({
                employeeId:
                    req.params.employeeId
            })
            .sort({
                checkInTime: -1
            });


        res.json({
            attendance: records
        });


    } catch (error) {

        console.error(
            "Attendance History Error:",
            error
        );


        res.status(500).json({
            message:
                "Unable to fetch attendance history."
        });

    }
});


// =====================================================
// GET ALL ATTENDANCE
// ADMIN
// =====================================================

router.get("/", async (req, res) => {
    try {

        const records =
            await Attendance.find()
                .sort({
                    checkInTime: -1
                });


        res.json({
            attendance: records
        });


    } catch (error) {

        console.error(
            "All Attendance Error:",
            error
        );


        res.status(500).json({
            message:
                "Unable to fetch attendance records."
        });

    }
});


module.exports = router;