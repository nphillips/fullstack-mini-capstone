const express = require("express");
const cors = require("cors");
const app = express();

// Set up CORS *after* app is defined
app.use(cors());

app.use(express.json());

const {
  authenticate,
  findUserByToken,
  client,
  fetchDepts,
  fetchProfs,
} = require("./db");

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.get("/api/departments", async (req, res, next) => {
  try {
    const departments = await fetchDepts(); // ← from your db.js
    res.send(departments); // ← not wrapped in { data: { departments } }
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/professors", async (req, res, next) => {
  try {
    res.send(await fetchProfs());
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
