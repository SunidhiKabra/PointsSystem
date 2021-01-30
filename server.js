// Import packages
const express = require("express");
const app = express();

app.use(express.json({ extended: false }));

// Routes
app.use("/points", require("./api/routes/routes"));

const PORT = process.env.PORT || 5000;

//Starting the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
