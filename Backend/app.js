const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/user-routes");
const taskRouter = require('./routes/task-routes');

const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config()

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

// DB connection
mongoose
    .connect(
        `mongodb+srv://satendraaurangabad:${process.env.MONGODB_PASSWORORD}@cluster0.6xjeius.mongodb.net/?retryWrites=true&w=majority`,
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("DB connected successfully")
    })
    .catch((err) => {
        console.error(err);
});


app.use("/api", router);
app.use('/api', taskRouter);

// Start the server

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});