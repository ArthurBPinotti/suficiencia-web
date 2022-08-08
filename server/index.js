require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.json());


// Rotas

app.use("/RestAPIFurb/auth", require("./routes/authRoutes.js"));
app.use("/RestAPIFurb/comandas", require("./routes/comandasRoutes.js"));




app.listen(PORT, () => console.log("Server is running on port: " + PORT));