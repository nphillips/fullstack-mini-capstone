const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const createDepts = async () => {
  const depts = Array.from({ length: 3 }).map(() => ({
    name: faker.commerce.department(),
    description: faker.lorem.paragraph(),
    bannerImage: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
    contact: faker.phone.number("###-###-####"),
  }));

  await prisma.department.createMany({ data: depts });

  return await prisma.department.findMany();
};

const createProfs = async (departments) => {
  const profs = Array.from({ length: 10 }).map(() => {
    const dept = faker.helpers.arrayElement(departments);
    return {
      name: faker.person.fullName(),
      bio: faker.lorem.sentences(3),
      profileImg: faker.image.avatar(),
      email: faker.internet.email(),
      departmentId: dept.id,
    };
  });

  await prisma.professor.createMany({ data: profs });
};

const createUsers = async () => {
  const users = [
    { username: "joe", password: "joe_pw" },
    { username: "alice", password: "alice_pw" },
    { username: "bob", password: "bob_pw" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
      },
    });
  }
};

const seed = async () => {
  const departments = await createDepts();
  await createProfs(departments);
  await createUsers();
};

seed()
  .then(async () => {
    console.log("Seeding complete.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
