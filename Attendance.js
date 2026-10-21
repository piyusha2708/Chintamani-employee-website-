const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            trim: true
        },

        employeeName: {
            type: String,
            required: true,
            trim: true
        },

        checkInTime: {
            type: Date,
            required: true
        },

        checkOutTime: {
            type: Date,
            default: null
        },

        note: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);