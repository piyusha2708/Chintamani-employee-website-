const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            unique: true,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        customer: {
            type: String,
            required: true
        },

        location: {
            type: String,
            default: ""
        },

        date: {
            type: Date
        },

        time: {
            type: String,
            default: ""
        },

        problem: {
            type: String,
            default: ""
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        status: {
            type: String,
            enum: [
                "assigned",
                "working",
                "completed",
                "cancelled"
            ],
            default: "assigned"
        },

        employeeId: {
            type: String,
            required: true
        },

        createdBy: {
            type: String,
            default: "admin"
        },

        completedAt: {
            type: Date
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);