require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Employee = require("./models/Employee");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const jobRoutes = require("./routes/jobs");
const attendanceRoutes = require("./routes/attendance");


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(async () => {

        console.log(
            "MongoDB Connected Successfully"
        );

        console.log(
            "Database:",
            mongoose.connection.name
        );

        await createDefaultAdmin();

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error.message
        );

    });


// =====================================================
// CREATE DEFAULT ADMIN
// =====================================================

async function createDefaultAdmin() {

    try {

        const existingAdmin =
            await Employee.findOne({
                employeeId: "ADMIN001"
            });


        if (!existingAdmin) {

            const hashedPassword =
                await bcrypt.hash(
                    "admin123",
                    10
                );


            const admin =
                new Employee({

                    employeeId:
                        "ADMIN001",

                    name:
                        "System Administrator",

                    email:
                        "admin@chintamani.com",

                    phone:
                        "",

                    password:
                        hashedPassword,

                    role:
                        "admin",

                    department:
                        "Administration",

                    active:
                        true

                });


            await admin.save();


            console.log(
                "Default admin created."
            );

            console.log(
                "Admin ID: ADMIN001"
            );

            console.log(
                "Admin Password: admin123"
            );

        }

    } catch (error) {

        console.error(
            "Admin creation error:",
            error.message
        );

    }

}


// =====================================================
// API ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/employees",
    employeeRoutes
);


app.use(
    "/api/jobs",
    jobRoutes
);


// ATTENDANCE ROUTE
app.use(
    "/api/attendance",
    attendanceRoutes
);


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Chintamani Enterprises API is running.",

        database:
            mongoose.connection.name ||
            "Connecting..."

    });

});


// =====================================================
// 404
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        message:
            "API route not found."

    });

});


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);