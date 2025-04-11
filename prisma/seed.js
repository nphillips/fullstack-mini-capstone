const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const createDepts = async () => {
  const depts = [
    {
      name: "Department of Temporal Studies",
      description:
        "Exploring the mysteries of time travel, temporal mechanics, and historical anomalies. Our researchers investigate the nature of time, causality, and the implications of temporal manipulation.",
      bannerImage: "/dept-time.webp",
      contact: "555-0101",
    },
    {
      name: "Department of Cryptozoology",
      description:
        "Dedicated to the study of mythical creatures, cryptids, and undiscovered species. Our faculty combines folklore, biology, and field research to investigate legendary beings.",
      bannerImage: "/dept-crypto.webp",
      contact: "555-0102",
    },
    {
      name: "Department of Culinary Alchemy",
      description:
        "Where gastronomy meets magic. Our department explores the magical properties of food, experimental cooking techniques, and the transformation of ingredients through culinary science.",
      bannerImage: "/dept-culinary.webp",
      contact: "555-0103",
    },
    {
      name: "Department of Dream Engineering",
      description:
        "Pioneering research in lucid dreaming, dream manipulation, and consciousness studies. Our faculty investigates the intersection of dreams, reality, and human consciousness.",
      bannerImage: "/dept-dream.webp",
      contact: "555-0104",
    },
  ];

  await prisma.department.createMany({ data: depts });

  return await prisma.department.findMany();
};

const createProfs = async (departments) => {
  const professors = [
    {
      name: "Dr. Eleanor Chronos",
      bio: "A pioneer in temporal mechanics with over 20 years of experience studying time anomalies. Her groundbreaking work on temporal paradoxes has earned her numerous accolades in the field.",
      profileImg: "/prof-chronos.webp",
      email: "echronos@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Temporal Studies"
      ).id,
    },
    {
      name: "Dr. Marcus Bigfoot",
      bio: "World-renowned cryptozoologist who has led expeditions to remote locations in search of legendary creatures. His research on Sasquatch migration patterns is considered definitive in the field.",
      profileImg: "/prof-bigfoot.webp",
      email: "mbigfoot@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Cryptozoology"
      ).id,
    },
    {
      name: "Chef Isabella Alchemist",
      bio: "Master of culinary transformation who has revolutionized molecular gastronomy. Her work on edible potions and magical ingredients has earned her three Michelin stars.",
      profileImg: "/prof-alchemist.webp",
      email: "ialchemist@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Culinary Alchemy"
      ).id,
    },
    {
      name: "Dr. Samuel Dreamweaver",
      bio: "Leading expert in lucid dreaming and consciousness studies. His research on dream manipulation has helped countless individuals achieve better sleep and enhanced creativity.",
      profileImg: "/prof-dreamweaver.webp",
      email: "sdreamweaver@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Dream Engineering"
      ).id,
    },
    {
      name: "Dr. Victoria Paradox",
      bio: "Specialist in temporal causality and parallel universe theory. Her work on the butterfly effect has fundamentally changed our understanding of time travel consequences.",
      profileImg: "/prof-paradox.webp",
      email: "vparadox@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Temporal Studies"
      ).id,
    },
    {
      name: "Dr. Arthur Ness",
      bio: "Marine cryptozoologist famous for his research on lake monsters and sea serpents. His underwater exploration techniques have revolutionized the field of aquatic cryptid research.",
      profileImg: "/prof-ness.webp",
      email: "aness@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Cryptozoology"
      ).id,
    },
    {
      name: "Chef Marco Mystic",
      bio: "Expert in magical ingredient combinations and their effects on human consciousness. His work on mood-altering cuisine has opened new doors in therapeutic cooking.",
      profileImg: "/prof-mystic.webp",
      email: "mmystic@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Culinary Alchemy"
      ).id,
    },
    {
      name: "Dr. Luna Somnus",
      bio: "Pioneer in dream engineering and sleep architecture. Her research on dream sharing and collective consciousness has pushed the boundaries of what we thought possible in dream science.",
      profileImg: "/prof-somnus.webp",
      email: "lsomnus@university.edu",
      departmentId: departments.find(
        (d) => d.name === "Department of Dream Engineering"
      ).id,
    },
  ];

  await prisma.professor.createMany({
    data: professors,
  });
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
