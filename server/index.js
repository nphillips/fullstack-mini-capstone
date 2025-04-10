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
  assignProfessorToDepartment,
  removeProfessorFromDepartment,
} = require("./db");

//ADDING JWT ath middleware
const requireToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw Error("Missing token");

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const user = await findUserByToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Unauthorized. Invalid or missing token." });
  }
};

//Public Routes
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

//Auth Routes
app.post("/api/register", async (req, res, next) => {
  try {
    res.send(await register(req.body));
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

app.get("/api/auth/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw Error("Missing token");

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const user = await findUserByToken(token);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

//Admin-Only Routes (Protected)
//They now require valid token
//Department CRUD
app.post("/api/departments", requireToken, async (req, res, next) => {
  try {
    res.send(await createDept(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/departments/:id", requireToken, async (req, res, next) => {
  try {
    res.send(await updateDept(req.params.id, req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/departments/:id", requireToken, async (req, res, next) => {
  try {
    res.send(await deleteDept(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

//Professor CRUD
app.post("/api/professors", requireToken, async (req, res, next) => {
  try {
    res.send(await createProf(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.patch("/api/professors/:id", requireToken, async (req, res, next) => {
  try {
    res.send(await updateProf(req.params.id, req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/professors/:id", requireToken, async (req, res, next) => {
  try {
    res.send(await deleteProf(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

// Assign professor to department
app.post("/api/professors/:id/assign", requireToken, async (req, res, next) => {
  try {
    const { departmentId } = req.body;
    if (!departmentId) {
      return res.status(400).send({ error: "Department ID is required" });
    }
    res.send(await assignProfessorToDepartment(req.params.id, departmentId));
  } catch (ex) {
    next(ex);
  }
});

// Remove professor from department
app.post("/api/professors/:id/remove", requireToken, async (req, res, next) => {
  try {
    const result = await removeProfessorFromDepartment(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Professor not found" });
    }
    res.json(result);
  } catch (ex) {
    console.error("Error removing professor:", ex);
    res
      .status(500)
      .json({ error: "Failed to remove professor from department" });
  }
});

//Deployment Setup
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

//Server start
const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
