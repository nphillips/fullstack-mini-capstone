require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

//authenticate user and return JWT
const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  const user = response.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({ id: user.id }, JWT);
  return { token };
};

//get user by token
const findUserByToken = async (token) => {
  try {
    const { id } = jwt.verify(token, JWT);
    const SQL = `SELECT id, username FROM users WHERE id = $1`;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) throw Error("not authorized");
    return response.rows[0];
  } catch (err) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
};

//register admin
const register = async ({ username, password }) => {
  const SQL = `INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *`;
  const hash = await bcrypt.hash(password, 5);
  const response = await client.query(SQL, [uuid.v4(), username, hash]);
  return response.rows[0];
};

//departments
const fetchDepts = async () => {
  const SQL = `
    SELECT d.id, d.name, d."bannerImage", d.contact,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'profileImg', p."profileImg",
            'email', p.email
          )
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professors
    FROM "Department" d
    LEFT JOIN "Professor" p ON d.id = p."departmentId"
    GROUP BY d.id
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchDeptById = async (id) => {
  const SQL = `
    SELECT d.id, d.name, d."bannerImage", d.description, d.contact,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'profileImg', p."profileImg",
            'email', p.email
          )
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS professors
    FROM "Department" d
    LEFT JOIN "Professor" p ON d.id = p."departmentId"
    WHERE d.id = $1
    GROUP BY d.id
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const createDept = async ({ name, description, bannerImage, contact }) => {
  const SQL = `
    INSERT INTO "Department" (id, name, description, "bannerImage", contact)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    description,
    bannerImage,
    contact,
  ]);
  return response.rows[0];
};

const updateDept = async (id, fields) => {
  const SQL = `
    UPDATE "Department"
    SET name = $1, description = $2, "bannerImage" = $3, contact = $4
    WHERE id = $5
    RETURNING *
  `;
  const { name, description, bannerImage, contact } = fields;
  const response = await client.query(SQL, [
    name,
    description,
    bannerImage,
    contact,
    id,
  ]);
  return response.rows[0];
};

const deleteDept = async (id) => {
  const SQL = `DELETE FROM "Department" WHERE id = $1 RETURNING *`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//professors
const fetchProfs = async () => {
  const SQL = `
    SELECT p.id, p.name, p.bio, p."profileImg", p.email,
           d.id AS department_id, d.name AS department_name
    FROM "Professor" p
    JOIN "Department" d ON p."departmentId" = d.id
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProfById = async (id) => {
  const SQL = `
    SELECT p.id, p.name, p.bio, p."profileImg", p.email,
           d.id AS department_id, d.name AS department_name
    FROM "Professor" p
    JOIN "Department" d ON p."departmentId" = d.id
    WHERE p.id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const createProf = async ({ name, bio, profileImg, email, departmentId }) => {
  const SQL = `
    INSERT INTO "Professor" (id, name, bio, "profileImg", email, "departmentId")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    bio,
    profileImg,
    email,
    departmentId,
  ]);
  return response.rows[0];
};

const updateProf = async (id, fields) => {
  const SQL = `
    UPDATE "Professor"
    SET name = $1, bio = $2, "profileImg" = $3, email = $4, "departmentId" = $5
    WHERE id = $6
    RETURNING *
  `;
  const { name, bio, profileImg, email, departmentId } = fields;
  const response = await client.query(SQL, [
    name,
    bio,
    profileImg,
    email,
    departmentId,
    id,
  ]);
  return response.rows[0];
};

const deleteProf = async (id) => {
  const SQL = `DELETE FROM "Professor" WHERE id = $1 RETURNING *`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
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
};
