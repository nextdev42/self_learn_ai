const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const questionnaireRoutes = require("./routes/questionnaire");
const journeyRoutes = require("./routes/journey");
const progressRoutes = require("./routes/progress");
const rewardsRoutes = require("./routes/rewards");



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/rewards", rewardsRoutes);

// Routes
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));