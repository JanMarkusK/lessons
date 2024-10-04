const express = require("express");
const { query, validationResult } = require('express-validator');
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const port = 8080;

app.use(cors());
app.use(morgan("dev"));

const catsRoutes = require("./routes/cats.routes");
const exampleRoutes = require("./routes/example.routes");
const todosRoutes = require("./routes/todos.routes");

app.use(express.json());

app.use("/cats", catsRoutes);
app.use("/todos", todosRoutes);
app.use("/examples", exampleRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
