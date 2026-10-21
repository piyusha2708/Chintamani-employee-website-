const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["employee", "admin"],
            default: "employee"
        },

        department: {
            type: String,
            default: "Field Service"
        },

        active: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);