import { exec, execSync } from "child_process";
import { db } from "~/server/db";

const main = async () => {
  console.log(
    "This will delete the database completely and reseed it with the default data."
  );
  console.log("you have 5 seconds to cancel the operation");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await db.$connect();
  console.log("Clearing database...");
  await db.$executeRaw`DROP SCHEMA public CASCADE;`;
  await db.$executeRaw`CREATE SCHEMA public;`;

  console.log("Seeding database...");

  execSync("npm run db:push");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await db.user.create({
    data: {
      email: "suarezluis@gmail.com",
      name: "Luis Suarez",
      handle: "SuarezLuis",
      image: "https://avatars.githubusercontent.com/u/20325995?v=4",
      githubLogin: "SuarezLuis",
      bio: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1, textAlign: "left" },
            content: [
              {
                text: "I made this 🔥 thing, hope you like it.... ",
                type: "text",
              },
            ],
          },
        ],
      },
    },
  });

  const user = await db.user.findFirst();
  if (!user) {
    console.error("No user found please add at least one user");
    return;
  }
  await db.userBadge.create({
    data: {
      name: "Creator User Badge",
      description: "This is the creator of the app",
      imageURL: "/badges/creator.png",
      limit: 1,
      users: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await db.userBadge.createMany({
    data: [
      {
        name: "Alpha User Badge",
        description: "This is worn by alpha users",
        imageURL: "/badges/alpha.png",
        limit: 200,
      },
      {
        name: "Beta User Badge",
        description: "This is worn by beta users",
        imageURL: "/badges/beta.png",
        limit: 500,
      },
      {
        name: "KickStarter Badge",
        description:
          "This is worn by users who supported the KickStarter Campaign",
        imageURL: "/badges/kickstarter.png",
        limit: 500,
      },
    ],
  });

  await db.take.create({
    data: {
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1, textAlign: "center" },
            content: [
              {
                text: "TypeScript",
                type: "text",
                marks: [
                  { type: "textStyle", attrs: { color: "rgb(59, 91, 219)" } },
                ],
              },
              { type: "hardBreak" },
              {
                text: ">",
                type: "text",
                marks: [
                  { type: "textStyle", attrs: { color: "rgb(240, 62, 62)" } },
                ],
              },
              { type: "hardBreak" },
              {
                text: "JavaScript",
                type: "text",
                marks: [{ type: "textStyle", attrs: { color: "yellow" } }],
              },
            ],
          },
        ],
      },
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  await db.$disconnect();
};

void main();

export default main;
