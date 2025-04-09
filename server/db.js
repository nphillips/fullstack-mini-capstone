require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const JWT = process.env.JWT;

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { token };
};

const findUserByToken = async (token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchDepts = async () => {
  const SQL = `
    SELECT 
      d.id,
      d.name,
      d."bannerImage",
      d.contact,
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
    LEFT JOIN "Professor" p
      ON d.id = p."departmentId"
    GROUP BY d.id
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProfs = async () => {
  const SQL = `
    SELECT 
      p.id,
      p.name,
      p.bio,
      p."profileImg",
      p.email,
      d.id AS department_id,
      d.name AS department_name,
      d."bannerImage" AS department_banner,
      d.contact AS department_contact
    FROM "Professor" p
    JOIN "Department" d
      ON p."departmentId" = d.id
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchDepartmentById = async (id) => {
  const SQL = `
    SELECT 
      d.id,
      d.name,
      d.description,
      d."bannerImage",
      d.contact,
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
    LEFT JOIN "Professor" p
      ON d.id = p."departmentId"
    WHERE d.id = $1
    GROUP BY d.id
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0] || null;
};

const fetchProfessorById = async (id) => {
  const SQL = `
    SELECT 
      p.id,
      p.name,
      p.bio,
      p."profileImg",
      p.email,
      d.id AS department_id,
      d.name AS department_name,
      d."bannerImage" AS department_banner,
      d.contact AS department_contact
    FROM "Professor" p
    JOIN "Department" d
      ON p."departmentId" = d.id
    WHERE p.id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0] || null;
};

module.exports = {
  client,
  fetchDepts,
  fetchProfs,
  fetchDepartmentById,
  fetchProfessorById,
  authenticate,
  findUserByToken,
};
