// =====================================================
// CHINTAMANI ENTERPRISES
// EMPLOYEE FIELD SERVICE MANAGEMENT SYSTEM
// MAIN APP.JS
// =====================================================

const API_URL = "http://localhost:5000/api";


// =====================================================
// PAGE LISTS
// =====================================================

const EMPLOYEE_PAGES = [
    "employee.html",
    "employee-jobs.html",
    "employee-attendance.html",
    "employee-profile.html"
];

const ADMIN_PAGES = [
    "admin.html",
    "admin-jobs.html",
    "admin-attendance.html",
    "admin-employees.html",
    "admin-profile.html"
];


// =====================================================
// COMMON HELPERS
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}


function getCurrentPage() {

    return window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

}


function isEmployeePage() {

    return EMPLOYEE_PAGES.includes(
        getCurrentPage()
    );

}


function isAdminPage() {

    return ADMIN_PAGES.includes(
        getCurrentPage()
    );

}


// =====================================================
// GET LOGGED-IN EMPLOYEE
// =====================================================

function getLoggedInEmployee() {

    const employee =
        localStorage.getItem("employee");

    if (
        !employee ||
        employee === "undefined" ||
        employee === "null"
    ) {

        return null;

    }

    try {

        const parsedEmployee =
            JSON.parse(employee);

        if (
            !parsedEmployee ||
            typeof parsedEmployee !== "object"
        ) {

            localStorage.removeItem(
                "employee"
            );

            return null;

        }

        return parsedEmployee;

    } catch (error) {

        console.error(
            "Invalid employee data:",
            error
        );

        localStorage.removeItem(
            "employee"
        );

        return null;

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem("employee");
    localStorage.removeItem("token");

    window.location.href =
        "index.html";

}

window.logout = logout;


// =====================================================
// AUTHENTICATION TABS
// =====================================================

function setupAuthTabs() {

    const signInTab =
        getElement("signInTab");

    const createAccountTab =
        getElement("createAccountTab");

    const loginForm =
        getElement("loginForm");

    const registerForm =
        getElement("registerForm");

    if (
        !signInTab ||
        !createAccountTab
    ) {

        return;

    }


    signInTab.addEventListener(
        "click",
        function () {

            signInTab.classList.add(
                "active"
            );

            createAccountTab.classList.remove(
                "active"
            );

            if (loginForm) {

                loginForm.classList.remove(
                    "hidden"
                );

            }

            if (registerForm) {

                registerForm.classList.add(
                    "hidden"
                );

            }

            const loginError =
                getElement("loginError");

            const registerMessage =
                getElement("registerMessage");

            if (loginError) {

                loginError.textContent = "";

            }

            if (registerMessage) {

                registerMessage.textContent = "";

            }

        }
    );


    createAccountTab.addEventListener(
        "click",
        function () {

            createAccountTab.classList.add(
                "active"
            );

            signInTab.classList.remove(
                "active"
            );

            if (registerForm) {

                registerForm.classList.remove(
                    "hidden"
                );

            }

            if (loginForm) {

                loginForm.classList.add(
                    "hidden"
                );

            }

            const loginError =
                getElement("loginError");

            const registerMessage =
                getElement("registerMessage");

            if (loginError) {

                loginError.textContent = "";

            }

            if (registerMessage) {

                registerMessage.textContent = "";

            }

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

function setupLogin() {

    const loginForm =
        getElement("loginForm");

    if (!loginForm) {

        return;

    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const employeeIdElement =
                getElement("loginEmployeeId");

            const passwordElement =
                getElement("loginPassword");

            const errorElement =
                getElement("loginError");

            const loginButton =
                getElement("loginBtn");


            const employeeId =
                employeeIdElement
                    ? employeeIdElement.value
                        .trim()
                        .toUpperCase()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            if (errorElement) {

                errorElement.textContent = "";

            }


            if (
                !employeeId ||
                !password
            ) {

                if (errorElement) {

                    errorElement.textContent =
                        "Please enter Employee ID and password.";

                }

                return;

            }


            try {

                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.textContent =
                        "SIGNING IN...";

                }


                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    employeeId:
                                        employeeId,
                                    password:
                                        password
                                })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Invalid Employee ID or password."
                    );

                }


                if (!data.user) {

                    throw new Error(
                        "Login successful, but user information was not returned."
                    );

                }


                // IMPORTANT:
                // Always remove the old employee
                // before saving the new employee.

                localStorage.removeItem(
                    "employee"
                );


                localStorage.setItem(
                    "employee",
                    JSON.stringify(
                        data.user
                    )
                );


                if (data.token) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                }


                console.log(
                    "Logged in employee:",
                    data.user
                );


                const role =
                    String(
                        data.user.role ||
                        "employee"
                    )
                    .trim()
                    .toLowerCase();


                if (
                    role === "admin" ||
                    role === "owner"
                ) {

                    window.location.href =
                        "admin.html";

                    return;

                }


                window.location.href =
                    "employee.html";


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                if (errorElement) {

                    errorElement.textContent =
                        error.message ||
                        "Cannot connect to server.";

                }


            } finally {

                if (loginButton) {

                    loginButton.disabled = false;

                    loginButton.textContent =
                        "SIGN IN";

                }

            }

        }
    );

}


// =====================================================
// GOOGLE LOGIN BUTTON
// =====================================================

function setupGoogleLogin() {

    const googleBtn =
        getElement("googleBtn");

    if (!googleBtn) {

        return;

    }


    googleBtn.addEventListener(
        "click",
        function () {

            alert(
                "Google Sign-In is not configured yet. Please use your Employee ID and password."
            );

        }
    );

}


// =====================================================
// REGISTER
// =====================================================

function setupRegistration() {

    const registerForm =
        getElement("registerForm");

    if (!registerForm) {

        return;

    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const employeeIdElement =
                getElement(
                    "registerEmployeeId"
                );

            const nameElement =
                getElement(
                    "registerName"
                );

            const emailElement =
                getElement(
                    "registerEmail"
                );

            const phoneElement =
                getElement(
                    "registerPhone"
                );

            const passwordElement =
                getElement(
                    "registerPassword"
                );

            const departmentElement =
                getElement(
                    "registerDepartment"
                );

            const messageElement =
                getElement(
                    "registerMessage"
                );

            const registerButton =
                getElement(
                    "registerBtn"
                );


            const employeeId =
                employeeIdElement
                    ? employeeIdElement.value
                        .trim()
                        .toUpperCase()
                    : "";


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            const phone =
                phoneElement
                    ? phoneElement.value.trim()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            const department =
                departmentElement
                    ? departmentElement.value
                    : "Field Service";


            if (messageElement) {

                messageElement.textContent = "";

            }


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !employeeId ||
                !name ||
                !email ||
                !password
            ) {

                if (messageElement) {

                    messageElement.textContent =
                        "Please fill in all required fields.";

                }

                return;

            }


            if (
                !/^CE\d{3,}$/i.test(
                    employeeId
                )
            ) {

                if (messageElement) {

                    messageElement.textContent =
                        "Employee ID must be like CE001, CE002, CE003...";

                }

                return;

            }


            if (password.length < 4) {

                if (messageElement) {

                    messageElement.textContent =
                        "Password must contain at least 4 characters.";

                }

                return;

            }


            try {

                if (registerButton) {

                    registerButton.disabled = true;

                    registerButton.textContent =
                        "CREATING ACCOUNT...";

                }


                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    employeeId:
                                        employeeId,

                                    name:
                                        name,

                                    email:
                                        email,

                                    phone:
                                        phone,

                                    password:
                                        password,

                                    department:
                                        department

                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to create account."
                    );

                }


                if (messageElement) {

                    messageElement.textContent =
                        "Account created successfully! You can now sign in.";

                }


                registerForm.reset();


                setTimeout(
                    function () {

                        const signInTab =
                            getElement(
                                "signInTab"
                            );

                        if (signInTab) {

                            signInTab.click();

                        }

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );


                if (messageElement) {

                    messageElement.textContent =
                        error.message ||
                        "Unable to create account.";

                }


            } finally {

                if (registerButton) {

                    registerButton.disabled = false;

                    registerButton.textContent =
                        "CREATE ACCOUNT";

                }

            }

        }
    );

}


// =====================================================
// POPULATE EMPLOYEE INFORMATION
// =====================================================

function populateEmployeeData(
    employee
) {

    if (!employee) {

        return;

    }


    const name =
        employee.name ||
        "Employee";


    const employeeId =
        employee.employeeId ||
        "—";


    const email =
        employee.email ||
        "—";


    const phone =
        employee.phone ||
        "—";


    const department =
        employee.department ||
        "Field Service";


    let role =
        employee.role ||
        "employee";


    if (
        String(role).toLowerCase() ===
        "admin"
    ) {

        role = "Administrator";

    } else {

        role = "Employee";

    }


    // Dashboard

    document
        .querySelectorAll(
            "#employeeName, [data-employee-name]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    name;

            }
        );


    document
        .querySelectorAll(
            "#employeeId, [data-employee-id]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    employeeId;

            }
        );


    document
        .querySelectorAll(
            "#employeeDepartment, [data-employee-department]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    department;

            }
        );


    // Profile

    document
        .querySelectorAll(
            "#profileName, [data-profile-name]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    name;

            }
        );


    document
        .querySelectorAll(
            "#profileEmployeeId, [data-profile-employee-id]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    employeeId;

            }
        );


    document
        .querySelectorAll(
            "#profileEmail, [data-profile-email]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    email;

            }
        );


    document
        .querySelectorAll(
            "#profilePhone, [data-profile-phone]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    phone;

            }
        );


    document
        .querySelectorAll(
            "#profileDepartment, [data-profile-department]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    department;

            }
        );


    document
        .querySelectorAll(
            "#profileRole, [data-profile-role]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    role;

            }
        );


    // Attendance

    document
        .querySelectorAll(
            "#attendanceEmployeeName, [data-attendance-employee-name]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    name;

            }
        );

}


// =====================================================
// POPULATE ADMIN INFORMATION
// =====================================================

function populateAdminData(
    employee
) {

    if (!employee) {

        return;

    }


    const name =
        employee.name ||
        "Administrator";


    const employeeId =
        employee.employeeId ||
        "—";


    const email =
        employee.email ||
        "—";


    const phone =
        employee.phone ||
        "—";


    const department =
        employee.department ||
        "Administration";


    document
        .querySelectorAll(
            "#adminName, [data-admin-name]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    name;

            }
        );


    document
        .querySelectorAll(
            "#adminEmployeeId, [data-admin-employee-id]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    employeeId;

            }
        );


    document
        .querySelectorAll(
            "#adminEmail, [data-admin-email]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    email;

            }
        );


    document
        .querySelectorAll(
            "#adminPhone, [data-admin-phone]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    phone;

            }
        );


    document
        .querySelectorAll(
            "#adminDepartment, [data-admin-department]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    department;

            }
        );


    document
        .querySelectorAll(
            "#adminRole, [data-admin-role]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    "Administrator";

            }
        );

}


// =====================================================
// EMPLOYEE PAGE PROTECTION
// =====================================================

function protectEmployeePage() {

    if (!isEmployeePage()) {

        return;

    }


    const employee =
        getLoggedInEmployee();


    if (!employee) {

        alert(
            "Please login first."
        );

        window.location.href =
            "index.html";

        return;

    }


    const role =
        String(
            employee.role ||
            "employee"
        )
        .trim()
        .toLowerCase();


    // Admin should not use employee pages.

    if (
        role === "admin" ||
        role === "owner"
    ) {

        alert(
            "Admin accounts cannot access employee pages."
        );

        window.location.href =
            "admin.html";

        return;

    }


    populateEmployeeData(
        employee
    );

}


// =====================================================
// ADMIN PAGE PROTECTION
// =====================================================

function protectAdminPage() {

    if (!isAdminPage()) {

        return;

    }


    const employee =
        getLoggedInEmployee();


    if (!employee) {

        alert(
            "Please login first."
        );

        window.location.href =
            "index.html";

        return;

    }


    const role =
        String(
            employee.role ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        role !== "admin" &&
        role !== "owner"
    ) {

        alert(
            "Access denied. Administrator access required."
        );

        window.location.href =
            "employee.html";

        return;

    }


    populateAdminData(
        employee
    );

}


// =====================================================
// LOAD ALL EMPLOYEES
// =====================================================

async function fetchEmployees() {

    try {

        const response =
            await fetch(
                `${API_URL}/employees`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch employees."
            );

        }


        if (
            !data.employees ||
            !Array.isArray(
                data.employees
            )
        ) {

            throw new Error(
                "Employee data was not returned correctly by the server."
            );

        }


        console.log(
            "Employees loaded:",
            data.employees
        );


        return data.employees;


    } catch (error) {

        console.error(
            "FETCH EMPLOYEES ERROR:",
            error
        );

        return [];

    }

}


// =====================================================
// LOAD TECHNICIANS INTO JOB FORM
// =====================================================

async function loadTechnicians() {

    const technicianSelect =
        getElement("technician");


    if (!technicianSelect) {

        return;

    }


    // Keep the default option.

    technicianSelect.innerHTML =
        `<option value="">
            Select technician
        </option>`;


    const employees =
        await fetchEmployees();


    if (!employees.length) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "No employees available";

        option.disabled = true;

        technicianSelect.appendChild(
            option
        );

        return;

    }


    // Only active employees should be
    // available for job assignment.

    const activeEmployees =
        employees.filter(
            function (employee) {

                return (
                    employee.active !== false &&
                    String(
                        employee.role ||
                        "employee"
                    ).toLowerCase() !==
                    "admin"
                );

            }
        );


    if (!activeEmployees.length) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "No active technicians available";

        option.disabled = true;

        technicianSelect.appendChild(
            option
        );

        return;

    }


    activeEmployees.forEach(
        function (employee) {

            const option =
                document.createElement(
                    "option"
                );


            // IMPORTANT:
            // The value is employeeId because
            // jobs.js expects employeeId.

            option.value =
                employee.employeeId;


            option.textContent =
                `${employee.name} (${employee.employeeId})`;


            technicianSelect.appendChild(
                option
            );

        }
    );


    console.log(
        "Technician dropdown populated."
    );

}


// =====================================================
// ADMIN EMPLOYEE PAGE
// =====================================================

async function loadAdminEmployees() {

    const teamMembers =
        getElement("teamMembers");


    if (!teamMembers) {

        return;

    }


    const employees =
        await fetchEmployees();


    const teamCount =
        getElement("teamCount");

    const activeEmployees =
        getElement("activeEmployees");

    const inactiveEmployees =
        getElement("inactiveEmployees");


    if (teamCount) {

        teamCount.textContent =
            employees.length;

    }


    const activeCount =
        employees.filter(
            function (employee) {

                return (
                    employee.active !== false &&
                    String(
                        employee.role ||
                        ""
                    ).toLowerCase() !==
                    "admin"
                );

            }
        ).length;


    const inactiveCount =
        employees.filter(
            function (employee) {

                return (
                    employee.active === false &&
                    String(
                        employee.role ||
                        ""
                    ).toLowerCase() !==
                    "admin"
                );

            }
        ).length;


    if (activeEmployees) {

        activeEmployees.textContent =
            activeCount;

    }


    if (inactiveEmployees) {

        inactiveEmployees.textContent =
            inactiveCount;

    }


    renderEmployeeList(
        employees
    );


    const search =
        getElement(
            "employeeSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                const query =
                    search.value
                        .trim()
                        .toLowerCase();


                const filtered =
                    employees.filter(
                        function (employee) {

                            return (
                                String(
                                    employee.name ||
                                    ""
                                )
                                .toLowerCase()
                                .includes(query)
                                ||
                                String(
                                    employee.employeeId ||
                                    ""
                                )
                                .toLowerCase()
                                .includes(query)
                                ||
                                String(
                                    employee.department ||
                                    ""
                                )
                                .toLowerCase()
                                .includes(query)
                            );

                        }
                    );


                renderEmployeeList(
                    filtered
                );

            }
        );

    }

}


// =====================================================
// RENDER EMPLOYEE LIST
// =====================================================

function renderEmployeeList(
    employees
) {

    const container =
        getElement(
            "teamMembers"
        );


    if (!container) {

        return;

    }


    if (!employees.length) {

        container.innerHTML = `
            <div class="empty-card">

                <div class="empty-icon">
                    👷
                </div>

                <h3>
                    No employees found
                </h3>

                <p>
                    No employee records are available.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML = "";


    employees.forEach(
        function (employee) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-card employee-list-card";


            const status =
                employee.active === false
                    ? "Inactive"
                    : "Active";


            card.innerHTML = `

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            EMPLOYEE
                        </span>

                        <h2>
                            ${escapeHtml(
                                employee.name ||
                                "Unnamed Employee"
                            )}
                        </h2>

                    </div>

                    <div class="admin-avatar">
                        👷
                    </div>

                </div>


                <div class="profile-grid">

                    <div>

                        <span>
                            Employee ID
                        </span>

                        <strong>
                            ${escapeHtml(
                                employee.employeeId ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Department
                        </span>

                        <strong>
                            ${escapeHtml(
                                employee.department ||
                                "Field Service"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Email
                        </span>

                        <strong>
                            ${escapeHtml(
                                employee.email ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Phone
                        </span>

                        <strong>
                            ${escapeHtml(
                                employee.phone ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Status
                        </span>

                        <strong>
                            ${status}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Role
                        </span>

                        <strong>
                            ${String(
                                employee.role ||
                                "employee"
                            ).toLowerCase() ===
                            "admin"
                                ? "Administrator"
                                : "Employee"}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// HTML ESCAPE HELPER
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// CREATE JOB
// =====================================================

function setupJobForm() {

    const jobForm =
        getElement("jobForm");


    if (!jobForm) {

        return;

    }


    jobForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                getElement(
                    "jobMessage"
                );


            const submitButton =
                jobForm.querySelector(
                    'button[type="submit"]'
                );


            const jobTitle =
                getElement(
                    "jobTitle"
                );


            const customer =
                getElement(
                    "customer"
                );


            const customerPhone =
                getElement(
                    "customerPhone"
                );


            const siteAddress =
                getElement(
                    "siteAddress"
                );


            const workDetails =
                getElement(
                    "workDetails"
                );


            const technician =
                getElement(
                    "technician"
                );


            const priority =
                getElement(
                    "priority"
                );


            const scheduledDate =
                getElement(
                    "scheduledDate"
                );


            const title =
                jobTitle
                    ? jobTitle.value.trim()
                    : "";


            const customerName =
                customer
                    ? customer.value.trim()
                    : "";


            const customerPhoneValue =
                customerPhone
                    ? customerPhone.value.trim()
                    : "";


            const location =
                siteAddress
                    ? siteAddress.value.trim()
                    : "";


            const problem =
                workDetails
                    ? workDetails.value.trim()
                    : "";


            const employeeId =
                technician
                    ? technician.value
                    : "";


            const priorityValue =
                priority
                    ? priority.value
                    : "medium";


            const date =
                scheduledDate
                    ? scheduledDate.value
                    : "";


            if (message) {

                message.textContent = "";

            }


            // =================================================
            // VALIDATION
            // =================================================

            if (!title) {

                if (message) {

                    message.textContent =
                        "Please enter the job title.";

                }

                return;

            }


            if (!customerName) {

                if (message) {

                    message.textContent =
                        "Please enter the customer name.";

                }

                return;

            }


            if (!location) {

                if (message) {

                    message.textContent =
                        "Please enter the site address.";

                }

                return;

            }


            if (!employeeId) {

                if (message) {

                    message.textContent =
                        "Please select a technician.";

                }

                return;

            }


            try {

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "CREATING JOB...";

                }


                const admin =
                    getLoggedInEmployee();


                const createdBy =
                    admin &&
                    admin.employeeId
                        ? admin.employeeId
                        : "admin";


                // =================================================
                // IMPORTANT:
                // These names match your jobs.js backend.
                // =================================================

                const jobData = {

                    title:
                        title,

                    customer:
                        customerName,

                    location:
                        location,

                    date:
                        date,

                    time:
                        "",

                    problem:
                        problem,

                    priority:
                        priorityValue,

                    employeeId:
                        employeeId,

                    createdBy:
                        createdBy

                };


                console.log(
                    "Creating job:",
                    jobData
                );


                const response =
                    await fetch(
                        `${API_URL}/jobs`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    jobData
                                )
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Create job response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to create job."
                    );

                }


                if (message) {

                    message.textContent =
                        "CCTV job created successfully.";

                }


                jobForm.reset();


                // Restore technician placeholder

                if (technician) {

                    technician.innerHTML =
                        `<option value="">
                            Select technician
                        </option>`;

                    await loadTechnicians();

                }


                await loadAdminJobs();


            } catch (error) {

                console.error(
                    "CREATE JOB ERROR:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to create job.";

                }


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "CREATE CCTV JOB";

                }

            }

        }
    );

}


// =====================================================
// LOAD ADMIN JOBS
// =====================================================

async function loadAdminJobs() {

    const container =
        getElement(
            "adminJobs"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/jobs`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch jobs."
            );

        }


        const jobs =
            Array.isArray(
                data.jobs
            )
                ? data.jobs
                : [];


        renderAdminJobs(
            jobs
        );


    } catch (error) {

        console.error(
            "LOAD ADMIN JOBS ERROR:",
            error
        );


        container.innerHTML = `

            <div class="empty-card">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load jobs
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// RENDER ADMIN JOBS
// =====================================================

function renderAdminJobs(
    jobs
) {

    const container =
        getElement(
            "adminJobs"
        );


    if (!container) {

        return;

    }


    if (!jobs.length) {

        container.innerHTML = `

            <div class="empty-card">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No service jobs
                </h3>

                <p>
                    Create your first CCTV service job above.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    jobs.forEach(
        function (job) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-card job-card";


            const status =
                job.status ||
                "assigned";


            const priority =
                job.priority ||
                "medium";


            card.innerHTML = `

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            ${escapeHtml(
                                priority
                                    .toUpperCase()
                            )}
                        </span>

                        <h2>
                            ${escapeHtml(
                                job.title ||
                                "CCTV Service Job"
                            )}
                        </h2>

                    </div>

                    <div>
                        📋
                    </div>

                </div>


                <div class="profile-grid">

                    <div>

                        <span>
                            Customer
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.customer ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Technician
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.employeeId ||
                                "Not assigned"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Site
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.location ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Scheduled Date
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.date ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Priority
                        </span>

                        <strong>
                            ${escapeHtml(
                                priority
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Status
                        </span>

                        <strong>
                            ${escapeHtml(
                                status
                            )}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// LOAD EMPLOYEE JOBS
// =====================================================

async function loadEmployeeJobs() {

    const container =
        getElement(
            "employeeJobs"
        );


    if (!container) {

        return;

    }


    const employee =
        getLoggedInEmployee();


    if (
        !employee ||
        !employee.employeeId
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/jobs/employee/${encodeURIComponent(
                    employee.employeeId
                )}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch your jobs."
            );

        }


        const jobs =
            Array.isArray(
                data.jobs
            )
                ? data.jobs
                : [];


        renderEmployeeJobs(
            jobs
        );


    } catch (error) {

        console.error(
            "LOAD EMPLOYEE JOBS ERROR:",
            error
        );


        container.innerHTML = `

            <div class="empty-card">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load jobs
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// RENDER EMPLOYEE JOBS
// =====================================================

function renderEmployeeJobs(
    jobs
) {

    const container =
        getElement(
            "employeeJobs"
        );


    if (!container) {

        return;

    }


    if (!jobs.length) {

        container.innerHTML = `

            <div class="empty-card">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No assigned jobs
                </h3>

                <p>
                    New service assignments will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    jobs.forEach(
        function (job) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-card job-card";


            card.innerHTML = `

                <div class="card-heading">

                    <div>

                        <span class="section-label">
                            SERVICE JOB
                        </span>

                        <h2>
                            ${escapeHtml(
                                job.title ||
                                "CCTV Job"
                            )}
                        </h2>

                    </div>

                    <div>
                        📋
                    </div>

                </div>


                <div class="profile-grid">

                    <div>

                        <span>
                            Customer
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.customer ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Location
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.location ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Date
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.date ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Priority
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.priority ||
                                "medium"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Status
                        </span>

                        <strong>
                            ${escapeHtml(
                                job.status ||
                                "assigned"
                            )}
                        </strong>

                    </div>

                </div>


                <br>


                <div>

                    <span>
                        Work Details
                    </span>

                    <p>
                        ${escapeHtml(
                            job.problem ||
                            "No work details provided."
                        )}
                    </p>

                </div>

                <br>


                <div class="two-column">

                    <button
                        class="primary-button"
                        type="button"
                        data-job-status="working"
                        data-job-id="${escapeHtml(
                            job._id
                        )}"
                    >
                        START WORK
                    </button>


                    <button
                        class="primary-button"
                        type="button"
                        data-job-status="completed"
                        data-job-id="${escapeHtml(
                            job._id
                        )}"
                    >
                        COMPLETE JOB
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    setupJobStatusButtons();

}


// =====================================================
// UPDATE JOB STATUS
// =====================================================

function setupJobStatusButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-job-status]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const jobId =
                        button.getAttribute(
                            "data-job-id"
                        );


                    const status =
                        button.getAttribute(
                            "data-job-status"
                        );


                    if (
                        !jobId ||
                        !status
                    ) {

                        return;

                    }


                    try {

                        button.disabled =
                            true;


                        const response =
                            await fetch(
                                `${API_URL}/jobs/${encodeURIComponent(
                                    jobId
                                )}/status`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({
                                            status:
                                                status
                                        })
                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                data.message ||
                                "Unable to update job status."
                            );

                        }


                        await loadEmployeeJobs();


                    } catch (error) {

                        console.error(
                            "UPDATE JOB STATUS ERROR:",
                            error
                        );


                        alert(
                            error.message ||
                            "Unable to update job status."
                        );


                    } finally {

                        button.disabled =
                            false;

                    }

                }
            );

        }
    );

}


// =====================================================
// SCROLL TO ATTENDANCE
// =====================================================

function scrollToAttendance() {

    const attendance =
        getElement(
            "attendance"
        );


    if (attendance) {

        attendance.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}

window.scrollToAttendance =
    scrollToAttendance;


// =====================================================
// GENERIC SMOOTH SCROLL
// =====================================================

function scrollToSection(
    sectionId
) {

    const section =
        getElement(
            sectionId
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}

window.scrollToSection =
    scrollToSection;


// =====================================================
// SETUP LOGOUT BUTTONS
// =====================================================

function setupLogoutButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-logout]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                logout
            );

        }
    );

}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "===================================="
        );

        console.log(
            "Chintamani Enterprises app loaded."
        );

        console.log(
            "Current page:",
            getCurrentPage()
        );

        console.log(
            "===================================="
        );


        // =================================================
        // AUTH
        // =================================================

        setupAuthTabs();

        setupLogin();

        setupRegistration();

        setupGoogleLogin();


        // =================================================
        // AUTHENTICATION PROTECTION
        // =================================================

        protectEmployeePage();

        protectAdminPage();


        // =================================================
        // CURRENT USER
        // =================================================

        const employee =
            getLoggedInEmployee();


        if (employee) {

            populateEmployeeData(
                employee
            );

            populateAdminData(
                employee
            );

        }


        // =================================================
        // ADMIN EMPLOYEES
        // =================================================

        if (
            isAdminPage() &&
            getElement(
                "teamMembers"
            )
        ) {

            await loadAdminEmployees();

        }


        // =================================================
        // ADMIN JOBS
        // =================================================

        if (
            isAdminPage() &&
            getElement(
                "technician"
            )
        ) {

            await loadTechnicians();

        }


        if (
            isAdminPage() &&
            getElement(
                "jobForm"
            )
        ) {

            setupJobForm();

        }


        if (
            isAdminPage() &&
            getElement(
                "adminJobs"
            )
        ) {

            await loadAdminJobs();

        }


        // =================================================
        // EMPLOYEE JOBS
        // =================================================

        if (
            isEmployeePage() &&
            getElement(
                "employeeJobs"
            )
        ) {

            await loadEmployeeJobs();

        }


        // =================================================
        // LOGOUT
        // =================================================

        setupLogoutButtons();


        console.log(
            "Page initialization complete."
        );

    }
);


// =====================================================
// DEBUG FUNCTION
// =====================================================

function showCurrentUser() {

    const employee =
        getLoggedInEmployee();


    console.log(
        "Current logged-in user:",
        employee
    );


    return employee;

}

window.showCurrentUser =
    showCurrentUser;


// =====================================================
// END OF APP.JS
// =====================================================