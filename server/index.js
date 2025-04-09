const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const {
  client,
  authenticate,
  findUserByToken,
  register,
  fetchDepts,
  fetchDeptById,
  createDept,
  updateDept,
  deleteDept,
  fetchProfs,
  fetchProfById,
  createProf,
  updateProf,
  deleteProf,
} = require("./db");

//public routes
app.get("/api/departments", async (req, res, next) => {
  try {
    res.send(await fetchDepts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/departments/:id", async (req, res, next) => {
  try {
    const dept = await fetchDeptById(req.params.id);
    dept ? res.send(dept) : res.status(404).send({ error: "Not found" });
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

app.get("/api/professors/:id", async (req, res, next) => {
  try {
    const prof = await fetchProfById(req.params.id);
    prof ? res.send(prof) : res.status(404).send({ error: "Not found" });
  } catch (ex) {
    next(ex);
  }
});

//auth routes
app.post("/api/register", async (req, res, next) => {
  try {
    res.send(await register(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", async (req, res, next) => {
  try {
    const user = await findUserByToken(req.headers.authorization);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

//department CRUD
app.post("/api/departments", async (req, res, next) => {
  try {
    res.send(await createDept(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/departments/:id", async (req, res, next) => {
  try {
    res.send(await updateDept(req.params.id, req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/departments/:id", async (req, res, next) => {
  try {
    res.send(await deleteDept(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

//professor CRUD
app.post("/api/professors", async (req, res, next) => {
  try {
    res.send(await createProf(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/professors/:id", async (req, res, next) => {
  try {
    res.send(await updateProf(req.params.id, req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/professors/:id", async (req, res, next) => {
  try {
    res.send(await deleteProf(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

//start server
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
