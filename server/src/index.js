const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelizePromise = require("./configs/sequelizeConfig");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const adminRouter = require("./routes/adminRoutes");
// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
// const corsOptions = {
//     origin: [
//         /https:\/\/app\.mathsaya4kids\.site($|\/.*)/
//     ],
//     methods: "GET,PUT,POST,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options("*", cors(corsOptions));

app.use(cors());

app.options("*", cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/event", eventRouter);
app.use("/admin", adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start server
const startServer = async () => {
    try {
        const sequelize = await sequelizePromise;
        await sequelize.sync({ alter: false }); // Use { force: true } or { alter: true } during development to drop and recreate tables
        console.log("Connected to the database");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
