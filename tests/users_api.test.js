const { v4: uuid } = require("uuid");
const User = require("../models/user");

beforeAll(async () => {
  const generateUser = () => ({
    username: uuid(),
    passwordHash: uuid(),
    admin: Math.random() > 0.5,
  });

  const saveRandomUser = async () => {
    const newUser = new User(generateUser());
    console.log(newUser);
    await newUser.save();
  };

  const promises = new Array(100);

  console.log(promises);

  Promise.all(promises.map(() => saveRandomUser()));
  console.log("done loading");
});

describe("When some users already exist", () => {
  test("Adding a user succeeds", async () => {
    console.log("finding");
    const users = await User.find({});
    expect(users).toHaveLength(100);
  });
});

afterAll(async () => {
  await User.deleteMany({});
  console.log("done clearing");
});
