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
    },
  });

  const user = await db.user.findFirst();
  if (!user) {
    console.error("No user found please add at least one user");
    return;
  }
  await db.userBadge.create({
    data: {
      name: "First User Badge",
      description: "This is the first user badge",
      imageURL: "/badges/first.png",
      limit: 1,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
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
