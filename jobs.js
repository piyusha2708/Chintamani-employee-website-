const express = require("express");

const Job = require("../models/Job");

const router = express.Router();


// ======================================================
// CREATE JOB
// ======================================================

router.post("/", async (req, res) => {

    try {

        const {
            title,
            customer,
            location,
            date,
            time,
            problem,
            priority,
            employeeId,
            createdBy
        } = req.body;


        if (
            !title ||
            !customer ||
            !employeeId
        ) {

            return res.status(400).json({
                message:
                    "Title, customer and employee ID are required."
            });

        }


        const jobCount =
            await Job.countDocuments();


        const jobId =
            "JOB" +
            String(jobCount + 1)
                .padStart(4, "0");


        const job =
            new Job({

                jobId,

                title,

                customer,

                location,

                date,

                time,

                problem,

                priority:
                    priority || "medium",

                employeeId,

                createdBy:
                    createdBy || "admin"

            });


        await job.save();


        res.status(201).json({

            message:
                "Job created successfully.",

            job: job

        });


    } catch (error) {

        console.error(
            "Create Job Error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to create job."
        });

    }

});


// ======================================================
// GET ALL JOBS
// ======================================================

router.get("/", async (req, res) => {

    try {

        const jobs =
            await Job.find()
                .sort({
                    createdAt: -1
                });


        res.json({
            jobs: jobs
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to fetch jobs."
        });

    }

});


// ======================================================
// GET EMPLOYEE JOBS
// ======================================================

router.get(
    "/employee/:employeeId",
    async (req, res) => {

        try {

            const jobs =
                await Job.find({

                    employeeId:
                        req.params.employeeId,

                    status: {
                        $ne: "completed"
                    }

                })
                .sort({
                    date: 1
                });


            res.json({
                jobs: jobs
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to fetch employee jobs."
            });

        }

    }
);


// ======================================================
// GET EMPLOYEE HISTORY
// ======================================================

router.get(
    "/history/:employeeId",
    async (req, res) => {

        try {

            const jobs =
                await Job.find({

                    employeeId:
                        req.params.employeeId,

                    status: "completed"

                })
                .sort({
                    completedAt: -1
                });


            res.json({
                jobs: jobs
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to fetch work history."
            });

        }

    }
);


// ======================================================
// UPDATE JOB STATUS
// ======================================================

router.put(
    "/:jobId/status",
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "assigned",

                "working",

                "completed",

                "cancelled"

            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid job status."
                });

            }


            const updateData = {
                status: status
            };


            if (status === "completed") {

                updateData.completedAt =
                    new Date();

            }


            const job =
                await Job.findOneAndUpdate(

                    {
                        _id:
                            req.params.jobId
                    },

                    updateData,

                    {
                        new: true
                    }

                );


            if (!job) {

                return res.status(404).json({
                    message:
                        "Job not found."
                });

            }


            res.json({

                message:
                    "Job status updated successfully.",

                job: job

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to update job status."
            });

        }

    }
);


// ======================================================
// GET SINGLE JOB
// ======================================================

router.get("/:jobId", async (req, res) => {

    try {

        const job =
            await Job.findById(
                req.params.jobId
            );


        if (!job) {

            return res.status(404).json({
                message:
                    "Job not found."
            });

        }


        res.json({
            job: job
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to fetch job."
        });

    }

});


// ======================================================
// DELETE JOB
// ======================================================

router.delete("/:jobId", async (req, res) => {

    try {

        const job =
            await Job.findByIdAndDelete(
                req.params.jobId
            );


        if (!job) {

            return res.status(404).json({
                message:
                    "Job not found."
            });

        }


        res.json({
            message:
                "Job deleted successfully."
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to delete job."
        });

    }

});


module.exports = router;